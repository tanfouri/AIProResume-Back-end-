const express = require('express')

const LettreController = require('../controllers/lettreController')

const router = express.Router()

router.route('/')
        .get(LettreController.lettreGet)
        .post(LettreController.createLettre)
        .put(LettreController.updateLettre)
       
module.exports=router