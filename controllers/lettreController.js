
const Lettre = require('../models/lettre')
const generateDescription = require('../utils/generateText')

//const generateText=require('../utils/generateText').generateTextFunction();


//get all Lettres

const lettreGet = async (req, res) => {
    const lettres = await Lettre.find()
    if (!lettres.length) {
        res.status(400).send('not lettre found')

    }
    res.json(lettres)
}
// create new lettre

const createLettre = async (req, res) => {
    const { fullname,company, skills,description } = req.body;
    
   // const gneratedDesc=await generateTextFunction(String(description));
    //console.log(gneratedDesc);
    const email='b@gmail.gmail';
    const prompt3 = `I am writing lettre de motivation based in this information ${description} +my name:${fullname}+i can do :${skills}+ company name :${company}`;
    const generatedLettre=await generateDescription(prompt3);

   
    const newLettre = { fullname, company,skills,email,description,generatedLettre }
    const lettre = await Lettre.create(newLettre)
    res.status(200).send('lettre created')
}

//update Lettre
const updateLettre = async (req, res) => {
  const { id } = req.params;
  const { fullname, company, skills, description, generatedLettre } = req.body;

  try {
    const lettre = await Lettre.findById({_id: id});
console.log(lettre);
    if (!lettre) {
      return res.status(404).json({ error: 'Lettre not found' });
    }

    lettre.fullname = fullname;
    lettre.company = company;
    lettre.skills = skills;
    lettre.description = description;
    lettre.generatedLettre = generatedLettre;

    const updatedLettre = await lettre.save();
    res.status(200).json({ message: 'Lettre updated successfully', updatedLettre });
  } catch (error) {
    console.error('Error updating lettre:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//delete lettre
module.exports = { lettreGet, createLettre, updateLettre }