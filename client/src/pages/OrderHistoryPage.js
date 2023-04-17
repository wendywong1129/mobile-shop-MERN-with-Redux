import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listMyOrder } from "../actions/orderActions";

const OrderHistoryPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const orderMyList = useSelector((state) => state.orderMyList);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(listMyOrder());
    }
  }, [user, navigate, dispatch]);

  const {
    loading,
    orders,
    error,
  } = orderMyList;

  return (
    <div>
      <h2>My orders</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Payment</th>
              <th>Dispatch</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Order Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderHistoryPage;
