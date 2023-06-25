const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const { validationResult, body } = require("express-validator");

//Create a new user. Doesn't require authentication
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
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      res
        .status(201)
        .json({
          message: `Hello ${req.body.name}, Your account is created successfully!`,
        });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
