const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id || !token) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }

  const blog = await new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  }).populate('user', { username: 1, name: 1 })


  if (!body.title || !body.url) {
    response.status(400).json()
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token
  const user = request.user
  const id = request.params.id

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id || !token) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }

  const blog = await Blog.findById(id)

  if (!user) {
    response.status(400).json({ error: 'User does not exist' })
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'Unauthorized'})
  }

  /*
  if (user._id.toString() !== blog.user.id.toString()) {
    return response.status(401).json({ error: 'Unauthorized', user: user._id, blogUser: blog.user.id })
  }
  */

})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter