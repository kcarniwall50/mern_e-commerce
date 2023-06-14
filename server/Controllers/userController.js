const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenModel = require("../model/tokenModel");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  };

  const { name, email, password } = req.body;
  try {
    // checking if user exists
    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(200).send("user already exist");
    }

    const newUser = {
      name,
      email,
      password,
    };
    const userCreated = await userModel.create(newUser);

    // creating token for new user
    const token = generateToken(userCreated._id);

    res.cookie("eUserToken", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    res.status(201).json(userCreated);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // checking if user exists
  const user = await userModel.findOne({ email: email });

  try {
    if (!user) {
      return res.status(404).send("user does not exist"); // why not being sent 401
    } else {
      const IsPasswordCorrect = await bcrypt.compare(password, user.password);
      if (IsPasswordCorrect) {
        const generateToken = (id) => {
          return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
          });
        };

        // generating token
        let userToken = generateToken(user._id);

        res.cookie("eUserToken", userToken, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: "none",
          secure: true,
        });
        res.status(200).json(user);
      } else {
        return res.status(401).send("password is not correct");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // checking if user is registered
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json("User is not registered");
  }

  // checking if token exists
  const token = await tokenModel.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // creating reset token
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save in token model
  await new tokenModel({
    userId: user._id,
    token: hashedResetToken,
    createdAt: Date.now(),
  }).save();

  // constructing reset url
  const resetURL = `${process.env.Frontend_URL}/resetPassword/${resetToken}`;

  const subject = "Password Reset Request";
  const sent_from = process.env.Email_User;
  const send_to = user.email;
  const message = `
<h2>Hello, ${user.name}</h2>
<p>You have requested for reset password</p>
<p>   Below reset password link is valid only for 60 minutes </p>
<br/>
<a href=${resetURL} backtracking=off>${resetURL}</a>
<br/>
<p>regards...</p>
<p>Inventroy Team</p>
`;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json("Password Reset Email Sent ");
  } catch (error) {
    console.log(error);
    res.status(500).json("Email not sent, Please try again");
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  const { resetToken } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const userToken = await tokenModel.findOne({
    token: hashedToken,
  });
  if (!userToken) {
    res.status(400).send("Invalid or expired token");
    throw new Error("Invalid or expired token");
  }

  // Find user and saving new password in Model(user)
  const user = await userModel.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json("Password reset successfully, Please login");
};

const getSingleUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();

    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const userUpdate = async (req, res) => {
  const { userName, oldPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user._id);

  try {
    // exceptional case
    if (userName === user.name && oldPassword === "") {
      // after updating first time, try again and again to update same
      return res.status(204).json("Please reload page");
      // here return is necessary otherwise  Cannot set headers after they are sent to the client
    }

    if (userName !== "" && oldPassword === "") {
      user.name = userName;
      await user.save();
      res.status(200).json(user.name);
    }
    if (userName === "" && oldPassword !== "") {
      // checking if password is correct
      const IsPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (IsPasswordCorrect) {
        user.password = newPassword;
        await user.save();
        res.status(201).send("Password changed successfully");
      } else {
        res.status(401).send("Old Password is not correct");
      }
    }
    if (userName !== "" && oldPassword !== "") {
      // checking if password is correct
      const IsPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (IsPasswordCorrect) {
        user.password = newPassword;
        user.name = userName;
        await user.save();
        res.status(202).send(user.name);
      } else {
        res.status(401).send("Old Password is not correct");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id });
    // if product doesnt exist
    if (!user) {
      res.status(404).json("user not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getSingleUser,
  getAllUsers,
  userUpdate,
  deleteUser,
};
