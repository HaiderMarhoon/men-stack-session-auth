const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session =require("express-session")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const MongoStore = require("connect-mongo")
const isSignIn = require("./middleware/is-sign-in.js")
const passUserToVeiw = require("./middleware/pass-user-to-view.js")

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "4000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,

    })
}))
app.use(passUserToVeiw)


//ROUTES
const authController = require("./controllers/auth.js")

app.use('/auth', authController)

app.get("/vip-lounge", isSignIn,(req,res)=>{
  res.send(`Welcome  🌟`)
})

// GET /
app.get("/", async (req, res) => {
  res.render("index.ejs", {title: "myApp"});
});
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});