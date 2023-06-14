import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // rxslice
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// get products
export const asyncProduct = createAsyncThunk(
  "product/asyncProduct",
  async (thunkAPI) => {
    axios
      .get(`${BACKEND_URL}/api/get-products`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log("errrr", error);
        return error.message;
      });
  }
);

// save cart
export const asyncSaveCart = createAsyncThunk(
  "product/asyncSaveCart",
  async (cartData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/saveCart`,
        cartData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

// get cart items

export const asyncgetCart = createAsyncThunk(
  "product/asyncgetCart",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/getCart`, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      console.log("errrr", error);
      return error;
    }
  }
);

// delete cart items

export const asyncDeleteCart = createAsyncThunk(
  "product/asyncDeleteCart",
  async (index, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/cart/update`,
        { index },
        { withCredentials: true }
      );

      toast.success("deleted successfully");
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

// increase or decrease cart item quantity
export const asyncUpdateQuantity = createAsyncThunk(
  "product/asyncUpdateQuantity",
  async (itemData, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/updateQuantity`,
        itemData,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      return error;
    }
  }
);

const initialState = {
  loading: false,
  error: "",
  cartQuantity: 0,
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    SET_LOADING(state, action) {
      state.loading = action.payload;
    },

    SET_CartQuantity(state, action) {
      state.cartQuantity = action.payload;
      localStorage.setItem("cartQuantity", action.payload);
    },
  },

  extraReducers(builder) {
    builder

      // getting products
      .addCase(asyncProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncProduct.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(asyncProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // save cart products
      .addCase(asyncSaveCart.pending, (state) => {
      })

      .addCase(asyncSaveCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const { quantity } = action;
        if (quantity) {
        }
        state.cartQuantity = action.payload.data.cartProducts?.length;

        localStorage.setItem("cartQuantity", state.cartQuantity);

        toast.success("Cart saved");
      })

      .addCase(asyncSaveCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      })

      // get cart items

      .addCase(asyncgetCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncgetCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartQuantity = action.payload.data.cartProducts?.length;
      })

      .addCase(asyncgetCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delet cart items

      .addCase(asyncDeleteCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(asyncDeleteCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartQuantity = action.payload.data?.length;
      })

      .addCase(asyncDeleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // increase or decrease cart item quantity

      .addCase(asyncUpdateQuantity.pending, (state) => {
        state.loading = false;
      })

      .addCase(asyncUpdateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })

      .addCase(asyncUpdateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(state.error);
      });
  },
});

export const { Add_To_Cart, Delete_Item, SET_LOADING, SET_CartQuantity } =
  ProductSlice.actions;

export const selectCartQuantity = (state) => state.product.cartQuantity;
export const selectProductQuantity = (state) => state.product.productQuantity;
export const selectLoading = (state) => state.product.loading;

export default ProductSlice.reducer;
