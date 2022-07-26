const  jwt = require( 'jsonwebtoken');


module.exports.generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};







// module.exports.isOwner = (req, res, next) => {
//   console.log(req.body.name)
//   if (req.body.name === "Osk") {
//     next();
//   } else {
//     res.status(401).send({ message: 'Invalid Admin Token' });
//   }
// };

// module.exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.isSeller) {
//     next();
//   } else {
//     res.status(401).send({ message: 'Invalid Seller Token' });
//   }
// };

// module.exports.isSellerOrAdmin = (req, res, next) => {
//   if (req.user && (req.user.isSeller || req.user.isAdmin)) {
//     next();
//   } else {
//     res.status(401).send({ message: 'Invalid Admin/Seller Token' });
//   }
// };


// module.exports.isAuth = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (authorization) {
//     const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'somethingsecret',
//       (err, decode) => {
//         if (err) {
//           res.status(401).send({ message: 'Invalid Token' });
//         } else {
//           req.user = decode;
//           next();
//         }
//       }
//     );
//   } else {
//     res.status(401).send({ message: 'No Token' });
//   }
// };