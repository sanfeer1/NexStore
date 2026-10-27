import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Initialize Razorpay instance if keys exist
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.includes('your_') || keyId === 'rzp_test_placeholder') {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Get Razorpay Public Key ID
// @route   GET /api/payment/razorpay/key
// @access  Public
export const getRazorpayKey = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('your_');

  res.status(200).json({
    success: true,
    keyId,
    isMock,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.isPaid) {
      res.status(400);
      throw new Error('This order has already been paid');
    }

    // Amount in subunits (paise for INR, cents for USD). Razorpay expects an integer.
    const amountInSubunits = Math.round(order.totalPrice * 100);
    const currency = process.env.RAZORPAY_CURRENCY || 'INR';

    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      // Graceful Sandbox Mock Order when live keys are not yet configured
      const mockRazorpayOrder = {
        id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        entity: 'order',
        amount: amountInSubunits,
        currency,
        receipt: order._id.toString(),
        status: 'created',
      };

      return res.status(200).json({
        success: true,
        razorpayOrder: mockRazorpayOrder,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
        isMock: true,
      });
    }

    // Official Razorpay API order
    const options = {
      amount: amountInSubunits,
      currency,
      receipt: `rcpt_${order._id.toString().substring(0, 14)}`,
      notes: {
        dbOrderId: order._id.toString(),
        userEmail: req.user.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
      isMock: false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      isMock,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Cryptographic signature verification
    if (!isMock && keySecret && !keySecret.includes('your_')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        res.status(400);
        throw new Error('Invalid Razorpay payment signature. Payment verification failed.');
      }
    }

    // Signature verified -> mark paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'Confirmed';
    order.paymentMethod = 'Razorpay';
    order.paymentResult = {
      id: razorpay_payment_id || `pay_${Date.now()}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: 'Razorpay payment verified and order confirmed successfully',
    });
  } catch (error) {
    next(error);
  }
};
