const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGO_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false, useCreateIndex: true }).then(result => {
     console.log('connected to MongoDB')
   })
   .catch((error) => {
     console.log('error connecting to MongoDB:', error.message)
})
app.use(express.json());

const exerciseRoutes = require("./routes/exercise");

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use("/api/exercise", exerciseRoutes);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})
