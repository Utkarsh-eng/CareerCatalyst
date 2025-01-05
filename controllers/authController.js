import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please Provide all values");
  }
  const UserAlreadyExists = await User.findOne({ email });
  if (UserAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      _id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all the values");
  }
  const user = await User.findOne({ email }).select("+password"); //its not going to be provided in the document
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  console.log(user);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });

  // res.send("login user");
};

const updateUser = async (req, res) => {
  console.log(req.file);
  const { email, name, lastName, location } = req.body;
  const resume = req.file.filename;
  if (!email || !name || !lastName || !location || !resume) {
    throw new BadRequestError("Please provide all the values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  user.resume = resume;
  await user.save();
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export { register, login, updateUser };
