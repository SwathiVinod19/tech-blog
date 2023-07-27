const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models/");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const dbUsers = await User.findAll({ include: [Blog, Comment] });
    res.json(dbUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error!", err });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  try {
    const dbUser = await User.findByPk(req.params.id, { include: [Blog, Comment] });
    res.json(dbUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error!", err });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body, { individualHooks: true });
    req.session.user = {
      id: newUser.id,
      username: newUser.username
    };
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error!", err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!foundUser) {
      return res.status(400).json({ msg: "wrong login credentials" });
    }

    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      req.session.user = {
        id: foundUser.id,
        username: foundUser.username
      };
      return res.json(foundUser);
    } else {
      return res.status(400).json({ msg: "wrong login credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occurred", err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.params.id
      },
      individualHooks: true
    });
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occurred", err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const delUser = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json(delUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occurred", err });
  }
});

module.exports = router;
