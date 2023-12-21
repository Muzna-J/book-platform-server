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
  
    // First, create a new Book document or find an existing one
    let book = await Book.findOne({ volumeId });
    if (!book) {
      book = new Book({ volumeId, title, thumbnail });
      await book.save();
    }

    // Then, add the book's ObjectId to the user's reading list
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      $addToSet: { readingList: book._id }
    });

    res.json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error : undefined });
  }
});


// router.post('/reading-list/add', async(req, res) => {
//   try {
//     const { volumeId } = req.body;
//     if (!req.session.currentUser) {
//       return res.status(401).json({ message: 'Not authenticated' });
//     }
  
//     await User.findByIdAndUpdate(req.session.currentUser._id, {
//       $addToSet: { readingList: volumeId }
//     });

//     res.json({ message: 'Book added to reading list' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error : undefined });
//   }
// });

router.post('/delete-book', isLoggedIn, async (req, res) => {
  console.log("Delete request received:", req.body);
  try {
    const { _id } = req.body;
    const book = await Book.findOne({ volumeId });
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      $pull: { readingList:  _id }
    });
    res.send('Book removed from reading list')
  } catch (error) {
    console.log(error);
    res.status(500).send('internal server error', error);
  }
});

// router.post('/books/:bookId/reviews', async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const bookId = req.params.bookId;
//     const userId = req.user._id;

//     const review = new Review({
//       book: bookId,
//       user: userId,
//       rating,
//       comment
//     });
//     await review.save();
//     res.status(200).json(review);
    
//   } catch (error) {
//     res.status(500).json({message: error.message})
//   }
// });



module.exports = router;
