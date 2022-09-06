import express, { Express, Request, Response } from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

const players = [0]

app.use(express.json())

app.post('/player', (req: Request, res: Response) => {
  const newId = players.at(-1) + 1
  players.push(newId)
  console.log(`creating player ID: ${newId}`)
  res.json({ id: newId })
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${process.env.SERVER_PORT}`
  )
})
