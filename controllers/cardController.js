/* eslint-disable no-console */
const Card = require('../db/models/Card');

// Handle card create on POST
exports.card_create_post = (req, res) => {
  console.log(req.body);
  const {
    vendorId,
    operatorName,
    date,
    costCard,
    quantity,
    serialNumber,
  } = req.body;
  const createCard = cardData => new Card(cardData).save();
  for (let i = 0; i < quantity; i += 1) {
    const twoPartSerialNumber = serialNumber.split('_');
    const number = parseInt(twoPartSerialNumber[0], 10) + i;
    const card = {
      operatorName,
      date,
      vendorId,
      serialNumber: `${number}_${twoPartSerialNumber[1]}`,
      costCard,
    };
    createCard(card)
      .then(() => {
        console.log('Cards created');
      })
      .catch((err) => {
        console.log(err);
        res.status(501).send('Not Implemented');
      });
  }
  res.status(201).send('Created');
};

exports.card_last_number_get = (req, res) => {
  console.log(req.query, 'req.query');
  const { vendorId, licenseNumber } = req.query;
  Card
    .find({ vendorId }, 'serialNumber _vendorId')
    .populate('vendorId')
    .then((result) => {
      const vendorCards = result;
      console.log(result);
      if (result.length === 0) {
        res.status(201).send(`1_${licenseNumber}`);
      } else {
        const lastSerialNumberCard = vendorCards.map(item => parseInt(item.serialNumber.split('_'), 10)).sort((a, b) => b - a)[0];
        console.log(lastSerialNumberCard);
        res.status(201).send(`${lastSerialNumberCard + 1}_${licenseNumber}`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(501).send('Not Implemented');
    });
};

exports.card_find_by_number_post = (req, res, next) => {
  console.log(req.body);
  const { serialNumber } = req.body;
  Card
    .find({ serialNumber })
    .then((result) => {
      if (result.length === 0) {
        res.status(412).send('Precondition Failed');
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(501).send('Not Implemented');
    });
};
