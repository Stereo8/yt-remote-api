import { Schema, model } from 'mongoose'

export const playerSchema = new Schema({
  available: Boolean,
  name: String,
})

export const Player = model('Player', playerSchema)
