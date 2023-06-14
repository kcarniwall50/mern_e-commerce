import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogOut } from "../../RTK/slice/userSlice";
import { toast } from "react-toastify";

const Authenticator = () => {
  const isLogin = JSON.parse(localStorage.getItem("eIsLogin"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogin !== true) {
      toast.error("Unauthorized Access, Please Login");
      dispatch(setLogOut());
      navigate("/login");
    }
  }, []);
};

export default Authenticator;
