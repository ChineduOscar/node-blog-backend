const express = require('express');

const router = express.Router();
const {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
  getPost,
} = require('../controllers/post'); 

// Define routes for posts
router.route('/').post(createPost).get(getAllPosts); // Create and get all posts

router.route('/:id').get(getPost).delete(deletePost).patch(updatePost); // Get, update, and delete a post by ID

module.exports = router;
