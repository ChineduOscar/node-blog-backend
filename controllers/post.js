const Post = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Get all posts (Admin can see all posts, normal users only see their own)
const getAllPosts = async (req, res) => {
  let posts;
  if (req.user.role === 'admin') {
    // Admin can see all posts
    posts = await Post.find({}).sort('createdAt');
  } else {
    // Regular user can only see their own posts
    posts = await Post.find({ writer: req.user.userId }).sort('createdAt');
  }
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

// Get a single post by ID (Admin can access any post, user can access only their own)
const getPost = async (req, res) => {
  const {
    user: { userId, role },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    _id: postId,
    ...(role !== 'admin' && { writer: userId }), // Admin can access any post, others can access only their own
  });

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }

  res.status(StatusCodes.OK).json({ post });
};

// Create a new post
const createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content || !req.files || !req.files.image) {
    throw new BadRequestError('Title, Content, and Image are required');
  }

  // Upload the image to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'file-upload',
  });

  req.body.writer = req.user.userId;
  req.body.image = uploadResult.secure_url;

  const post = await Post.create(req.body);
  
  // Optionally, clean up the local file
  fs.unlinkSync(req.files.image.tempFilePath); // Delete the temporary file after upload

  res.status(StatusCodes.CREATED).json({ post });
};

// Update an existing post
const updatePost = async (req, res) => {
  const {
    body: { title, content },
    user: { userId, role },
    params: { id: postId },
  } = req;

  if (!title || !content) {
    throw new BadRequestError('Title or Content fields cannot be empty');
  }

  const post = await Post.findOne({
    _id: postId,
    ...(role !== 'admin' && { writer: userId }), // Admin can update any post, others can only update their own
  });

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }

  // If a new image is uploaded, upload it to Cloudinary
  if (req.files && req.files.image) {
    const uploadResult = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: 'file-upload',
    });
    req.body.image = uploadResult.secure_url; // Update the image URL
    // Clean up the local file
    fs.unlinkSync(req.files.image.tempFilePath); // Delete the temporary file after upload
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ post: updatedPost });
};

// Delete a post (Admin can delete any post, user can delete only their own)
const deletePost = async (req, res) => {
  const {
    user: { userId, role },
    params: { id: postId },
  } = req;
  
  const post = await Post.findOne({
    _id: postId,
    ...(role !== 'admin' && { writer: userId }), // Admin can delete any post, others can delete only their own
  });

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }

  await Post.findByIdAndDelete(postId);

  res.status(StatusCodes.OK).send();
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
  getPost,
};
