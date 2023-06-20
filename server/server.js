const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();

// middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.Frontend_URL,
    credentials: true,
  })
);

// logging
if (process.env.NODE_ENV !== "production") {
  console.log = function () {};
}

app.use(userRoute);
app.use(productRoute);
app.use(paymentRoute);
app.use(orderRoute);

app.get("/", (req, res) => {
  res.send("sent from backend");
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`server is active on port ${PORT}...`);
    })
  )
  .catch((error) => {
    console.log("error: ", error.message);
  });
