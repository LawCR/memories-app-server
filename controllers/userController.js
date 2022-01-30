const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")
const User = require("../models/User")




const signin = async(req, res) => {
    const {email, password} = req.body

    try {
        const existingUser = await User.findOne({email})
        if(!existingUser) return res.status(404).json({message: "El usuario no existe."})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({message: "Password Incorrecto."})

        const token = jwt.sign(
            {email: existingUser.email, id:existingUser._id}, 
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.status(200).json({result: existingUser, token})

    } catch (error) {
        res.status(500).json({message: "Algo salio mal, intentelo denuevo mas tarde."})
    }
}

const signup = async(req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body
    try {
        const existingUser =  await User.findOne({email})
        if(existingUser) return res.status(400).json({message: "El usuario ya existe."})

        if (password !== confirmPassword) return res.status(400).json({message: "Los passwords no coinciden."})
    
        const hashedPassword = await bcrypt.hash(password, 12)

        const fullName = `${firstName} ${lastName}`

        const result = await User.create({email, password: hashedPassword, name: fullName})

        const token = jwt.sign(
            {email: result.email, id:result._id}, 
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.status(200).json({result: result, token})
    } catch (error) {
        res.status(500).json({message: "Algo salio mal, intentelo denuevo mas tarde."})
    }
}

module.exports = {
    signin,
    signup
}