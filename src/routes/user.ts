import { json, Router, Request, Response } from 'express'
import { auth } from '../middleware/auth'
import { User } from '../model/user'

export const UserRouter = Router()

UserRouter.use(auth)

UserRouter.use(json())

UserRouter.get('/', async (req, res) => {
  // @ts-ignore
  const user = await User.findById(req.user.id, 'id username players remotes')
  res.status(200).json({ user })
})
