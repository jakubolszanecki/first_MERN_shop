import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";

import { logout } from "../../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const OrdersPageComponent = ({fetchOrders}) => {

  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then(res => setOrders(res)).catch(error => {
      // console.log(error.response.data.message ? error.response.data.message : error.response.data);
      dispatch(logout());
    });
  }, []);

  return (
    <Container>
      <Row className="mt-5">

        <Col md={2}>
          <AdminLinksComponent />
        </Col>

        <Col md={10}>
          <h1>Orders</h1>
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Delivered</th>
                <th>Payment Method</th>
                <th>Order details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {order.user.name !== null ? (
                      <>
                      {order.user.name} {order.user.lastName}
                      </>
                    ) : null}
                  </td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.orderTotal.cartSubtotal}</td>
                  <td>
                    {order.isDelivered ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <Link to={`/admin/order-details/${order._id}`}>
                      Go to order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

      </Row>
    </Container>

  )
};

export default OrdersPageComponent;
