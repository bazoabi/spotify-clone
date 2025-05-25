import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song", // Reference to the Song model
        // required: false, // Optional, can be null if the album has no songs
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("Album", albumSchema);
export default Album;
