const jwt = require("jsonwebtoken");


// Verify Token
module.exports = (req, res, next) => {
  // Get auth header value
  // const bearerHeader = req.headers['Authorization'];
  //Check if bearer is undefined
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'abcd-should-be-longuer');
    req.userData = {
      email : decodedToken.email,
      idUser: decodedToken.idUser,
      nomUser: decodedToken.nomUser,
      token : token
    };
    next();
  } catch (error) {
    res.status(403).json({ message: "Vous n'êtes pas authentifié" });
  }
};

// //Verify Token
// module.exports = (req, res, next) => {
//   // Get auth header value
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if (typeof bearerHeader !== 'undefined') {
//     // Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const token = bearer[1];
//     // Set the token
//     req.userData = {
//       email : decodedToken.email,
//       idUser: decodedToken.idUser,
//       nomUser: decodedToken.nomUser,
//       token : token
//     };
//     // Next middleware
//     next();
//   } else {
//     res.status(403).json({ message: "Vous n'êtes pas authentifié" });
//   }
// };
