import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

//@desc    create an order
//@route   POST/api/orders
//@access  private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    deliveryDetails,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order information");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      deliveryDetails,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

//@desc    get the order by orderId
//@route   GET/api/orders/:orderId
//@access  private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Cannot find the order");
  }
});

//@desc    get all orders
//@route   GET/api/orders
//@access  private(admin only)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

//@desc    get my orders
//@route   GET/api/orders/myOrders
//@access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { addOrderItems, getOrderById, getOrders, getMyOrders };
