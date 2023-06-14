const express = require("express");
const {
  addProduct,
  userReview,
  incDecCartItemQuantity,
  deleteSingleCartItem,
  getCartItems,
  saveCartProducts,
  getSingleProduct,
  getAllProducts,
  getAllProductsAdmin,
  deleteProduct,
  editProduct,
} = require("../Controllers/productController");
const protector = require("../middleware/protector");
const router = express.Router();

// get all products
router.get("/api/get-products", protector, getAllProducts);

// get all products  (admin panel)
router.get("/api/getAllProducts", protector, getAllProductsAdmin);

// get single product by id
router.get("/api/get-product/:id", protector, getSingleProduct);

// save cart products
router.post("/api/saveCart", protector, saveCartProducts);

// get cart items
router.get("/api/getCart", protector, getCartItems);

// delete single cart item
router.patch("/api/cart/update", protector, deleteSingleCartItem);

// increase or decrease cart item quantity
router.patch("/api/updateQuantity", protector, incDecCartItemQuantity);

// user review saveS
router.post("/api/user/review", protector, userReview);

// add product
router.post("/api/addProduct", protector, addProduct);

// edit product
router.patch("/api/product/editProduct/:id", protector, editProduct);

// delete product
router.delete("/api/product/delete/:id", protector, deleteProduct);

module.exports = router;
