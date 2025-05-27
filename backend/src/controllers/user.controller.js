import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId; // Get the current user's ID from the request
    const users = await User.find({ clerkId: { $ne: currentUserId } }); // Fetch all users except the current user
    res.status(200).json(users);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
