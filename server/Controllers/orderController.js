const orderModel = require("../model/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const orderItems = await orderModel.findOne(
      { userId: req.user._id },
      { orderDetails: 1 }
    );

    const orderData = orderItems?.orderDetails.map((item) => {
      return {
        _id: item._id,
        orderItem: item.orderItem,
        isDelivered: item.paymentDetails.isDelivered,
      };
    });

    res.status(200).send(orderData);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const orderItems = await orderModel.findOne(
      { userId: req.user._id },
      { orderDetails: 1 }
    );

    // filter
    let kp = "";

    for (let i = 0; i < orderItems.orderDetails.length; i++) {
      if (orderItems.orderDetails[i]._id == id) {
        kp = orderItems.orderDetails[i];

        break;
      }
    }

    res.status(200).send(kp);
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

module.exports = { getAllOrders, getSingleOrder };
