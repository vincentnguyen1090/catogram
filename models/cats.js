const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_100");
});

const CatSchema = new Schema({
  name: String,
  images: [ImageSchema],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  breed: String,
  location: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Cat is identified as 'cats' in mongoose db
module.exports = mongoose.model("Cat", CatSchema);
