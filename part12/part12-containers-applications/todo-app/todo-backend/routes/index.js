const express = require('express');
const router = express.Router();
const redis = require('../redis');
const { getAsync, setAsync } = require('../redis');
const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET todos statistics */
router.get('/statistics', async (_, res) => {
  const count = await getAsync('count');

  return res.json({ added_todos: count || '0'});
})

module.exports = router;
