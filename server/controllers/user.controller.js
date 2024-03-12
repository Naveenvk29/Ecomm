import User from "../Models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponce from "../Utils/ApiResponce.js";
import createToken from "../Utils/CreateToken.js";
import bcrypt from "bcryptjs";

const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(401, "Please fil all inputs");
  }
  const user = await User.findOne({
    $or: [{ username }, { email: email }],
  });

  if (user) {
    throw new ApiError(401, "Username or email already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  createToken(res, newUser._id);
  res.status(201).json(
    new ApiResponce(
      201,
      {
        _id: newUser._id,
        user: newUser.username,
        email: newUser.email,
        isAadmin: newUser.isAadmin,
      },

      "User Created Successfully"
    )
  );
  if (newUser) {
    new ApiError(401, "Invalid user Data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const isPasswords = await bcrypt.compare(password, user.password);
    if (isPasswords) {
      createToken(res, user._id);
      res.status(200).json(
        new ApiResponce(200, {
          _id: user._id,
          user: user.username,
          email: user.email,
          isAadmin: user.isAadmin,
        })
      );
      return;
    }
  }
  if (!user) {
    throw new ApiError(401, "Invalid Credentials");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jsw", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json(new ApiResponce(200, {}, "Logged Out Successfully"));
});

export { register, login, logout };
