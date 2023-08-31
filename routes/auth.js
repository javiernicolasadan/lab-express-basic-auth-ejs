const User = require("../models/User.model");
const bcryptjs = require("bcryptjs")
const router = require("express").Router();


router.get("/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/signup", async (req, res) => {
try {
  const potencialUser = await User.findOne({username:req.body.username})
  
  if (!!potencialUser) {
    res.render("auth/signup", {
      errorMessage: "This username already exist.",
      data: {username: req.body.username}})
  } else {
    const salt = bcryptjs.genSaltSync(13)
    const passwordHash = bcryptjs.hashSync(req.body.password, salt)
    await User.create({username: req.body.username, passwordHash: passwordHash})
    res.redirect("/auth/login")
  }

} catch (error) {
  console.log(error)
}
})

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", async (req, res) => {
try {
  const user = await User.findOne({username: req.body.username})
  if (!!user) {
    if (bcryptjs.compareSync(req.body.password, user.passwordHash )) {
      res.render("profile")
    } else {
      res.render("auth/login", {errorMessage: "Password incorrect"})
    }
  } else {
    res.render("auth/login", {errorMessage: "This username does not exist"})
  }
} catch (error) {
  console.log(error)
}
})


module.exports = router;