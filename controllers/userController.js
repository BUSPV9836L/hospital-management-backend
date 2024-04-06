const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/dbConnection");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  try {
    const userAvailable = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (userAvailable.rowCount === 1) {
      res.status(400);
      throw new Error("User already registered!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.query(
      "INSERT INTO users(name,email, password) VALUES($1, $2, $3) RETURNING id, email",
      [name, email.toLowerCase(), hashedPassword]
    );
    res.status(201).send(newUser.rows[0]);
  } catch (error) {
    throw new Error(error.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  try {
    const user = await db.query("SELECT password FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    if(user.rowCount!==1){
       res.status(404);
       throw new Error("User Not found!")
    }
    if (user && (await bcrypt.compare(password, user.rows[0].password))) {
      const accessToken = jwt.sign(
        {
          user: {
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        accessToken,
      });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});
module.exports = { registerUser, loginUser };
