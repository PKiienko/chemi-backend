const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recordsRoutes = require('./routes/records-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/records', recordsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured' });
});

app.use(bodyParser.json());

mongoose
  .connect(
    'mongodb+srv://petrokiienko:qsLVKmpkx3gDAUiQ@cluster0.xgcnj40.mongodb.net/chemi?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
