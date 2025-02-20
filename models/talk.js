const mongoose = require('mongoose')
const {Schema} = mongoose

const talkSchema = new Schema({
  loggedInUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  guestName: String,
  content: {
    type: String,
    required: true
  },
  madeAt: Date,
  deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Talk', talkSchema)
