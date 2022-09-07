import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET

export const auth = (req, res, next) => {
  const token = req?.body?.token || req?.headers['x-access-token']

  if (!token) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
  next()
}
