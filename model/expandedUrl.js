const mongoose = require('mongoose')
const shortId = require('shortid')

const expandUrlSchema = new mongoose.Schema({
	full: {
		type: String,
		required: true
	},
})

module.exports = mongoose.model('ExpandUrl', expandUrlSchema)
