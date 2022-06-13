const express = require('express')
const app = express()
const PORT = 3000

const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postsRouter = require('./routes/posts')

//ミドルウェア
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)






// app.get('/', (req, res) => {
//     res.send('hello express')
// })

app.listen(PORT, () => console.log('sever up'))