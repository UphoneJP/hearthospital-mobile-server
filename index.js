if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require('express')
const {createServer} = require('http')
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')
const passport = require("passport")
const rateLimit = require('express-rate-limit')
const User = require('./models/user')
const { checkApiKeyIni } = require('./utils/middleware')
const customSocket = require('./controller/customSocket')

const app = express()
const server = createServer(app)

const URL = process.env.MONGO_URI || process.env.MONGO_LOCAL_URI
const secret = process.env.SECRET || 'mysecret'
const PORT = process.env.PORT || 3000

mongoose.connect(URL)
.then(()=>console.log('mongoDB接続中'))
.catch((e)=>console.log('エラー発生', e))
const store = MongoStore.create({
  mongoUrl: URL,
  crypto: { secret },
  touchAfter: 24 * 3600
})
store.on('error', e =>console.log('セッションストアエラー', e))

customSocket(server)

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(passport.initialize())
const apiLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 20,
  message: "Too many requests from this IP."
})
app.use('/api', apiLimiter)
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || ''
  if (!userAgent || userAgent.includes('curl') || userAgent.includes('bot')) {
      return res.status(403).send('Access denied')
  }
  next()
})

passport.use(User.createStrategy())

app.use(checkApiKeyIni)
const hospitalRoutes = require('./routes/hospital')
const talkingRoomRoutes = require('./routes/talkingRoom')
const userRoutes = require('./routes/user')
const otherRoutes = require('./routes/others')
app.use('/api/hospital', hospitalRoutes)
app.use('/api/talkingRoom', talkingRoomRoutes)
app.use('/api/user', userRoutes)
app.use('/api/others', otherRoutes)

app.get('/', (req, res)=> {
  res.send('server')
})

server.listen(PORT, (req, res) => {
console.log(`http://localhost:${PORT} で待ち受け中`)
})
