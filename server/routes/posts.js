const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid token or user deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token.'
    });
  }
};

// @route   GET /api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;
    const search = req.query.search;

    let query = { isPublished: true };

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName avatar')
      .populate('comments.user', 'username firstName lastName avatar')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar bio')
      .populate('comments.user', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar');

    if (!post || !post.isPublished) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content is required and must be less than 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { title, content, tags, image } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
      image: image || ''
    });

    await post.save();

    // Populate author info
    await post.populate('author', 'username firstName lastName avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (author only)
router.put('/:id', authenticateToken, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be less than 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Not authorized to update this post'
      });
    }

    const { title, content, tags, image } = req.body;
    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (tags !== undefined) updateFields.tags = tags;
    if (image !== undefined) updateFields.image = image;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName avatar');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (author only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.isPublished) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      await post.removeLike(req.user._id);
      res.json({
        message: 'Post unliked',
        liked: false
      });
    } else {
      await post.addLike(req.user._id);
      res.json({
        message: 'Post liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add comment to a post
// @access  Private
router.post('/:id/comments', authenticateToken, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post || !post.isPublished) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    await post.addComment(req.user._id, req.body.content);

    // Populate the updated post
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar')
      .populate('comments.user', 'username firstName lastName avatar');

    res.json({
      message: 'Comment added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Add comment error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    res.status(500).json({
      error: 'Server Error',
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

module.exports = router; 