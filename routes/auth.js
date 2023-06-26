const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const fetchuser = require("../Middleware/fetchuser");

//ROUTE 1 : Create a new user. Doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").trim().isLength({ min: 3 }).escape(),
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    const result = validationResult(req);

    //If there are errors, return Bad request and the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      //Check if the user already exists
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry!, A user with this email already exists!" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      //Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      //Create a token

      const authtoken = jwt.sign(data, process.env.JWT_SECRET);

      return res.status(201).json({
        message: `Hello ${req.body.name}, Your account is created successfully!`,
        authtoken,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

//ROUTE 2 : login a user with email and password.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials!" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid Credentials!" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      //Create a token
      const authtoken = jwt.sign(data, process.env.JWT_SECRET);

      return res.status(200).json({
        message: "login successful!",
        authtoken,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

//ROUTE 3 : get details of a user. Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

module.exports = router;
