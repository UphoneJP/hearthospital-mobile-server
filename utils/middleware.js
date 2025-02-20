const BadUser = require("../models/badUser")

module.exports.checkUser = (req, res, next) => {
  const {userid} = req.params
  if(!req.user || userid !== req.user._id.toString()){
    return res.json({error:true})
  }
  next()
}

module.exports.checkApiKeyIni = async (req, res, next) => {
  const apiKeyIni = req.headers["api-key-ini"]
  if (!apiKeyIni || apiKeyIni !== process.env.API_KEY_INI) {
    const badUser = new BadUser({
      ip: req.ip,
      accessAt_JST: new Date().toLocaleString('ja-JP')
    })
    await badUser.save()
    console.log("bad user detected")
    return res.status(403).json({ message: "Access denied: Invalid API key" })
  }
  console.log("good user")
  next()
}
