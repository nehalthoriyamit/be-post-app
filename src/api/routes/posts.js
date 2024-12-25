const express = require("express");
const multer = require("multer");
const { getPosts, addPost, toggleLikePost } = require("../controllers/posts");
const { Authentication } = require("../../middlewares/authentication");

const router = express.Router();

const multerParse = multer({
  dest: "src/uploads/",
});

router.get("/posts", Authentication, getPosts);
router.post("/addpost", Authentication, multerParse.single("file"), addPost);
router.post("/post/toggleLike", Authentication, toggleLikePost);


module.exports = router;
