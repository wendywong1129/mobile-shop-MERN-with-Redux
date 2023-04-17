import express from "express";
import { authAdmin, authToken } from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getOrderById,
  getOrders,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(authToken, addOrderItems)
  .get(authToken, authAdmin, getOrders);
router.route("/myOrders").get(authToken, getMyOrders);
router.route("/:orderId").get(authToken, getOrderById);
router.route("/:id/pay").put(authToken, updateOrderToPaid);
router.route("/:id/deliver").put(authToken, authAdmin, updateOrderToDelivered);

export default router;
