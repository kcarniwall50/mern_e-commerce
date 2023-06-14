import axios from "axios";

export const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const pay = async ({ amount, data, cartProducts }) => {
  const res = loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  let paymentRes = {
    key: Date.now().toString(10),
    order_id: Date.now().toString(30),
    amount: amount,
    currency: "INR",
    payment_capture: 1,
  };

  let result = await axios.post(
    `${BACKEND_URL}/api/payment/orderCreate`,
    paymentRes,
    { withCredentials: true }
  );
  if (!result.data.data) {
    alert("Server error, Are you online");
    return;
  } else {
    let options = {
      key: process.env.REACT_APP_Razorpay_Key,
      currency: result.data.data.currency,
      amount: result.data.data.amount * 100,
      order_id: result.data.id,
      name: "E-commerce Made Easy",
      description: "Test Transaction",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0VZfjGEPMvE9nJUzTEnevmMuTtA9UE3zr1J3VvFCQDmKMMpdNTFunaoezdDp6UuMykwQ&usqp=CAU",

      handler: async function (res) {
        try {
          const { razorpay_payment_id } = res;
           await axios.post(
            `${BACKEND_URL}/api/payment/cartDetail`,
            { razorpay_payment_id, data, cartProducts },
            { withCredentials: true }
          );
        } catch (err) {
          console.log(err);
        }
      },

      prefill: {
        email: "spcshomo70@gmail.com",
        contact: 9519003091,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "blue",
      },
    };

    let paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
};
