const mongoose = require('mongoose');

const Record = require('./models/record');
const { response } = require('express');

mongoose
  .connect(
    'mongodb+srv://petrokiienko:qsLVKmpkx3gDAUiQ@cluster0.xgcnj40.mongodb.net/records_test?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('Connected to db!');
  })
  .catch(() => {
    console.log('Failed to connect!');
  });

const createRecord = async (req, res, next) => {
  const createdRecord = new Record({
    name: req.body.name,
    quantity: req.body.quantity,
    prodObject: req.body.prodObject,
    worker: req.body.worker,
    date: req.body.date,
  });
  const result = await createdRecord.save();

  res.json(result);
};

const getRecords = async (req, res, next) => {
  const records = await Record.find().exec();
  res.json(records);
};

exports.createRecord = createRecord;
exports.getRecords = getRecords;
