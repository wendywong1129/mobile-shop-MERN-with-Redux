import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from "./reducers/productReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userProfileReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userGetReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderListReducer,
  orderMyListReducer,
  orderPayReducer,
  orderDeliverReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userProfile: userProfileReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userGet: userGetReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderList: orderListReducer,
  orderMyList: orderMyListReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const deliveryDetailsFromStorage = localStorage.getItem("deliveryDetails")
  ? JSON.parse(localStorage.getItem("deliveryDetails"))
  : {};

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : null;

const initialState = {
  userLogin: { user: userFromStorage },
  cart: {
    cartItems: cartItemsFromStorage,
    deliveryDetails: deliveryDetailsFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
