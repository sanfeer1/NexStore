import Product from '../models/Product.js';

// @desc    Get all products with search, multi-facet filtering, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Keyword search (title, description, tags, brand)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    // In-stock only filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOptions = { price: 1 };
    else if (sortBy === 'price-desc') sortOptions = { price: -1 };
    else if (sortBy === 'rating') sortOptions = { ratings: -1 };
    else if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    else if (sortBy === 'popular') sortOptions = { numReviews: -1 };

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(8);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if valid ObjectId or query by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Please provide both rating and review comment');
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
    } else {
      // Add new review
      product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      });
    }

    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      ratings: product.ratings,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      brand,
      images,
      featured,
      isNewArrival,
      tags,
    } = req.body;

    if (!title || !description || price === undefined || !category) {
      res.status(400);
      throw new Error('Please provide title, description, price, and category');
    }

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice: discountPrice || 0,
      stock: stock !== undefined ? stock : 10,
      category,
      brand: brand || 'Generic',
      images: images || [],
      featured: Boolean(featured),
      isNewArrival: Boolean(isNewArrival),
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const fields = [
      'title',
      'description',
      'price',
      'discountPrice',
      'stock',
      'category',
      'brand',
      'images',
      'featured',
      'isNewArrival',
      'tags',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
