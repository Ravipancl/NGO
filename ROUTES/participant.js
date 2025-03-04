const {Router} = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const {JWT_SECRET, JWT_EXPIRY, NODE_ENV} = require('../config');
const {Participant} = require("../DB/index");
const userMiddleware = require("../MIDDLEWARE/user");
const router = Router();

router.post('/signup', async (req, res) => {
    // get the info of the participant from the body

    const { username, email, password } = req.body;

    try {
       const ParticipantExist = await Participant.findOne({
        email: email,
    })

    if(ParticipantExist){
        return res.status(405).json({
            message: "Participant Already Exist"
        })
    }

    await Participant.create({
        username: username,
        email: email,
        password: password
    }) 
    return res.send({
        msg: "Participant created succesfully"
    })

    } catch (error) {
        console.error("Error creating participant:", error);
        return res.status(500).json({
            message: "internal server error."
        })
    }

})

router.post('/signin', async (req, res) =>{
    const {email, password} = req.body;

    try {
        
        const participant = await Participant.findOne({
            email,
        })

        // encrypt the entered password and compare it with the original one
        const isMatch = await bcrypt.compare(password, participant.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if(!participant || !isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Generating a token
        const token = jwt.sign({ id: participant._id, email: participant.email }, JWT_SECRET, JWT_EXPIRY);

        //set the token in the cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV,
            sameSite: 'Strict',
            maxAge: 3600000
        })

        return res.status(200).json({
            message: "Signin Successful.",
            participant: {
                id: participant._id,
                username: participant.username,
                email: participant.email
            }
        })


    } catch (error) {

    }
})

module.exports = router