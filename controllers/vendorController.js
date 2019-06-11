/* eslint-disable no-console */
const Vendor = require('../db/models/Vendor.js');

// Handle vendor create on POST
exports.vendor_create_post = (req, res) => {
  const createVendor = vendorData => new Vendor(vendorData).save();
  createVendor(req.body)
    .then(() => {
      console.log('Vendor created');
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

// Get request for finding one Vendor
exports.vendor_find_get = (req, res, next) => {
  if (!req.query.vendorId) {
    const { licenseNumber } = req.query;
    Vendor.findOne({ licenseNumber })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(412).send('Precondition Failed');
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Internal Server Error');
      });
  } else next();
};

exports.info_city_get = (req, res) => {
  Vendor
    .find({}, 'location.city')
    .distinct('location.city')
    .then((result) => {
      console.log(result);
      const answer = { city: result };
      res.status(200).send(answer);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
};

exports.info_country_get = (req, res) => {
  Vendor
    .find({}, 'country')
    .distinct('country')
    .then((result) => {
      console.log(result);
      const answer = { country: result };
      res.status(200).send(answer);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
};

exports.vendors_find_post = (req, res) => {
  console.log(req.body);
  const {
    cities,
    countries,
    mode,
    groups,
    oss,
    flag,
    stars,
  } = req.body;
  const getCountryCondition = countryList => (
    countryList.length ? { country: { $in: countryList } } : {}
  );
  const getCityCondition = cityList => (
    cityList.length ? { 'location.city': { $in: cityList } } : {}
  );
  const getGroupCondition = groupList => (
    groupList.length ? { foodGroup: { $in: groupList } } : {}
  );
  const getOssCondition = ossValue => (
    ossValue.length ? { oss: { $eq: ossValue } } : {}
  );
  const getFlagCondition = (flagValue) => {
    let condition = {};
    if (flagValue === 'Y') {
      condition = { flag: { $eq: 'redflagged' } };
    }
    if (flagValue === 'N') {
      condition = { flag: { $ne: 'redflagged' } };
    }
    return condition;
  };

  const getStarCondition = starValue => (
    starValue.length ? { stars: { $eq: starValue } } : {}
  );

  const getModeCondition = (modeValue) => {
    let condition = {};
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getDay()];

    if (modeValue === 'Open') {
      condition = {
        $or: [
          {
            $and: [
              { 'schedule.from.hours': { $lt: hour.toString() } },
              { 'schedule.to.hours': { $gt: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $lt: hour.toString() } },
              { 'schedule.to.hours': { $eq: hour.toString() } },
              { 'schedule.to.minutes': { $gte: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $eq: hour.toString() } },
              { 'schedule.from.minutes': { $lte: minute.toString() } },
              { 'schedule.to.hours': { $gt: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $eq: hour.toString() } },
              { 'schedule.from.minutes': { $lte: minute.toString() } },
              { 'schedule.to.hours': { $eq: hour.toString() } },
              { 'schedule.to.minutes': { $gte: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
        ],
      };
    }
    if (modeValue === 'Closed') {
      condition = {
        $nor: [
          {
            $and: [
              { 'schedule.from.hours': { $lt: hour.toString() } },
              { 'schedule.to.hours': { $gt: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $lt: hour.toString() } },
              { 'schedule.to.hours': { $eq: hour.toString() } },
              { 'schedule.to.minutes': { $gte: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $eq: hour.toString() } },
              { 'schedule.from.minutes': { $lte: minute.toString() } },
              { 'schedule.to.hours': { $gt: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
          {
            $and: [
              { 'schedule.from.hours': { $eq: hour.toString() } },
              { 'schedule.from.minutes': { $lte: minute.toString() } },
              { 'schedule.to.hours': { $eq: hour.toString() } },
              { 'schedule.to.minutes': { $gte: hour.toString() } },
              { 'schedule.day': { $eq: day } },
            ],
          },
        ],
      };
    }
    return condition;
  };

  Vendor
    .find(getCountryCondition(countries))
    .find(getCityCondition(cities))
    .find(getGroupCondition(groups))
    .find(getOssCondition(oss))
    .find(getFlagCondition(flag))
    .find(getStarCondition(stars))
    .find(getModeCondition(mode))
    .then((result) => {
      if (result.length) {
        console.log(result);
        res.status(200).send(result);
      } else {
        console.log(result);
        res.status(412).send('Precondition Failed');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
};
