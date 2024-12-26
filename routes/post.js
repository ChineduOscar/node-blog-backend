const express = require('express');
const authenticateUser = require('../middleware/authentication')

const router = express.Router();
const {
  createPost,
  deletePost,
  getAllPosts,
  getWriterPosts,
  updatePost,
  getPost,
  getPostBySlug,
} = require('../controllers/post'); 

// Define routes for posts
router.route('/').get(getAllPosts)  // Get all posts
router.route('/writer').get(authenticateUser, getWriterPosts) // Get posts by a writer
router.route('/').post(authenticateUser, createPost) // Create post
router.route('/:id').get(getPost).delete(authenticateUser, deletePost).patch(authenticateUser, updatePost); // Get, update, and delete a post by ID
router.route('/post/:slug').get(getPostBySlug); 

module.exports = router;
