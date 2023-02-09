import express from "express";
import { authAdmin, authToken } from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getOrderById,
  getOrders,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authToken, addOrderItems)
  .get(authToken, authAdmin, getOrders);
router.route("/myOrders").get(authToken, getMyOrders);
router.route("/:orderId").get(authToken, getOrderById);
// router.route("/myOrders").get(authToken, getMyOrders);
export default router;
