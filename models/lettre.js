const mongoose = require("mongoose");

const lettreSchema = new mongoose.Schema({
	fullname: { type: String, required: true },
	company: { type: String, required: true },
	skills: { type: String, required: true },
	email: { type: String, required: true },
	description: { type: String, required: true },
	generatedLettre: { type: String, required: false }},{
   
        timestamps: true
    

});



module.exports = mongoose.model('Lettre', lettreSchema)