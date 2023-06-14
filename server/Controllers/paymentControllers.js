const Razorpay = require("razorpay");
const orderModel = require("../model/orderModel");

const orderCreate = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { order_id, amount, payment_capture, currency } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: order_id,
      payment_capture: payment_capture,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Something occured");

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.log(err);
  }
};

const cartDetail = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { razorpay_payment_id, data, cartProducts } = req.body;

    const order = await instance.payments.fetch(razorpay_payment_id);

    if (!order) return res.status(500).send("Something Occured");

    function getDateTimeFromTimestamp(unixTimeStamp) {
      let date = new Date(unixTimeStamp);
      return (
        ("0" + date.getDate()).slice(-2) +
        "/" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        date.getFullYear() +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2)
      );
    }

    const time = getDateTimeFromTimestamp(Date.now());

    function e1() {
      var u = "",
        i = 0;
      while (i++ < 36) {
        var c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[i - 1],
          r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        u += c == "-" || c == "4" ? c : v.toString(16);
      }
      return u;
    }

    let kp = "";
    const allOrders = cartProducts.map((item, index) => {
      kp = {
        _id: Date.now() * 2 + index * 5,

        sent_to: {
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
        },

        orderItem: {
          productId: item?.product?._id,
          name: item?.product?.name,
          image: item?.product?.image,
          quantity: item?.quantity,
          price: item?.product?.price,
        },

        shippingAddress: {
          streetAddress: data?.streetAddress,
          town: data?.town,
          pincode: data?.pincode,
          state: data?.state,
          country: data?.country,
        },

        paymentDetails: {
          orderId: e1(),
          transactionId: order?.id,
          orderAmount: item?.quantity * item?.product?.price,
          isDelivered: false,
        },

        time: time,
      };

      return kp;
    });

    const isExist = await orderModel.findOne({ userId: req.user._id });

    if (isExist) {
      for (let i = 0; i < allOrders.length; i++) {
        isExist.orderDetails.push(allOrders[i]);
        await isExist.save();
      }
    } else {
      const orderData = {
        userId: req.user._id,
        orderDetails: allOrders[0],
      };

      const items = await orderModel.create(orderData);

      for (let i = 1; i < allOrders.length; i++) {
        items.orderDetails.push(allOrders[i]);
        await items.save();
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { orderCreate, cartDetail };
