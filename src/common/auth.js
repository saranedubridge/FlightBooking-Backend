/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

const hashCompare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createToken = async (payload) => {
  console.log("JWT Expire Time: ", process.env.JWT_EXPIRE);
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn:'8h'
  
  });
  return token;
};

const decodeToken = async (token) => {
  const payload = await jwt.decode(token);
  return payload;
};



const validate = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // Check if the error is due to token expiration
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
          }
          // Handle other errors such as invalid token
          return res.status(401).json({ message: "Token is invalid" });
        }
        req.user = decoded;
        next();
      });
    } else {
      res.status(400).send({ message: "No Token Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const adminGaurd = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (token) {
    let payload = await decodeToken(token);
    if (payload.role === "admin") next();
    else res.status(400).send({ message: "Only Admins are allowed" });
  } else {
    res.status(400).send({ message: "No Token Found" });
  }
};
export default {
  hashPassword,
  hashCompare,
  createToken,
  validate,
  adminGaurd,
  decodeToken,
};
