const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  validateCat,
  validateComment,
  isAuthor,
} = require("../middleware");
const Cat = require("../models/cats");
const Comment = require("../models/comments");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

router.get("/new", isLoggedIn, (req, res) => {
  res.render("cats/new");
});

router.get(
  "/:catId",
  catchAsync(async (req, res) => {
    const { catId } = req.params;
    const cat = await Cat.findById(catId)
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    req.session.cat = cat;
    res.locals.isShowPage = true;
    res.render("cats/show", { cat });
  })
);

router.get(
  "/:catId/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { catId } = req.params;
    const cat = await Cat.findById(catId);
    if (!cat.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission!");
      return res.redirect(`/cats/${catId}`);
    }
    res.render("cats/edit", { cat });
  })
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const cats = await Cat.find({}).populate("author");
    const catsWithLikes = cats.map((cat) => ({
      ...cat.toObject(),
      hasLiked: req.user ? cat.likes.includes(req.user._id.toString()) : false,
    }));
    res.render("cats/index", { cats: catsWithLikes });
  })
);

router.get("/:catId/like", (req, res) => {
  res.redirect("/cats");
});

router.put(
  "/:catId",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  catchAsync(async (req, res) => {
    const { catId } = req.params;
    const cat = await Cat.findByIdAndUpdate(catId, { ...req.body.cat });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    cat.images.push(...imgs);
    await cat.save();

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        // From cloudinary docs
        await cloudinary.uploader.destroy(filename);
      }
      await cat.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }

    res.redirect(`/cats/${catId}`);
  })
);

router.put(
  "/:catId/like",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { catId } = req.params;
    const userId = req.user._id.toString();

    const cat = await Cat.findOne({
      _id: catId,
      likes: { $in: [userId] },
    });
    if (cat) {
      await Cat.findByIdAndUpdate(catId, {
        $pull: { likes: userId },
      });
    } else {
      await Cat.findByIdAndUpdate(catId, {
        $push: { likes: userId },
      });
    }

    const updatedCat = await Cat.findById(catId);
    await updatedCat.save();
    res.json({ likes: updatedCat.likes.length });
  })
);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCat,
  catchAsync(async (req, res, next) => {
    const cat = new Cat(req.body.cat);
    cat.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    cat.author = req.user._id;
    await cat.save();
    req.flash("success", "Successfully created post!");
    res.redirect(`/cats/${cat._id}`);
  })
);

router.delete(
  "/:catId",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { catId } = req.params;
    await Cat.findByIdAndDelete(catId);
    req.flash("success", "Successfully deleted cat");
    res.redirect("/cats");
  })
);

module.exports = router;
