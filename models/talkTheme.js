const mongoose = require('mongoose')
const {Schema} = mongoose
const Talk = require('../models/talk')

const talkThemeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  talks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Talk'
    }
  ],
  colorNum: Number,
  touchAt: Date,
  accessCount: {
    type: Number,
    default: 0
  }
})

talkThemeSchema.post('deleteOne', async function (talkTheme) {
  if (Array.isArray(talkTheme.talks) && talkTheme.talks.length > 0) {
    await Talk.deleteMany({ _id: { $in: talkTheme.talks } });
  }
})

module.exports = mongoose.model('TalkTheme', talkThemeSchema)
