require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const v1Route = require('./Routes');
const { failResponse } = require('./utils/Helper');

const mongoUrl = process.env.DATABASE_URL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('database connected successfully');
  })
  .catch((error) => {
    console.log(
      'an error occured while connecting to the database',
      error.message
    );
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', v1Route);

app.get('/', (request, response) => {
  response.status(200).send(
    `
      <h1>Welcome to blog api</h1>
      <a href="/api/">Welcome route</a>
    `
  );
});

app.all('*', (request, response) => {
  return failResponse(response, 404, {
    message: 'specified route does not exist',
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
