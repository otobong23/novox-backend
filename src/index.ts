import express from 'express';
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import http from 'http';
import mongoose from 'mongoose';
import { errorHandler } from './Errors/ErrorHandler';
import AppRouter from './routes';

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
const MONGO_DB: string = process.env.MONGO_DB!

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'https://novox.app', 'https://www.novox.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))
// app.options('*', cors({
//   credentials: true,
//   origin: ['http://localhost:3000']
// }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
   res.send('Welcome to the backend of the fintech application')
})
app.use('/', AppRouter)
app.use(errorHandler)

const server = http.createServer(app)
console.log('prestart')
mongoose.Promise = Promise
mongoose.connect(MONGO_DB, {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('Database is connected')
  server.listen(PORT, () => {
    console.log(`server listening from http://localhost:${PORT}/`)
  })
}).catch(e => {
  console.error('connection error')
  throw new Error('Failed to connect to the database')
})
console.log('post start; compiled')