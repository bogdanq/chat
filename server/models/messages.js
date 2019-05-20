const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessagesSchema = new Schema(
  {
    date: {
      type: Date,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collation: 'MessagesCollection',
  },
)

module.exports = mongoose.model('MessagesModel', MessagesSchema)
