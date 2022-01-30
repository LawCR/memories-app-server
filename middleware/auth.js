const jwt = require("jsonwebtoken");

const authValidation = async(req, res, next) => {
    try {
        // Obtenemos el token y se evalua si es de Google o el de propio
        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500

        let decodedData;

        // Si es nuestro token o el de Google
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET)
            
            req.userId = decodedData?.id
        } else {
            decodedData = jwt.decode(token)

            req.userId = decodedData?.sub
        }

        next()
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    authValidation
}