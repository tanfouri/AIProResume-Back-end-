require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
async function generateDescription(description) {

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

const prompt =  description;

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
  return text ;

}
module.exports = generateDescription;