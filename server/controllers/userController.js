import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

//@desc    register a new user
//@route   POST/api/users
//@access  public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400);
    throw new Error("User has already registered");
  }
  // const user = await User.create({ name, email, password });
  // if (user) {
  //   res.status(201).json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error("Invalid user info");
  // }
  const user = new User({
    name,
    email,
    password,
  });
  const createdUser = await user.save();
  res.status(201).json(createdUser);
});

//@desc    authenticate user & get token
//@route   POST/api/users/login
//@access  public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // const generateToken = jwt.sign(
    //   { userId: user._id },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "30d",
    //   }
    // );
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // token: user.generateToken(user._id),
      // token: generateToken,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc    get the user's details
//@route   GET/api/users/profile
//@access  private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

//@desc    update the user's details
//@route   PUT/api/users/profile
//@access  private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User does not exist");
  }
});

//@desc    get all users
//@route   GET/api/users
//@access  private(admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@desc    delete the user
//@route   GET/api/users/:userId
//@access  private(admin only)
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    await user.remove();
    res.json({ message: "User is deleted" });
  } else {
    res.status(404);
    throw new Error("Cannot find the user");
  }
});

//@desc    get the user
//@route   GET/api/users/:userId
//@access  private(admin only)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("Cannot find the user");
  }
});

//@desc    update the user
//@route   PUT/api/users/:userId
//@access  private(admin only)
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Cannot find the user");
  }
});

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUserById,
  getUserById,
  updateUserById,
};
