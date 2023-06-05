const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Book = require('./model/book')

const app = express()
const port = 3000

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

app.get('/book', async (req, res) => {
  const books = await Book.find()

  res.render('book', {
    title: 'Books',
    layout: 'layouts/main-layout',
    books,
    msg: req.flash('msg'),
  })
})

// route to books detail
app.get('/book/:author', async (req, res) => {
  const book = await Book.findOne({ author: req.params.author })

  res.render('detail', {
    title: 'Detail',
    layout: 'layouts/main-layout',
    book,
  })
})

// route to add book
app.get('/book/add', (req, res) => {
  res.render('add-book', {
    title: 'Form to add books',
    layout: 'layouts/main-layout',
  })
})

app.listen(port, () => {
  console.log(`Mongo Books App | Listening at http://localhost:${port} `)
})
