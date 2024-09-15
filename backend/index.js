const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const router = require('./Routers/taskRouters')
const cors = require('cors');
const app = express();

const corsOptions = {
  origin:'http://localhost:5173',
  credentials:true
}

app.use(cors(corsOptions));
app.use(express.json({}));
app.use(cookieParser());
app.use('/api/v1', router)

const PORT = process.env.PORT ||7000

// Connect to DB
const DBconnection = require("./config/Database");
DBconnection();

app.listen(PORT, () =>  console.log(`app is lisnig at port at ${PORT}`))
