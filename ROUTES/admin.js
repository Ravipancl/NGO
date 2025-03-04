const {Router} = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const {JWT_SECRET, JWT_EXPIRY, NODE_ENV} = require('../config');
const {Admin} = require("../DB/index");
const adminMiddleware = require("../MIDDLEWARE/admin");
const router = Router();

router.post('/signup', async (req, res) => {
    // get the info of the admin from the body

    const { username, email, password } = req.body;

    try {
       const AdminExist = await Admin.findOne({
        email: email,
    })

    if(AdminExist){
        return res.status(405).json({
            message: "Admin Already Exist"
        })
    }

    await Admin.create({
        username: username,
        email: email,
        password: password
    }) 
    return res.send({
        msg: "Admin created succesfully"
    })

    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({
            message: "internal server error."
        })
    }

})

router.post('/signin', async (req, res) =>{
    const {email, password} = req.body;

    try {
        
        const admin = await Admin.findOne({
            email,
        })

        const isMatch = await bcrypt.compare(password, admin.password);
        
        if(!admin || !isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Generating a token 
        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, JWT_EXPIRY);

        //set the token in the cookie 
        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV,
            sameSite: 'Strict',
            maxAge: 3600000
        })

        return res.status(200).json({
            message: "Signin Successful.",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        })


    } catch (error) {
        
    }
})

module.exports = router