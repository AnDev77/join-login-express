const express = require('express')
const app = express()
const port = 3001
app.listen(port, () => {
   console.log(`app is listening on ${port}`)
})

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')

app.use('/', userRouter)
app.use('/channels', channelRouter)

