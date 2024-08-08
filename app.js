if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Express
const express = require("express");
const app = express();
const path = require("path");
const ExpressError = require("./utils/ExpressError");
// Models/Schema
const mongoose = require("mongoose");
const User = require("./models/users");
// Authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Libraries

// Boilerplate for reducing html code
const ejsMate = require("ejs-mate");
// Flash for flashing methods, etc errors
const flash = require("connect-flash");
// Method Override for RESTful routes
const methodOverride = require("method-override");
// Sanitize
const mongoSanitize = require("express-mongo-sanitize");
// Secure express app by setting HTTP response headers
// Makes app more secure
const helmet = require("helmet");
// Store session in mongo
const MongoStore = require("connect-mongo");

//Routes
const catRoutes = require("./routes/cats");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const { isShowPage } = require("./middleware");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/catogram";
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "/public")));
// Serve static files from the "node_modules" directory
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(mongoSanitize());

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: "thisshouldbeabettersecret!",
  },
});

// Session
app.use(
  session({
    store,
    name: "session",
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);

app.use(isShowPage);
app.use(flash());
// app.use(helmet());

// const scriptSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
//   "https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/",
//   "https://cdn.jsdelivr.net/npm/bs-custom-file-input/dist/",
//   "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/",
//   "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/",
// ];

// const styleSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://fonts.googleapis.com/",
//   "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/",
//   "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/",
//   "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js",
// ];

// const fontSrcUrls = [
//   "https://fonts.googleapis.com/",
//   "https://fonts.gstatic.com/",
// ];

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", "blob:"],
//       objectSrc: [],
//       imgSrc: [
//         "'self'",
//         "blob:",
//         "data:",
//         "https://res.cloudinary.com/duzpc7kge/",
//         "https://images.unsplash.com/",
//       ],
//       fontSrc: ["'self'", ...fontSrcUrls],
//     },
//   })
// );

// Passport middleware from the docs
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
// seralize refers to how we store user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // user obj is added on to req from passport
  // currentUser can be accessed in any ejs template
  res.locals.currentUser = req.user;
  res.locals.cat = req.session.cat || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("cats/home");
});

app.use("/", userRoutes);
app.use("/cats", catRoutes);
app.use("/cats/:catId/comments", commentRoutes);

app.all("*", (req, res, next) => {
  // Calling all error routes
  // Default message/status code
  next(new ExpressError("Page Not Found", 404));
});

// This is run after catchAsync and all next's
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something weng wrong!";
  // Responds with an error page and sets status code
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
