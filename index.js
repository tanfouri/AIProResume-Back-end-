require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const lettreRoutes=require("./routes/lettreRoute")
const passwordResetRoutes = require("./routes/passwordReset");
const multer = require("multer");
const path = require("path");
const axios = require('axios');
const fs = require("fs");
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/lettre",lettreRoutes)
//cv

// Replace 'YOUR_PALM_API_KEY' and 'YOUR_PALM_API_ENDPOINT' with your actual Palm API key and endpoint
const PALM_API_KEY = process.env.PALM_API_KEY;
const PALM_API_ENDPOINT = process.env.PALM_API_ENDPOINT;

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const generateID = () => Math.random().toString(36).substring(2, 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});


const generateTextFunction = async (prompt) => {
    try {
      const response = await axios.post(
        `${PALM_API_ENDPOINT}?key=${PALM_API_KEY}`,
        {
          prompt: {
            text: prompt,
          },
        }
      );
      return response.data.candidates[0].output;
    } catch (error) {
      console.error('Error communicating with Google Cloud API:', error.message);
      throw error;
    }
  };
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
  // ... existing code ...
	const {
		fullName,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory,
	} = req.body;

	const workArray = JSON.parse(workHistory);
	const newEntry = {
		id: generateID(),
		fullName,
		image_url: `http://localhost:8080/uploads/${req.file.filename}`,
		currentPosition,
		currentLength,
		currentTechnologies,
		workHistory: workArray,
	};

	const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write a 100 words description for the top of the resume(first person writing)?`;

	const prompt2 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I write in the technolegies: ${currentTechnologies}. Can you write 10 points for a resume on what I am good at?`;

	const remainderText = () => {
		let stringText = "";
		for (let i = 0; i < workArray.length; i++) {
			stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`;
		}
		return stringText;
	};

	const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n During my years I worked at ${
		workArray.length
	} companies. ${remainderText()} \n Can you write me 50 words for each company seperated in numbers of my succession in the company (in first person)?`;

    const objective = await generateTextFunction(prompt1);
    console.log(objective);
    const keypoints = await generateTextFunction(prompt2);
    const jobResponsibilities = await generateTextFunction(prompt3);

	const chatgptData = { objective, keypoints, jobResponsibilities };
	const data = { ...newEntry, ...chatgptData };
	console.log(data)

	res.json({
		message: "Request successful!",
		data,
	});
});


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
