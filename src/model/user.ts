import { Schema, model } from 'mongoose'
import { playerSchema } from './player'

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  players: [playerSchema],
  remotes: [],
})

export const User = model('User', userSchema)
