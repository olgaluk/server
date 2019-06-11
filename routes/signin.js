const express = require('express');

const router = express.Router();

router.post('/',
  (req, res) => {
    res.status(202).send(req.user);
  });

module.exports = router;
