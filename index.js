
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
// Importacion de rutas
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

const app = express()



// Config para el envio de data
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))

// Config de cors
app.use(cors())

//Config de rutas para los endpoints
app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.send('Bienvenidos al memories API V3.0.0')
})

const PORT = process.env.PORT || 8081

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database connection successfull!!");
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
    .catch((error) => console.log(error.message))

