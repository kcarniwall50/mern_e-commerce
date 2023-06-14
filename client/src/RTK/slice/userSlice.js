import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// user register
export const asyncUserSignUp = createAsyncThunk(
  "user/asyncUserSignUp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/register`,
        formData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// user login
export const asyncUserLogin = createAsyncThunk(
  "user/asyncUserLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/login`,
        formData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// forgot password
export const asyncForgotPass = createAsyncThunk(
  "user/asyncForgotPass",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/forgotPass`,
        formData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// reset password
export const asyncResetPassword = createAsyncThunk(
  "user/asyncResetPassword",
  async ({ password, resetToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/resetPassword/${resetToken}`,
        { password },
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// get user
export const asyncGetUser = createAsyncThunk(
  "user/asyncGetUser",
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/get-user`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// update user
export const asyncUpdateUser = createAsyncThunk(
  "user/asyncUpdateUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

//   ? JSON.parse(localStorage.getItem("isLogin"))

const nameStatus = localStorage.getItem("eLoginUser")
  ? JSON.parse(localStorage.getItem("userName"))
  : "";

const initialState = {
  isLoading: true,
  login: false,
  user: {},
  isAdmin: false,
  error: { isError: false, errMsg: "" },
  name: nameStatus,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName(state, action) {
      state.name = action.payload;
      localStorage.setItem("eLoginUser", JSON.stringify(action.payload));
    },

    setLogin(state, action) {
      state.login = action.payload;
      localStorage.setItem("eIsLogin", action.payload);
    },

    setAdmin(state, action) {
      state.isAdmin = action.payload;
      localStorage.setItem("isAdmin", action.payload);
    },

    setLogOut(state) {
      state.login = false;

      localStorage.removeItem("eIsLogin");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("eLoginUser");
      localStorage.removeItem("cartProducts");
      localStorage.removeItem("cartQuantity");
    },
  },

  extraReducers(builder) {
    builder

      // user register
      .addCase(asyncUserSignUp.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncUserSignUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error.isError = false;

        state.user = action.payload.data;
        if (action.payload.status === 201) {
          toast.success("Registered Successfully");
        }
        if (action.payload.status === 200) {
          toast.error("User already registered");
        }
      })

      .addCase(asyncUserSignUp.rejected, (state, action) => {
        state.isLoading = false;
        state.user = {};
        state.error.isError = true;
        state.error.errMsg = action.payload;
      })

      // user login

      .addCase(asyncUserLogin.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncUserLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.login = true;
        state.error.isError = false;
        localStorage.setItem("eIsLogin", JSON.stringify(true));
        localStorage.setItem(
          "eLoginUser",
          JSON.stringify(action.payload.data.name)
        );
        state.name = action.payload.data.name;

        state.user = action.payload;

        if (action.payload.status === 200) {
          toast.success("Login Successfully");
        }
      })

      .addCase(asyncUserLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.login = false;
        state.user = {};
        state.error.isError = true;
        state.error.errMsg = action.payload;
        if (action.payload.status === 404) {
          toast.error("User is not registered");
        }
        if (action.payload.status === 401) {
          toast.error("Email or Password is incorrect");
        }
      })

      // Forgot password
      .addCase(asyncForgotPass.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncForgotPass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error.isError = false;
        toast.success(action.payload.data);
      })

      .addCase(asyncForgotPass.rejected, (state, action) => {
        state.isLoading = false;

        state.error.isError = true;
        toast.error(action.payload.data);
      })

      // reset password
      .addCase(asyncResetPassword.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncResetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error.isError = false;
        toast.success(action.payload.data);
      })

      .addCase(asyncResetPassword.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload.data);
        state.error.isError = true;
      })

      // get user
      .addCase(asyncGetUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncGetUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error.isError = false;
        state.user = action.payload.data;
      })

      .addCase(asyncGetUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error.isError = true;
      })

      // update user
      .addCase(asyncUpdateUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(asyncUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error.isError = false;
        state.user = action.payload.data;
      })

      .addCase(asyncUpdateUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error.isError = true;
      });
  },
});

export const { setName, setLogin, setLogOut, setAdmin } = userSlice.actions;

export const selectName = (state) => state.user.name;

export const selectIsError = (state) => state.user.error.isError;
export const selectIsLoding = (state) => state.user.isLoading;

export default userSlice.reducer;
