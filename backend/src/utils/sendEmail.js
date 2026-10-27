import nodemailer from 'nodemailer';

let cachedEtherealTransporter = null;

/**
 * Configure Nodemailer Transporter
 */
const getTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS || "";
  const pass = rawPass.replace(/\s+/g, "").trim();

  // 1. If real SMTP credentials are provided in .env
  if (host && user && pass && !user.includes('your_')) {
    return {
      transporter: nodemailer.createTransport({
        service: host.includes('gmail') ? 'gmail' : undefined,
        host: host.includes('gmail') ? undefined : host,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: user.trim(), pass },
      }),
      isReal: true,
    };
  }

  // 2. Automated Ethereal Sandbox Fallback (Live Web-Viewable Email link)
  if (!cachedEtherealTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      cachedEtherealTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      // Fallback in-memory logger
      return {
        transporter: {
          sendMail: async (options) => {
            console.log('\n[CONSOLE EMAIL PREVIEW]');
            console.log(`To: ${options.to} | Subject: ${options.subject}`);
            return { messageId: 'mock' };
          },
        },
        isReal: false,
      };
    }
  }

  return { transporter: cachedEtherealTransporter, isReal: false };
};

/**
 * Generic Send Email function
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const { transporter, isReal } = await getTransporter();
    const fromName = process.env.FROM_NAME || 'NexStore Concierge';
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@nexstore.com';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text: text || '',
      html,
    });

    if (!isReal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n================== [SANDBOX EMAIL DELIVERED] ==================');
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      if (previewUrl) {
        console.log(`🔗 Click to view the actual rendered email:`);
        console.log(`   ${previewUrl}`);
      }
      console.log('===============================================================\n');
    } else {
      console.log(`[Email Service] Live email sent to: ${to}`);
    }

    return info;
  } catch (error) {
    console.error(`[Email Service Warning]: Failed to deliver email to ${to}:`, error.message);
    return null;
  }
};

/**
 * 1. Sign-Up Welcome Email Template
 */
export const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to NexStore, ${user.name.split(' ')[0]}! ✨`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; align-items: center; margin-bottom: 24px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; color: #fff; text-align: center; line-height: 40px;">N</div>
          <span style="font-size: 22px; font-weight: 800; color: #fff; margin-left: 12px; letter-spacing: -0.5px;">NexStore</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Your Account is Ready</h1>
        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin-bottom: 24px;">
          Hello <strong>${user.name}</strong>, thank you for joining NexStore. Discover precision personal audio, premium tech, and lifestyle collections designed for creators.
        </p>

        <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
          <span style="font-size: 13px; color: #818cf8; font-weight: 700; text-transform: uppercase;">Exclusive Member Welcome Offer</span>
          <h2 style="font-size: 26px; color: #ffffff; margin: 8px 0; font-family: monospace; letter-spacing: 2px;">SAVE20</h2>
          <p style="font-size: 13px; color: #cbd5e1; margin: 0;">Apply at checkout to enjoy <strong>20% OFF</strong> your first order!</p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/shop" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">Explore Storefront &rarr;</a>
        </div>

        <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
          Sent to ${user.email} • NexStore Inc.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text: `Hello ${user.name}, welcome to NexStore! Use coupon code SAVE20 for 20% off your first luxury order at ${process.env.CLIENT_URL || 'http://localhost:5173'}.`,
    html,
  });
};

/**
 * 2. Login Security Alert Email Template
 */
export const sendLoginAlertEmail = async (user, clientIp = 'Unknown IP') => {
  const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const subject = `Security Alert: New sign-in to your NexStore account 🔒`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Security Notification</h2>
        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6;">
          Hello <strong>${user.name}</strong>, a new sign-in was detected on your NexStore account.
        </p>

        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>Account:</strong> ${user.email}</p>
          <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${loginTime} IST</p>
          <p style="margin: 4px 0;"><strong>IP Address:</strong> ${clientIp}</p>
        </div>

        <p style="font-size: 14px; color: #9ca3af; line-height: 1.5;">
          If this was you, you can safely disregard this message. If you did not authorize this login, please sign in immediately and update your password from your account profile.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text: `Security Alert: A new login to ${user.email} occurred at ${loginTime}. If this wasn't you, please secure your account immediately.`,
    html,
  });
};

/**
 * 3. Order Placement Confirmation & Receipt Email Template
 */
export const sendOrderConfirmationEmail = async (order, user) => {
  const orderId = order._id.toString().substring(0, 8).toUpperCase();
  const subject = `Order Confirmed: #${orderId} — Thank you for your purchase! 🛍️`;

  const itemsHtml = order.orderItems
    .map(
      (item) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
          <div>
            <strong style="font-size: 15px; color: #ffffff;">${item.title}</strong>
            <div style="font-size: 13px; color: #9ca3af;">Quantity: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
          </div>
          <span style="font-size: 15px; font-weight: 700; color: #ffffff;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      `
    )
    .join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; line-height: 50px; margin-bottom: 12px;">✓</div>
          <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0;">Order #${orderId} Placed!</h1>
          <p style="font-size: 14px; color: #9ca3af; margin-top: 6px;">We have received your order and our fulfillment team is preparing it.</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin: 0 0 12px 0;">Items Ordered</h3>
          ${itemsHtml}

          <div style="margin-top: 16px; font-size: 14px; color: #9ca3af;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Subtotal:</span>
              <span>₹${order.itemsPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Shipping:</span>
              <span>${order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice?.toLocaleString('en-IN')}`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Taxes:</span>
              <span>₹${order.taxPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #34d399; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
              <span>Total Amount:</span>
              <span>₹${order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin: 0 0 8px 0;">Delivery Destination</h3>
          <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; margin: 0;">
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
            ${order.shippingAddress.country}
          </p>
          <p style="font-size: 13px; color: #818cf8; margin-top: 10px;">Payment Method: <strong>${order.paymentMethod}</strong> (${order.isPaid ? 'Paid' : 'Pending'})</p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">Track Shipment Live &rarr;</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text: `Your NexStore Order #${orderId} for ₹${order.totalPrice?.toLocaleString('en-IN')} has been placed. Track status: ${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}`,
    html,
  });
};

/**
 * 4. Order Cancellation Notification Email Template
 */
export const sendOrderCancelledEmail = async (order, user, reason = 'Cancelled by Customer') => {
  const orderId = order._id.toString().substring(0, 8).toUpperCase();
  const subject = `Order Cancellation Notice: #${orderId} — NexStore`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: inline-flex; align-items: center; justify-content: center; font-size: 26px; line-height: 50px; margin-bottom: 12px;">✕</div>
          <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0;">Order #${orderId} Cancelled</h1>
          <p style="font-size: 14px; color: #f87171; margin-top: 6px;">Reason: ${reason}</p>
        </div>

        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin-bottom: 20px;">
          Hello <strong>${user.name}</strong>, your order #${orderId} of <strong>₹${order.totalPrice?.toLocaleString('en-IN')}</strong> has been cancelled.
        </p>

        ${
          order.isPaid
            ? `<div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 14px; font-size: 14px; color: #34d399; margin-bottom: 20px;">
                Since payment was collected via ${order.paymentMethod}, our finance department has initiated a full refund back to your original payment method (3-5 business days).
              </div>`
            : ''
        }

        <p style="font-size: 14px; color: #9ca3af; line-height: 1.5;">
          If you have any questions or cancelled by mistake, our 24/7 concierge support is always here to assist you.
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/shop" style="display: inline-block; background: rgba(255, 255, 255, 0.08); color: #ffffff; font-weight: 600; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px;">Continue Browsing NexStore</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text: `Order #${orderId} has been cancelled (${reason}). Total amount: ₹${order.totalPrice?.toLocaleString('en-IN')}.`,
    html,
  });
};

/**
 * 5. Order Status Update Email Template (Shipped / Out for Delivery / Delivered)
 */
export const sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  const orderId = order._id.toString().substring(0, 8).toUpperCase();
  const subject = `Shipment Update: Order #${orderId} is now ${newStatus}! 🚚`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; border-radius: 16px; padding: 36px; border: 1px solid rgba(255, 255, 255, 0.08);">
        <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 12px;">Shipment Progress Update</h2>
        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6;">
          Hello <strong>${user.name}</strong>, your order #${orderId} status has been updated to:
        </p>

        <div style="text-align: center; margin: 24px 0; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px;">
          <span style="font-size: 13px; color: #818cf8; text-transform: uppercase; font-weight: 700;">Current Delivery Stage</span>
          <h1 style="font-size: 28px; color: #34d399; margin: 8px 0; font-weight: 800;">${newStatus.toUpperCase()}</h1>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">View Shipment Details &rarr;</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text: `Your NexStore order #${orderId} status is now: ${newStatus}. View details: ${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${order._id}`,
    html,
  });
};
