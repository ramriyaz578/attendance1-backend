// const JWT = require('jsonwebtoken')
// require('dotenv').config();


// module.exports = async (req, res, next) => {
// try {
//     const token = req.headers.authorization.split(" ")[1];

// JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
//     if (err) {
//         return res.status(401).json({ message: "Unauthorized access" });
//     } else {
//         console.log("Decoded JWT:", decode);
//         req.body.userId = decode.userId;
//         next();
//     }
// })
// // if (err){

// // }
// } catch (error) {
// console.log(error)
// res.status(500).send({
// success: false,
// message: 'Eror In Auth API',
// error
// })
// }




// }


const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = { id: decoded.userId };
    console.log("Decoded JWT:", decoded);
    next();
  });
};

module.exports = authMiddleware;
