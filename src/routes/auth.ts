import { json, Router } from 'express'
import { expressjwt } from 'express-jwt'
import { User } from '../model/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const AuthRouter = Router()

const secret = process.env.JWT_SECRET

AuthRouter.use(json())

AuthRouter.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) {
    res.status(400).send('username and password required')
  }

  User.findOne({ username: username }, (error, result) => {
    if (!error && result) {
      res.status(409).send('User already exists.')
    }
  })

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({
    username,
    password: passwordHash,
    remotes: [],
    players: [],
  })

  jwt.sign(
    { id: newUser.id },
    secret,
    {
      algorithm: 'HS384',
    },
    (error, encoded) => {
      if (error) {
        res.status(500).json({ error: error }) // TODO: logs
      } else {
        newUser.save()
        res.status(201).json({ token: encoded })
      }
    }
  )
})

AuthRouter.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      algorithm: 'HS384',
    })
    res.status(200).json({ token })
  } else {
    res.status(401).send('Incorrect password')
  }
})
