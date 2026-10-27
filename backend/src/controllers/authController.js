import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendWelcomeEmail, sendLoginAlertEmail } from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Auto-promote first registered user to admin if desired, or default to customer
    const count = await User.countDocuments({});
    const role = count === 0 ? 'admin' : 'customer';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user).catch((err) =>
      console.error('[Welcome Email Error]:', err.message)
    );

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
      token: generateToken(user._id),
      message: 'Account registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Send Login Security Alert Email asynchronously
    const clientIp =
      req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Localhost';
    sendLoginAlertEmail(user, clientIp).catch((err) =>
      console.error('[Login Alert Error]:', err.message)
    );

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
      },
      token: generateToken(user._id),
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & password
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses,
      },
      token: generateToken(updatedUser._id),
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add shipping address to user profile
// @route   POST /api/auth/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { street, city, state, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (!street || !city || !state || !postalCode) {
      res.status(400);
      throw new Error('Please fill all required address fields');
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      street,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: Boolean(isDefault) || user.addresses.length === 0,
    });

    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses,
      message: 'Address added successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses,
      message: 'Address removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
