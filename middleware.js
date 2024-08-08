const { catSchema, commentSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Cat = require("./models/cats");
const Comment = require("./models/comments");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCat = (req, res, next) => {
  const { error } = catSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { catId } = req.params;
  const cat = await Cat.findById(catId);
  if (!cat.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/cats/${catId}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { catId, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    res.redirect(`/cats/${catId}`);
  }
  next();
};

module.exports.isShowPage = (req, res, next) => {
  if (req.path.startsWith("/cats/") && req.method === "GET") {
    res.locals.isShowPage = true;
  } else {
    res.locals.isShowPage = false;
  }
  next();
};
