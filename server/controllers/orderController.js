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

//@desc    update the payment status of the order by orderId
//@route   PUT/api/orders/:id/pay
//@access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (order.isPaid) {
      throw new Error("Order is already paid");
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Cannot find the order");
  }
});

//@desc    update the deliver status of the order by orderId
//@route   PUT/api/orders/:id/deliver
//@access  private(admin only)
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Cannot find the order");
  }
});

export {
  addOrderItems,
  getOrderById,
  getOrders,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};
