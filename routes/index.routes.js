const router = require("express").Router();
const User = require('../models/User.model');
const Book = require('../models/Book.model');
const Review = require('../models/Review.model');



router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/reading-list', async(req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('readingList');
    res.json(user.readingList);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });

  }
});

router.post('/reading-list/add', async(req, res) => {
  try {
    const { bookId, title, thumbnail } = req.body;
    let book = await Book.findOne({ bookId });
    if(!book) {
      book = await Book.create({ bookId, title, thumbnail })
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { readingList: book._id}
    });
    res.json({ message: 'Book added to reading list' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error : undefined });
  }
});

router.post('/delete-book', async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findOne({ bookId });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { readingList: book._id }
    });
    res.send('Book removed from reading list')
  } catch (error) {
    res.status(500).send('internal server error');
  }
});

router.post('/books/:bookId/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user._id;

    const review = new Review({
      book: bookId,
      user: userId,
      rating,
      comment
    });
    await review.save();
    res.status(200).json(review);
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});



module.exports = router;
