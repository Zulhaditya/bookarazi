const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Book = require('./model/book')

const app = express()
const port = 3000

// setup method-override
app.use(methodOverride('_method'))

// setup EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// config flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true,
  })
)
app.use(flash())

// homepage
app.get('/', (req, res) => {
  const biodata = [
    {
      nama: 'Zulhaditya Hapiz',
      email: 'zulhaditya@gmail.com',
    },
    {
      nama: 'Inayah Wulandari',
      email: 'inayah@gmail.com',
    },
    {
      nama: 'Killua Zoldyck',
      email: 'killua@gmail.com',
    },
  ]

  res.render('index', {
    nama: 'Hapiz',
    title: 'Home',
    biodata,
    layout: 'layouts/main-layout',
  })
})

// about page
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    layout: 'layouts/main-layout',
  })
})

// route to list book
app.get('/book', async (req, res) => {
  const books = await Book.find()

  res.render('book', {
    title: 'Books',
    layout: 'layouts/main-layout',
    books,
    msg: req.flash('msg'),
  })
})

// route to add book
app.get('/book/add', (req, res) => {
  res.render('add-book', {
    title: 'Form to add books',
    layout: 'layouts/main-layout',
  })
})

// process to add data books
app.post(
  '/book',
  [
    body('title').custom(async (value) => {
      const duplicate = await Book.findOne({ title: value })
      if (duplicate) {
        throw new Error('Title already in use!')
      }
      return true
    }),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('add-book', {
        title: 'Add Book',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      })
    } else {
      Book.insertMany(req.body, (error, result) => {
        // send flash message
        req.flash('msg', 'Contact successfully added!')
        res.redirect('/book')
      })
    }
  }
)

// process to delete book
app.delete('/book', (req, res) => {
  Book.deleteOne({ title: req.body.title }).then((result) => {
    req.flash('msg', 'Book successfully deleted!')
    res.redirect('/book')
  })
})

// route to edit book
app.get('/book/edit/:author', async (req, res) => {
  const book = await Book.findOne({ author: req.params.author })

  res.render('edit-book', {
    title: 'Form edit book',
    layout: 'layouts/main-layout',
    book,
  })
})

// process for edit books
app.put(
  '/book',
  [
    body('title').custom(async (value, { req }) => {
      const duplicate = await Book.findOne({ title: value })
      if (value !== req.body.oldTitle && duplicate) {
        throw new Error('Title already in use!')
      }
      return true
    }),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('edit-book', {
        title: 'Edit books',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        book: req.body,
      })
    } else {
      Book.updateOne(
        { _id: req.body._id },
        {
          $set: {
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            year: req.body.year,
            review: req.body.review,
          },
        }
      ).then((result) => {
        // send flash message
        req.flash('msg', 'Contact successfully edited!')
        res.redirect('/book')
      })
    }
  }
)

// route to books detail
app.get('/book/:author', async (req, res) => {
  const book = await Book.findOne({ author: req.params.author })

  res.render('detail', {
    title: 'Detail',
    layout: 'layouts/main-layout',
    book,
  })
})

app.listen(port, () => {
  console.log(`Mongo Books App | Listening at http://localhost:${port} `)
})
