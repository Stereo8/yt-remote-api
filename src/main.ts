import express, { Express, Request, Response } from 'express'
import { Player } from './model/player'
import { PlayerRouter } from './routes/player'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { AuthRouter } from './routes/auth'
import { UserRouter } from './routes/user'
import wss from './websockets'

dotenv.config()

const app = express()

app.set('trust proxy', 'loopback')

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.ip}`)
  next()
})

app.use('/player', PlayerRouter)
app.use('/auth', AuthRouter)
app.use('/user', UserRouter)

const dbConn = mongoose.connect(process.env.DB_URL)
const db = mongoose.connection

db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log('Database Connected')
})

app.use(express.json())

const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  )
})

wss(server)
