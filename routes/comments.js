const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateComment,
  isLoggedIn,
  isCommentAuthor,
} = require("../middleware");
const Comment = require("../models/comments");
const Cat = require("../models/cats");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/",
  catchAsync(async (req, res) => {
    console.log("hello");
    const catId = req.params.catId;
    res.redirect(`/cats/${catId}`);
  })
);

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res) => {
    const catId = req.params.catId;
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    const savedComment = await comment.save();
    await Cat.findByIdAndUpdate(catId, {
      $push: { comments: savedComment._id },
    });
    req.flash("success", "Successfully commented!");
    res.redirect(`/cats/${catId}`);
  })
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(async (req, res) => {
    const { catId, commentId } = req.params;
    await Cat.findByIdAndUpdate(catId, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment!");
    res.redirect(`/cats/${catId}`);
  })
);

module.exports = router;
