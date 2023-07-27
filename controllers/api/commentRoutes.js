const express = require("express");
const router = express.Router();
const {User, Blog, Comment} = require("../../models");


//get all comments
router.get("/", async (req, res) => {
  try {
    const dbComments = await Comment.findAll({ include: [User, Blog]});
    res.json(dbComments);
  } catch(err) {
    console.log(err);
      res.status(500).json({ msg: 'Error! Couldnt find comments ! ', err});
    }

  });


// get comments by id , user and blog
router.get("/:id", async (req, res) => {
    Comment.findByPk(req.params.id,{include:[User, Blog]})
      .then(dbComment => {
        res.json(dbComment);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error! Couldnt find comment ! ", err });
      });
});

//create new comment
router.post("/", async (req, res) => {
    if(!req.session.user){
      return res.status(401).json({msg:"Please login to create comment!"})
  }
  try{
    const newComment = await Comment.create({
      body:req.body.body,
      userId:req.session.user.id,
      blogId:req.body.blogId
    });
    res.json(newComment);
    } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error! Couldnt create comment! ", err });
    }
    });


//update comment
router.put("/:id", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({msg:"Please login to update comment! "})
    }
     
    try{
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
      res.json(updatedComment);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Error! Couldnt update the comment! ", err });
    }
    });
    

// delete comment
router.delete('/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: 'Please login to delete comment!' });
  }

  try {
    const delComment = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json(delComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Error ! Couldnt delete comment !', err });
  }
});
  
module.exports = router;