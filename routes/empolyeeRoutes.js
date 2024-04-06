const express = require("express");
const validateToken = require("../middleware/validatetokenHandler");
const {createEmployee,getAllEmployee}=require("../controllers/empolyeeController")
const router = express.Router();

router.post("/", validateToken, createEmployee);
router.get("/",validateToken,getAllEmployee)

module.exports = router;
