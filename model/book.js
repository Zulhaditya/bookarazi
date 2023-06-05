const mongoose = require('mongoose')

const Book = mongoose.model('Book', {
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  year: {
    type: String,
  },
  review: {
    type: String,
  },
})

module.exports = Book
