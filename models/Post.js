const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    writer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the writer'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, 
      required: [true, 'Please provide an image URL or path'],
    },
    imgSource: {
      type: String,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Please provide the post content'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);

PostSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});