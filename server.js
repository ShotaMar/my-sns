const express = require('express')
const app = express()
const PORT = 3000
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')
require('dotenv').config()

//DB接続
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB接続注'))
.catch(err => console.log(err))

//ミドルウェア
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.get('/', (req, res) => {res.send('hello')})





// app.get('/', (req, res) => {
//     res.send('hello express')
// })

app.listen(PORT, () => console.log('sever up'))