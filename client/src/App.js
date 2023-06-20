import "./App.css";
import Navbar from "./components/Layout/Navbar/Navbar";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Pages/Login/Login";
import Cart from "./Pages/Cart/Cart";
import Item from "./components/Item/Item";
import SignUp from "./Pages/SignUp/SignUp";
import Home from "./Pages/Home.js/Home";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import Profile from "./Pages/Profile/Profile";
import Logout from "./Pages/Logout/Logout";
import { UserList } from "./Pages/Admin Panel/UserList/UserList";
import ProductList from "./Pages/Admin Panel/ProductList/ProductList";
import AddNewProduct from "./Pages/Admin Panel/AddNewProduct/AddNewProduct";
import Admin from "./Pages/Admin Panel/Admin/Admin";
import ForgotPass from "./Pages/Forgot Password/ForgotPass";
import ResetPassword from "./Pages/Reset Password/ResetPassword";
import PlaceOrder from "./Pages/Place Order/PlaceOrder";
import Orders from "./Pages/Orders/Orders.jsx";
import OrderSummary from "./Pages/OrderSummary/OrderSummary";
import EditProduct from "./Pages/Admin Panel/EditProduct/EditProduct";
import ShowNavbar from "./components/ShowNavbar/ShowNavbar";

function App() {
  if (process.env.REACT_APP_NODE_ENV !== "production") {
    console.log = function () {};
  }

  return (
    <div className="App">
      <BrowserRouter>
        <ShowNavbar>
          <Navbar />
        </ShowNavbar>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route exact path="/login" element={<Login />} />

          <Route exact path="/logout" element={<Logout />} />

          <Route exact path="/forgotPass" element={<ForgotPass />} />
          <Route
            exact
            path="/resetPassword/:resetToken"
            element={<ResetPassword />}
          />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/orders" element={<Orders />} />

          <Route exact path="/userDashboard" element={<UserDashboard />} />

          <Route exact path="/item/:id" element={<Item />} />

          <Route exact path="/placeOrder" element={<PlaceOrder />} />

          <Route exact path="/orderSummary/:id" element={<OrderSummary />} />

          <Route exact path="/admin" element={<Admin />}>
            <Route exact path="userList" element={<UserList />} />
            <Route exact path="productList" element={<ProductList />} />
            <Route exact path="addNewProduct" element={<AddNewProduct />} />

            <Route exact path="editProduct/:id" element={<EditProduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
