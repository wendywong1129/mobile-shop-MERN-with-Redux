import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Row, Col, Image, Card, Button } from "react-bootstrap";
import axios from "axios";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";

const OrderPage = () => {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [paypalState, paypalDispatch] = usePayPalScriptReducer();
  const { isPending } = paypalState;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    order.shippingPrice = addDecimals(order.itemsPrice > 5000 ? 0 : 20);

    order.totalPrice = addDecimals(
      Number(order.itemsPrice) + Number(order.shippingPrice)
    );
  }

  const loadPaypalScript = async () => {
    const { data: clientId } = await axios.get("/api/config/paypal");
    paypalDispatch({
      type: "resetOptions",
      value: {
        "client-id": clientId,
        currency: "AUD",
      },
    });
    paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      dispatch(payOrder(orderId, details));
    });
  };

  const onError = (err) => {
    console.log(err);
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else {
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay, successDeliver]); // eslint-disable-line

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order Number: {order._id}</h1>
      <Row>
        <Col md={9}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Delivery</h2>
              <p>
                <strong>Shipping Address: </strong>
                {order.deliveryDetails.address},&nbsp;
                {order.deliveryDetails.suburb},&nbsp;
                {order.deliveryDetails.city},&nbsp;
                {order.deliveryDetails.postalCode}
              </p>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Time of Dispatch:&nbsp;
                  {order.deliveredAt.substring(0, 10) +
                    " " +
                    order.deliveredAt.substring(11, 19)}
                </Message>
              ) : (
                <Message variant="danger">Not dispatched</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment</h2>
              <p>
                <strong>Payment Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Time of Payment:&nbsp;
                  {order.paidAt.substring(0, 10) +
                    " " +
                    order.paidAt.substring(11, 19)}
                </Message>
              ) : (
                <Message variant="danger">Pending payment</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order</h2>
              {order.orderItems.length === 0 ? (
                <Message>The shopping cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price} = {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Subtotal</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Delivery Fee</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PayPal BTN */}
              {!order.isPaid && order.paymentMethod === "PayPal" && (
                <div>
                  {isPending ? (
                    <div className="spinner" />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  )}
                  {loadingPay && <div>Loading...</div>}
                </div>
              )}
              {/* Dispatch BTN */}
              {user && user.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    onClick={deliverHandler}
                  >
                    Dispatch
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderPage;
