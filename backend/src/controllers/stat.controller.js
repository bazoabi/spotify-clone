import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import Album from "../models/album.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments(); // Assuming you have a User model defined
    // const totalAlbums = await Album.countDocuments(); // Assuming you have an Album model defined
    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        User.countDocuments(),
        Album.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist", // Group by artist
            },
          },
          {
            $count: "uniqueArtistsCount", // Count the number of unique artists
          },
        ]).then((result) => result[0]?.uniqueArtistsCount || 0), // Handle case where no artists are found
      ]);
    res
      .status(200)
      .json({ totalSongs, totalUsers, totalAlbums, uniqueArtists });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
