const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UsersSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collation: 'UserCollection',
  },
)

UsersSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew())
    this.password = bcrypt.hashSync(this.password, 12)
  next()
})

module.exports = mongoose.model('UsersModel', UsersSchema)
