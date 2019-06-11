/* eslint-disable no-console */
const Call = require('../db/models/Call');
const Flag = require('../db/models/Flag');
const Card = require('../db/models/Card');
const Vendor = require('../db/models/Vendor.js');

// Handle call create on POST
exports.call_create_post = (req, res, next) => {
  console.log(req.body);
  const { serialNumber, operatorName, idCaller } = req.body;
  Card.find({ serialNumber }, 'vendorId')
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        res.status(412).send('Precondition Failed');
      }
      const [{ vendorId }] = result;
      const createCall = callData => new Call(callData).save();
      return createCall({
        serialNumber,
        operatorName,
        idCaller,
        vendorId,
      });
    })
    .then((result) => {
      console.log('Call created');
      console.log(result);
      const { vendorId } = result;
      const newFlag = new Flag({
        vendorId,
      });
      return newFlag.save();
    })
    .then((result) => {
      console.log(result);
      const { vendorId } = result;
      Call.find({ vendorId }).distinct('serialNumber').exec((err, res3) => {
        console.log(res3);
        if (res3.length >= 3) {
          next();
        } else {
          res.status(201).send('Created');
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(501).send('Not Implemented');
    });
};

exports.call_find_caller = (req, res, next) => {
  console.log(req.body);
  const { serialNumber } = req.body;
  Card.find({ serialNumber }, 'vendorId')
    .then((result) => {
      console.log(result);
      const [{ vendorId }] = result;
      return Call.find({ vendorId }).distinct('idCaller');
    })
    .then((res1) => {
      console.log(res1);
      if (res1.length >= 3) {
        next();
      } else {
        res.status(201).send('Created');
      }
    });
};

exports.call_create_flag = (req, res) => {
  console.log(req.body);
  const { serialNumber } = req.body;
  Card.find({ serialNumber }, 'vendorId')
    .then((result) => {
      console.log(result);
      const [{ vendorId }] = result;
      return Vendor.updateOne({ _id: vendorId }, { $set: { flag: 'redflagged' } });
    })
    .then((res2) => {
      console.log(res2);
      res.status(201).send('Created');
    })
    .catch((err) => {
      console.log(err);
      res.status(501).send('Not Implemented');
    });
};
