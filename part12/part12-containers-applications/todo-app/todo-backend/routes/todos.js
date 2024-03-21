const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');
const { getAsync, setAsync } = require('../redis');

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  // todo counter increase on each listing created
  const todoCounter = async () => {
    const count = await getAsync('count');
    return count ? setAsync('count', parseInt(count) + 1) : setAsync('count', 1);
  };

  todoCounter();
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo;
  if (todo) {
    return res.json(todo);
  }

  res.sendStatus(405)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = req.body;
  const updatedToDo = await Todo.findByIdAndUpdate(
    req.todo._id,
    { ...todo },
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (updatedToDo) {
    return res.json(updatedToDo);
  }

  res.sendStatus(405);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
