const jwt = require("jsonwebtoken");
const jwtSecret = process.env.KEY;

function extractToken (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
      return req.query.token;
  }
  return null;
}

exports.adminAuth = (req, res, next) => {
  notNull = (req)=>{
    if (req.cookies.jwt){
      return req.cookies.jwt;
    }else{
      // returns jwt token from a postman request authorization
      return extractToken(req)
    }
  }
  const token = notNull(req);
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log("Admin Token Invalid");
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "admin" && decodedToken.role !== "Admin") {
          console.log("Admin Role Invalid")
          return res.status(401).json({ message: "Not authorized, You need to be a admin to perform this action" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};
exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log("User Token Invalid" )
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "Basic" && decodedToken.role !== "Admin") {
          console.log("User Role Invalid")
          return res.status(401).json({ message: "Not authorized" });
        } else {
          req.userName = decodedToken.username
          req.role = decodedToken.role
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

