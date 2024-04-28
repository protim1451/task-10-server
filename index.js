const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
  app.use(cors(corsConfig))
  app.options("", cors(corsConfig))
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })