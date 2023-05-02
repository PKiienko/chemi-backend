const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Record = require('../models/record');

const getRecordById = async (req, res, next) => {
  const recordId = req.params.rid;

  let record;
  try {
    record = await Record.findById(recordId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a record.', 500);
    return next(error);
  }

  if (!record) {
    const error = new HttpError('Could not find a record for the provided id.', 404);
    return next(error);
  }

  res.json({ record: record.toObject({ getters: true }) });
};

const getRecordsByUserId = async (req, res, next) => {
  const workerId = req.params.wid;

  let records;
  try {
    records = await Record.find({ worker: workerId });
  } catch (err) {
    const error = new HttpError('Fetching records failed, please try again', 500);
    return next(error);
  }

  if (!records || records.length === 0) {
    return next(new HttpError('Could not find records for the provided worker id.', 404));
  }
  res.json({ records: records.map((record) => record.toObject({ getters: true })) });
};

const createRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid data in inputs, check again', 422);
  }

  const { name, quantity, prodObject, worker, date } = req.body;

  const createdRecord = new Record({
    name,
    quantity,
    prodObject,
    worker,
    date,
  });

  try {
    await createdRecord.save();
  } catch (err) {
    const error = new HttpError('Creating record failed', 500);
    return next(error);
  }

  res.status(201).json({ record: createdRecord });
};

const updateRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid data in inputs, check again', 422));
  }

  const { name, quantity, prodObject, worker, date } = req.body;
  const recordId = req.params.rid;

  let record;
  try {
    record = await Record.findById(recordId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update record', 500);
    return next(error);
  }

  record.name = name;
  record.quantity = quantity;
  record.prodObject = prodObject;
  record.worker = worker;
  record.date = date;

  try {
    await record.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update the record.', 500);
    return next(error);
  }

  res.status(200).json({ record: record.toObject({ getters: true }) });
};

const deleteRecord = async (req, res, next) => {
  const recordId = req.params.rid;

  let record;
  try {
    record = await Record.findById(recordId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete the record.', 500);
    return next(error);
  }

  try {
    await record.deleteOne();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete the record.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Deleted record.' });
};

exports.getRecordById = getRecordById;
exports.getRecordsByUserId = getRecordsByUserId;
exports.createRecord = createRecord;
exports.updateRecord = updateRecord;
exports.deleteRecord = deleteRecord;
