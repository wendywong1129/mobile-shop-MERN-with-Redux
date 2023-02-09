import express from "express";
// import Product from "../models/productModel.js";
// import asyncHandler from "express-async-handler";
import {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProductById,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { authAdmin, authToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const products = await Product.find({});
//     res.json(products);
//   })
// );

// router.get(
//   "/:productId",
//   asyncHandler(async (req, res) => {
//     // const product = products.find(
//     //   (product) => product._id === req.params.productId
//     // );
//     const product = await Product.findById(req.params.productId);
//     if (product) {
//       res.json(product);
//     } else {
//       // res.status(404).json({ message: "Cannot find the product!" });
//       res.status(404);
//       throw new Error("Cannot find the product!");
//     }
//   })
// );

router.route("/").get(getProducts).post(authToken, authAdmin, createProduct);
router.route("/top").get(getTopProducts);

router
  .route("/:productId")
  .get(getProductById)
  .delete(authToken, authAdmin, deleteProductById)
  .put(authToken, authAdmin, updateProductById);
router.route("/:productId/reviews").post(authToken, createProductReview);

export default router;
