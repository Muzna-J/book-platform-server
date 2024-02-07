const router = require("express").Router();
const User = require('../models/User.model');
const Book = require('../models/Book.model');
const Review = require('../models/Review.model');
const { isLoggedIn } = require("../middleware/route-guard");


router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/reading-list', isLoggedIn, async(req, res) => {
  try {
    const user = await User.findById(req.session.currentUser._id).populate('readingList');
    res.json(user.readingList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });

  }
});

router.post('/reading-list/add', isLoggedIn, async(req, res) => {
  try {
    const { volumeId, title , thumbnail } = req.body;
    if (!req.session.currentUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  
    // Create a new Book document or find an existing one
    let book = await Book.findOne({ volumeId });
    if (!book) {
      book = new Book({ volumeId, title, thumbnail });
      await book.save();
    }

    // Add the book's ObjectId to the user's reading list
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      $addToSet: { readingList: book._id }
    });

    res.json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error : undefined });
  }
});


router.post('/delete-book', isLoggedIn, async (req, res) => {
  try {
    const { volumeId } = req.body;
    const book = await Book.findOne({ volumeId });
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      $pull: { readingList:  book._id }
    });
    res.send('Book removed from reading list')
  } catch (error) {
    res.status(500).send('internal server error', error);
  }
});


router.post('/add-review', isLoggedIn, async (req, res) => {
  try {
    const { rating, comment, volumeId } = req.body;
    if (!rating || rating === 0 || !comment.trim()) {
      return res.status(400).json({ message: 'Both rating and comment are required.' });
    }
    const existingReview = await Review.findOne({user: req.session.currentUser._id, volumeId});

    if (existingReview) {
      return res.status(400).json({message: 'You have already reviewed this book'})
    }

    const review = new Review({
      volumeId,
      user: req.session.currentUser._id,
      rating,
      comment
    });
    await review.save();
    res.status(200).json(review);

  } catch (error) {
    res.status(500).send('Internal server error');
  }
});


router.get('/get-reviews/:volumeId', async (req, res) => {
  try {
    const { volumeId } = req.params;
    const reviews = await Review.find({ volumeId }).populate('user', 'name _id');
    
    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews yet." });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Internal server error');
  }
});


router.delete('/delete-review/:reviewId', isLoggedIn, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the current user is the one who posted the review
    if (req.session.currentUser._id !== review.user.toString()) { // converting the objectId in Mongo to a string to compare with the _id of the session which is a string
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await Review.findByIdAndRemove(reviewId);

    // Remove the review reference from the book
    const book = await Book.findById(review.volumeId);
    if (book) {
      book.reviews.pull(reviewId);
      await book.save();
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

 
router.put('/edit-review/:reviewId', isLoggedIn, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the current user is the one who posted the review
    if (req.session.currentUser._id !== review.user.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this review' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error('Error editing review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;
