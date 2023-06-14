const productModel = require("../model/productModel");
const userModel = require("../model/userModel");
const cartModel = require("../model/cartModel");

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    const userCartQuantity = await cartModel.findOne(
      { userId: req.user._id },
      { cartProducts: 1 }
    );

    res.status(200).json({
      products,
      userCartQuantity: userCartQuantity?.cartProducts?.length,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const allProducts = await productModel.find();

    res.status(200).json(allProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    res.status(200).json({ product, userId: req.user._id });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

const saveCartProducts = async (req, res) => {
  const { item, quantity } = req.body;

  try {
    const isCartProducts = await cartModel.findOne({ userId: req.user._id });

    if (!isCartProducts) {
      const cart = await cartModel.create({
        userId: req.user._id,
        cartProducts: [
          {
            product: item,
            quantity: quantity,
          },
        ],
      });

      return res.status(201).json(cart);
    } else {
      const cartArray = isCartProducts.cartProducts;

      if (
        cartArray.some((productItem) => productItem?.product?._id === item._id)
      ) {
        if (
          cartArray.some(
            (productItem) =>
              productItem.product._id === item._id &&
              productItem.quantity != quantity
          )
        ) {
          const response = await cartModel.findOneAndUpdate(
            { userId: req.user._id, "cartProducts.product._id": item._id },
            { $set: { "cartProducts.$.quantity": Number(quantity) } },
            { new: true }
          );
          return res.status(201).json(response);
        }
      } else {
        const response = await cartModel.findOneAndUpdate(
          { userId: req.user._id },
          { $push: { cartProducts: { product: item, quantity: quantity } } },
          { new: true }
        );

        return res.status(201).json(response);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("server error");
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await cartModel.findOne(
      { userId: req.user._id },
      { cartProducts: 1 }
    );

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSingleCartItem = async (req, res) => {
  const { index } = req.body;

  try {
    const cartItems = await cartModel.findOne(
      { userId: req.user._id },
      { cartProducts: 1, _id: 0 }
    );
    const cartArray = cartItems.cartProducts;
    cartArray.splice(index, 1);
    await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { cartProducts: cartArray } }
    );

    res.status(200).json(cartArray);
  } catch (error) {
    res.status(500).json(error);
  }
};

const incDecCartItemQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    await cartModel.findOneAndUpdate(
      { userId: req.user._id, "cartProducts.product._id": id },
      { $set: { "cartProducts.$.quantity": quantity } }
    );

    res.status(200).send("Quantity updated");
  } catch (error) {
    res.status(500).json(error);
  }
};

const userReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const user = await userModel.findById(req.user._id, "-password");

  const product = await productModel.findOne({ _id: productId });

  const productReviews = product.reviews;

  // over all product rating calculator
  const productRating = await productReviews.reduce(
    (acc, item) => acc + item.rating / productReviews.length,
    0
  );

  product.rating = productRating;
  let id1 = user._id;
  let flag = false;
  //check if user already commented
  for (let i = 0; i < productReviews.length; i++) {
    let id2 = productReviews[i].userId;
    if (String(id2) === String(id1)) {
      flag = true;
      productReviews[i].rating = rating;
      productReviews[i].comment = comment;
      product.markModified("reviews");
      await product.save();
      return res.status(200).send("Review submitted successfully");
    }
  }

  if (!flag) {
    const userReview = {
      userId: user._id,
      productId: product._id,
      name: user.name,
      rating,
      comment,
    };

    await productReviews.push(userReview);

    await product.save((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err.message);
      } else {
        return res.status(200).send("Review submitted successfully");
      }
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = await productModel.create(req.body);
    res.status(201).json("product added successfully");
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

const editProduct = async (req, res) => {
  const productData = req.body;
  const { name, category, price, countInStock, image, description } = req.body;

  try {
    const product = await productModel.findOne(
      { _id: req.params.id },
      { reviews: 0, rating: 0 }
    );
    // if product doesnt exist
    if (!product) {
      res.status(404).json("Product not found");
    }

    product.name = name;
    product.price = Number(price);
    product.category = category;
    product.countInStock = Number(countInStock);
    product.image = image;
    product.description = description;

    // product.markModified("price");
    await product.save();

    res.status(201).json({ message: "Product updated successfully" });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete({ _id: req.params.id });
    // if product doesnt exist
    if (!product) {
      res.status(404).json("Product not found");
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
};

module.exports = {
  getAllProducts,
  getAllProductsAdmin,
  getSingleProduct,
  saveCartProducts,
  getCartItems,
  deleteSingleCartItem,
  incDecCartItemQuantity,
  userReview,
  addProduct,
  editProduct,
  deleteProduct,
};
