import { Schema, model } from 'mongoose'

export const remoteSchema = new Schema({
  name: String,
})

export const Remote = model('Remote', remoteSchema)
