import express, { Express, Request, Response } from 'express'
import { Player } from './model/player'
import { PlayerRouter } from './routes/player'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use('/player', PlayerRouter)

const dbConn = mongoose.connect(process.env.DB_URL)
const db = mongoose.connection

db.on('error', (error) => {
  console.log(error)
})

db.once('connected', () => {
  console.log('Database Connected')
})

app.use(express.json())

app.get('/player/:id', async (req, res) => {
  const id = req.params.id
  res.json(await Player.findById(id))
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  )
})
