import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import ProductListPage from "./pages/ProductListPage";
import ProductCreatePage from "./pages/ProductCreatePage";
import ProductEditPage from "./pages/ProductEditPage";
import OrderListPage from "./pages/OrderListPage";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <PayPalScriptProvider
            deferLoading={true}
            options={{
              components: "buttons",
              currency: "AUD",
              "disable-funding": "credit,card,p24",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products/:productId" element={<ProductPage />} />
              <Route path="/cart/:productId?" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeOrder" element={<PlaceOrderPage />} />
              <Route path="/order/:orderId" element={<OrderPage />} />
              <Route path="/admin/userList" element={<UserListPage />} />
              <Route
                path="/admin/user/:userId/edit"
                element={<UserEditPage />}
              />
              <Route path="/admin/productList" element={<ProductListPage />} />
              <Route
                path="/admin/productList/:pageNumber"
                element={<ProductListPage />}
              />
              <Route
                path="/admin/product/create"
                element={<ProductCreatePage />}
              />
              <Route
                path="/admin/product/:productId/edit"
                element={<ProductEditPage />}
              />
              <Route path="/admin/orderList" element={<OrderListPage />} />
              <Route path="/search/:keyword" element={<HomePage />} />
              <Route
                path="/search/:keyword/page/:pageNumber"
                element={<HomePage />}
              />
              <Route path="/page/:pageNumber" element={<HomePage />} />
            </Routes>
          </PayPalScriptProvider>
        </Container>
      </main>
      <Footer></Footer>
    </Router>
  );
}

export default App;
