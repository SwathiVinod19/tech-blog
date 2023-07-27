const sequelize = require("../config/connection")
const {User,Blog,Comment} = require("../models")

const users = [
    {
        username: "Lilly",
        password: "Lillypassword123"
    },
    {
        username: "Toby",
        password: "tobypassword456"
    },
    {
        username: "Jim",
        password: "Jimpassword789"
    },

]

const blogs = [
    {
        title: "Write Code Every Day",
        content: "To become a better developer you need to write code everyday. This will allow you to catch your mistakes, improve your typing skills and reduces the chances of making mistakes.",
        userId: 1
    },
    {
        title: "Teach Others What You Know",
        content: "Start a blog! Sharing your knowledge with others, is a great way to continue learning.",
        userId: 1
    },
    {
        title: "Challenge Yourself With a New Skill",
        content: "Break the monotony of working on various projects by trying out a new programming languages.",
        userId: 2
    },
    {
        title: "Contribute to Open-Source Projects",
        content: "Working on open-source projects from places like GitHub help in building skills. Contribute to an existing project, fix minor bugs in existing work to improve the project’s stability",
        userId: 3
    },
]

const comments = [
    {
        body: "great tip!",
        blogId: 1,
        userId: 1
    },
    {
        body: "I agree 100%!",
        blogId: 3,
        userId: 2
    },
    {
        body: "well said!",
        blogId: 4,
        userId: 1
    },
    {
        body: "Awesome!",
        blogId: 2,
        userId: 3
    },

]

const seedData = async ()=>{
    try{
        await sequelize.sync({force:true})
        await User.bulkCreate(users,{
            individualHooks:true
        });
        await Blog.bulkCreate(blogs);
        await Comment.bulkCreate(comments);
        process.exit(0);
    } catch(err){
        console.log(err)
    }
}

seedData()