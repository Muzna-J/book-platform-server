const router = require("express").Router();
const { getBookDetails, searchByAuthor } = require('../api/googleBooksAPI');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/bookdetails/:bibkeys', async(req, res, next) => {
  try {
    const bookDetails = await getBookDetails(req.params.bibkeys);
    res.json(bookDetails);
  } catch (error) {
    next(error);

  }
});

router.get('/authors/:olid', async(req, res, next) => {
  try {
    const authorWork = await searchByAuthor(req.params.olid);
    res.json(authorWork);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
