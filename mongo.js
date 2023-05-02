const MongoClient = require('mongodb').MongoClient;

const url =
  'mongodb+srv://petrokiienko:qsLVKmpkx3gDAUiQ@cluster0.xgcnj40.mongodb.net/records_test?retryWrites=true&w=majority';

const createRecord = async (req, res, next) => {
  const newRecord = {
    name: req.body.name,
    quantity: req.body.quantity,
    prodObject: req.body.prodObject,
    worker: req.body.worker,
  };
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = db.collection('records').insertOne(newRecord);
  } catch (error) {
    return res.json({ message: 'Could not store data.' });
  }
  //client.close();

  res.json(newRecord);
};

const getRecords = async (req, res, next) => {
  const client = new MongoClient(url);

  let records;

  try {
    await client.connect();
    const db = client.db();
    records = await db.collection('records').find().toArray();
  } catch (error) {
    return res.json({ message: 'Could not get records' });
  }
  //client.close();

  res.json(records);
};

exports.createRecord = createRecord;
exports.getRecords = getRecords;
