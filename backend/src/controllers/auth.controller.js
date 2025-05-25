import User from "../models/user.model.js";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user exists in the database
    if (!id || !firstName || !lastName || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Missing user information on auth callback" });
    }

    const user = await User.findOne({ where: { clerkId: id } });
    if (!user) {
      // User does not exist, create a new user ~ sign up
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
    }

    // Respond with success
    res
      .status(200)
      .json({ message: "Authentication successful", success: true });
  } catch (error) {
    console.error("Authentication callback error:", error);
    res.status(500).json({
      message: "Internal Server Error - Authentication failed",
      error: error.message,
      success: false,
    });
  }
};
