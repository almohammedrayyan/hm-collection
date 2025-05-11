const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const mailTransport = () => {
  return nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
};
const sendWelcomeEmail = async (userEmail, firstName) => {
  const mailOptions = {
    from: `"Halema Collection" <${process.env.MPT_MAIL}>`, // Change to your sender name & email
    to: userEmail,
    subject: "Welcome to Halema Collection!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Welcome to <span style="color: #8a2be2;">Halema Collection</span>, ${firstName}!</h2>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering with us. We're thrilled to have you as part of our growing community.
          </p>
          <p style="font-size: 16px; color: #555;">
            Explore our latest collections, stay updated with new arrivals, and enjoy a seamless shopping experience.
          </p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #888;">
            If you have any questions or need support, feel free to reply to this email.
          </p>
          <p style="font-size: 14px; color: #888;">— The Halema Collection Team</p>
        </div>
      </div>
    `,
  };

  try {
    await mailTransport().sendMail(mailOptions);
    console.log("Welcome email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

// Register User
exports.register = async (req, res) => {
  try {
      const { firstName, lastName,email, password, confirmPassword,mobileNumber } = req.body;

      if (password !== confirmPassword) {
          return res.status(400).json({ msg: "Passwords do not match" });
      }

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      const avatar = req.file ? req.file.location : null; // AWS S3 URL

      // Generate token **before saving user**
     

      // Create user and assign token
      user = new User({
        firstName,
        lastName,
          email,
          password,
          avatar,
          mobileNumber,
          
      });

      const token = generateToken(user);

      // Optionally, update user with token if you're storing it
      user.token = token;
      await user.save();
      await sendWelcomeEmail(user.email, user.firstName);
      res.status(201).json({ msg: "User registered successfully", token, user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
  }
};

// Edit user by ID
exports.editUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber } = req.body;

    // Optional: Parse addresses if sent as a string
    let addresses = [];
    if (req.body.addresses) {
      try {
        addresses = JSON.parse(req.body.addresses); // must be a JSON string from frontend
      } catch (err) {
        return res.status(400).json({ msg: "Invalid address format" });
      }
    }

    const avatar = req.file ? req.file.location : null; // AWS S3 image URL

    // Prepare updated fields
    const updatedFields = {
      firstName,
      lastName,
      email,
      mobileNumber,
    };

    if (addresses.length > 0) updatedFields.addresses = addresses;
    if (avatar) updatedFields.avatar = avatar;

    // Update user
    const user = await User.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error("Edit User Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Firebase Login/Register
// exports.firebaseAuth = async (req, res) => {
//   try {
//     const { firebaseToken } = req.body;
//     const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

//     let user = await User.findOne({ firebaseUID: decodedToken.uid });

//     if (!user) {
//       user = new User({
//         name: decodedToken.name || "Anonymous",
//         email: decodedToken.email,
//         avatar: decodedToken.picture,
//         firebaseUID: decodedToken.uid,
//       });
//       await user.save();
//     }

//     const token = generateToken(user);
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");

      if (!user) {
          return res.status(404).json({ msg: "User not found" });
      }

      res.json({ user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" }); // Clears cookie in the browser
  return res.json({ msg: "User logged out successfully" });
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({}); // Avoid naming conflict

    res.status(201).json({
      success: true,
      users, // Return the created product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message, // Send error message in responsep
    });
  }
};
exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ msg: "User not found" });
      }

      res.json({ user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
  }
};