import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc    get all products
//@route   GET/api/products?keyword=${keyword}&pageNumber=${pageNumber}
//@access  public
const getProducts = asyncHandler(async (req, res) => {
  // const products = await Product.find({});
  // res.json(products);

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  // const products = await Product.find({ ...keyword });
  // res.json(products);
  const page = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({ ...keyword });
  const pageSize = 4;
  const pages = Math.ceil(count / pageSize);
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, pages, page });
});

//@desc    get the product
//@route   GET/api/products/:productId
//@access  public
const getProductById = asyncHandler(async (req, res) => {
  // const product = products.find(
  //   (product) => product._id === req.params.productId
  // );
  const product = await Product.findById(req.params.productId);
  console.log(req.params.productId);
  if (product) {
    res.json(product);
  } else {
    // res.status(404).json({ message: "Cannot find the product!" });
    res.status(404);
    throw new Error("Cannot find the product!");
  }
});

//@desc    delete the product
//@route   DELETE/api/products/:productId
//@access  private（admin only）
const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (product) {
    await product.remove();
    res.json({ message: "Product is deleted" });
  } else {
    res.status(404);
    throw new Error("Cannot find the product");
  }
});

//@desc    create a product
//@route   POST/api/products
//@access  private（admin only）
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = new Product({
    user: req.user._id,
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews: 0,
    description,
    rating: 0,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc    update the product
//@route   PUT/api/products/:productId
//@access  private（admin only）
const updateProductById = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await Product.findById(req.params.productId);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Cannot find the product");
  }
});

//@desc    create a review
//@route   POST/api/products/:productId/reviews
//@access  private（Not admin only, the login user who bought the product before can create a review）
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already commented the product.");
    }
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((total, review) => total + review.rating, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Comment successfully!" });
  } else {
    res.status(404);
    throw new Error("Cannot find the product!");
  }
});

//@desc    get top 3 products
//@route   GET/api/products/top
//@access  public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ price: 1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProductById,
  createProductReview,
  getTopProducts,
};
