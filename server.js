const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')
const uploadRouter = require('./routes/upload')
const path = require('path')
require('dotenv').config() //.envファイルを利用するためのライブラリ

//DB接続
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB接続中'))
.catch(err => console.log(err))

//ミドルウェア
app.use('/images', express.static(path.join(__dirname, 'public/images')))
app.use(express.json()) // json形式でデータを扱う宣言
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/upload', uploadRouter)

app.listen(PORT, () => console.log('sever up'))