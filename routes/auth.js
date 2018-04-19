const router = require("express").Router();
const Users = require("../db/models/Users");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.serializeUser((user, done) => {
  console.log("serializing user: ", user);
  done(null, {
    id: user.email
  });
});

passport.deserializeUser((id, done) => {
  Users.where({ email: id })
    .fetch()
    .then(user => {
      user = user.toJSON();
      console.log("deserializing user: ", user);
    })
    .catch(err => {
      console.log("err: ", err);
    });
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    Users.where({ email })
      .fetch()
      .then(user => {
        user = user.toJSON();
        if (user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => {
        done(null, false);
      });
  })
);

router.post("/auth/register", (req, res) => {
  const { email, password } = req.body;
  Users.forge({ email, password })
    .save()
    .then(user => {
      user = user.toJSON();
      res.send(user);
    })
    .catch(err => {
      console.log("err: ", err);
      res.json(err);
    });
});

router.post(
  "/auth/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    res.send("YAY IM IN");

    // (req, res) => {
    //   const { email, password } = req.body;
    //   Users.where({ email })
    //     .fetch()
    //     .then(user => {
    //       user = user.toJSON();
    //       if (user.password === password) {
    //         res.redirect("/api/auth/secret");
    //       } else {
    //         res.redirect("/");
    //       }
    //     })
    //     .catch(err => {
    //       console.log("err: ", err);
    //       res.json(err);
    //     });
  }
);

router.post("/auth/logout", (req, res) => {});

router.get("/auth/secret", (req, res) => {
  res.send("YOU HAVE FOUD DA SEKRET");
});

module.exports = router;
