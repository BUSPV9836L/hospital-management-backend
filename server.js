const express=require("express");
const cors = require('cors');
const errorHandeler = require("./middleware/errorHandler");
const dotenv=require("dotenv").config();

const PORT=process.env.PORT ||5000;
const app=express()

const port=5000;
app.use(cors());
app.use(express.json());
app.use('/api/users',require("./routes/userRoutes"));
app.use('/api/employee',require("./routes/empolyeeRoutes"));
app.use(errorHandeler)

app.listen(port,()=>{ 
    console.log("Server running in port 5000")
})

