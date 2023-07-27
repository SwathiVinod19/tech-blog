const express = require('express');
const router = express.Router();
const {User,Blog, Comment} = require('../models');


router.get('/', (req, res) => {
    Blog.findAll({include: [User]}).then(blogs => {
        const hbsBlogs = blogs.map(blog=>blog.get({plain:true}))
        let loggedIn;
        if (req.session.user) {
        loggedIn = true;
        } else {
        loggedIn = false;
    }
        const renderData = {
        blogs: hbsBlogs,
        loggedIn: !!req.session.user,
        username: req.session.user && req.session.user.username,
          };
          
          res.render('home', renderData);
          

    })
})

router.get("/login",(req,res)=>{
    if(req.session.user){
        return res.redirect("/dashboard")
    }
    res.render("login")
})

router.get("/signup",(req,res)=>{
    res.render("signup")
})

router.get("/dashboard", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect('/login');
      }
  
      const userData = await User.findByPk(req.session.user.id, {
        include: [Blog, Comment]
      });
  
      const hbsData = userData.get({ plain: true });
  
    let loggedIn;
    if (req.session.user) {
    loggedIn = true;
    } else {
    loggedIn = false;
    }

    hbsData.loggedIn = loggedIn;

      res.render("dashboard", hbsData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "an error occurred", err });
    }
  });
  
  router.get("/blogs/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect('/login');
      }
  
      const dbBlog = await Blog.findByPk(req.params.id, {
        include: [User, { model: Comment, include: [User] }]
      });



    const hbsBlog = dbBlog.get({ plain: true });
    let loggedIn;
  
    if (req.session.user) {
    loggedIn = true;
    } else {
    loggedIn = false;
    }
  
  
      if (dbBlog.userId !== req.session.user.id) {
        // If not your post -> render comment page over homepage
        return res.render('comment', { hbsBlog, loggedIn, username: req.session.user?.username });
      }
  
      // If your post -> render update/delete page over your dashboard
      res.render("updateDelete", { hbsBlog, loggedIn, username: req.session.user?.username });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "an error occurred", err });
    }
  });
  

router.get("*",(req,res)=>{
    res.redirect("/")
})

module.exports = router;