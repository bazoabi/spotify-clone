import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "songs", // Specify the folder in Cloudinary
      resource_type: "auto", // Automatically determine the resource type (image/audio)
    });
    return result.secure_url; // Return the secure URL of the uploaded file
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.file || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({
        message: "Please upload all files",
        success: false,
      });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const newSong = new Song({
      title,
      artist,
      albumId: albumId || null, // Allow albumId to be optional
      duration,
      audioUrl,
      imageUrl,
    });

    await newSong.save();

    // If an albumId is provided, means that the song belongs to an album, update the album to include the new song
    if (albumId) {
      const album = await Album.findByIdAndUpdate(
        albumId,
        { $push: { songs: newSong._id } }, // Add the new song to the album's songs array
        { new: true, useFindAndModify: false }
      );
    }

    res.status(201).json({
      message: "Song created successfully",
      success: true,
      song: newSong,
    });
  } catch (error) {
    console.error("Error creating song:", error);
    next(error); // Pass the error to the error handling middleware
    // res.status(500).json({
    //   message: "Internal Server Error - Failed to create song",
    //   error: error.message,
    //   success: false,
    // });
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the song by ID
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({
        message: "Song not found",
        success: false,
      });
    }
    // Remove the song from the album if it belongs to one
    if (song.albumId) {
      await Album.findByIdAndUpdate(
        song.albumId,
        { $pull: { songs: song._id } }, // Remove the song from the album's songs array
        { new: true, useFindAndModify: false }
      );
    }

    // Delete the song
    await Song.findByIdAndDelete(id);

    res.status(200).json({
      message: "Song deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files.imageFile) {
      return res.status(400).json({
        message: "Please upload an album cover image",
        success: false,
      });
    }

    const { title, artist, releaseYear } = req.body;
    const imageFile = req.files.imageFile;

    const imageUrl = await uploadToCloudinary(imageFile);

    const newAlbum = new Album({
      title,
      artist,
      releaseYear,
      imageUrl,
    });

    await newAlbum.save();

    res.status(201).json({
      message: "Album created successfully",
      success: true,
      album: newAlbum,
    });
  } catch (error) {
    console.error("Error creating album:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the album by ID
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({
        message: "Album not found",
        success: false,
      });
    }

    // Remove all songs associated with the album
    await Song.deleteMany({ albumId: id });

    // Delete the album
    await Album.findByIdAndDelete(id);

    res.status(200).json({
      message: "Album deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const user = req.user; // Get the user from the request (set by auth middleware)

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: "Forbidden - Admin access required",
        success: false,
      });
    }

    res.status(200).json({
      admin: true,
      message: "User is an admin",
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
