require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require('cookie-parser'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");


app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,  
    httpOnly: true, 
    secure: false   
  }
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);  
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);  
  } catch (err) {
    done(err, null);
  }
});


const mongoUrl = "mongodb://127.0.0.1:27017/LOTR";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Definition of a schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  googleId: String,
});
userSchema.set("strictQuery", true);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);


passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id); 
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user); 
  } catch (err) {
    done(err, null);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect("/"); 
  }
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets"
},
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          username: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value
        });
        await user.save(); 
      }
      return done(null, user);

    } catch (err) {
      return done(err);
    }
  }
));


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/" }),
  function(req, res) {
    
    res.redirect("/secret");
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/register", (req, res) => {
  User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    res.redirect("/"); 
  });
});

app.get("/secret", isAuthenticated, (req, res) => {
  res.cookie('secretAccess', 'granted', { maxAge: 3600000, httpOnly: true });
  res.sendFile(__dirname + "/public/html/secret.html");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/"
}));

app.get("/logout", (req, res, next) => {
  res.clearCookie('secretAccess');
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect("/"); 
  });
});


app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
