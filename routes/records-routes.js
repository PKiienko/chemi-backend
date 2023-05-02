const express = require('express');
const { check } = require('express-validator');

const recordsControllers = require('../controllers/records-controller');

const router = express.Router();

router.get('/:rid', recordsControllers.getRecordById);

router.get('/worker/:wid', recordsControllers.getRecordsByUserId);

router.post(
  '/',
  [
    check('name').not().isEmpty(),
    check('quantity').isNumeric(),
    check('prodObject').isLength({ min: 5 }),
    check('worker').not().isEmpty(),
    check('date').isISO8601(),
  ],
  recordsControllers.createRecord
);

router.patch(
  '/:rid',
  [
    check('name').not().isEmpty(),
    check('quantity').isNumeric(),
    check('prodObject').isLength({ min: 5 }),
    check('worker').not().isEmpty(),
    check('date').isISO8601(),
  ],
  recordsControllers.updateRecord
);

router.delete('/:rid', recordsControllers.deleteRecord);

module.exports = router;
