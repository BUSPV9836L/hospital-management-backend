const asyncHandler = require("express-async-handler");
const db = require("../config/dbConnection");

const createEmployee = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    address,
    phone_number,
    email,
    position,
    department,
    hire_date,
    salary,
  } = req.body;
  if (
    !first_name ||
    !last_name ||
    !date_of_birth ||
    !gender ||
    !address ||
    !phone_number ||
    !email ||
    !position ||
    !department ||
    !hire_date ||
    !salary
  ) {
    res.status(400);
    throw new Error("All field are mandatory!");
  }
  try {
    const userAvailable = await db.query(
      "SELECT * FROM employee WHERE email=$1",
      [email]
    );
    if (userAvailable.rowCount == 1) {
      res.status(400);
      throw new Error("Email is Already in use!");
    }
    const newEmployee = await db.query(
      `INSERT INTO 
       employee(first_name,last_name,date_of_birth,gender,address,
       email,phone_number,position,department,hire_date,salary)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        address,
        email,
        phone_number,
        position,
        department,
        hire_date,
        salary,
      ]
    );
    if (newEmployee.rows.length !== 1) {
      res.status(400);
      throw new Error("Invalid Data!");
    }
    res.status(201).json(newEmployee.rows[0]);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getAllEmployee = asyncHandler(async (req, res) => {
  const result = await db.query("SELECT * FROM employee");
  res.status(200).json(result.rows);
});

module.exports = { createEmployee, getAllEmployee };
