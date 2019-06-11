/* eslint-disable no-console */
const Inspection = require('../db/models/Inspection.js');

exports.inspection_create_post = (req, res) => {
  const createInspection = inspectionData => new Inspection(inspectionData).save();
  createInspection(req.body)
    .then(() => {
      console.log('Inspection created');
      res.status(201).send('Created');
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(406).send('Not Acceptable');
      } else {
        res.status(501).send('Not Implemented');
      }
    });
};
