import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { deliveryDetails } = cart;
  if (!deliveryDetails) {
    navigate("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeOrder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Choose your payment method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked={paymentMethod === "PayPal"}
              className="my-2"
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Cash On Delivery"
              id="CashOnDelivery"
              name="paymentMethod"
              value="CashOnDelivery"
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked={paymentMethod === "CashOnDelivery"}
              className="my-2"
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          Next Step
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
