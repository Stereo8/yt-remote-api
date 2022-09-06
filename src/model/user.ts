import { Schema, model } from 'mongoose'
import { playerSchema } from './player'

const userSchema = new Schema({
  username: String,
  password: String,
  players: [playerSchema],
  remotes: undefined,
})

export const User = model('User', userSchema)
