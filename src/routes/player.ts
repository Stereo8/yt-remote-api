import { json, Router, Request, Response } from 'express'
import { Player } from '../model/player'
import { auth } from '../middleware/auth'

export const PlayerRouter = Router()

PlayerRouter.use(json())

PlayerRouter.use(auth)

PlayerRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const player = await Player.findById(id)
    res.json({ player })
  } catch (error) {
    res.status(500).json({ error })
  }
})

PlayerRouter.post('/', async (req: Request, res: Response) => {
  const { name } = req.body
  const player = new Player({ name, available: false })
  try {
    await player.save()
    res.status(201).json({ player })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

PlayerRouter.put('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    await Player.updateOne({ _id: req.params.id }, { ...req.body })
    res.status(204).json(player)
  } catch (error) {
    res.status(500).json({ error })
  }
})

PlayerRouter.delete('/:id', async (req, res) => {
  const playerId = req.params.id
  try {
    await Player.deleteOne({ _id: playerId })
    res.status(200).send({})
  } catch (error) {
    res.status(500).json({ error })
  }
})
