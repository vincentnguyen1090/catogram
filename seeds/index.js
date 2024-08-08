const mongoose = require("mongoose");
const cats = require("./catData");
const Cat = require("../models/cats");
const Comment = require("../models/comments");
const fetchCatApi = require("../public/javascripts/randomCatApi");

mongoose.connect("mongodb://127.0.0.1:27017/catogram");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Cat.deleteMany({});
  await Comment.deleteMany({});
  for (let i = 0; i < 5; i++) {
    // const image = await fetchCatApi();
    const cat = new Cat({
      author: "669c82626dba6cfeffd7bd6e",
      name: cats[i].name,
      images: [
        {
          url: "https://res.cloudinary.com/duzpc7kge/image/upload/v1722899722/Catogram/omczjr5nyuejynjmfphh.jpg",
          filename: "Catogram/omczjr5nyuejynjmfphh",
        },
        {
          url: "https://res.cloudinary.com/duzpc7kge/image/upload/v1722899722/Catogram/dngu4xngqp9e3njdahed.jpg",
          filename: "Catogram/dngu4xngqp9e3njdahed",
        },
      ],
      likes: "66a8352b4cb902a97094189e",
      breed: cats[i].breed,
      location: cats[i].location,
      description: cats[i].description,
    });
    await cat.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
