const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
    {
        username: 'Username1',
        name: 'User 1',
        password: '1111'
    },
    {
        username: 'Username2',
        name: 'User 2',
        password: '2222'
    },
    {
        username: 'Username3',
        name: 'User 3',
        password: '3333'
    }
]

const initialBlogs = [
    {
        title: 'First blog on test DB',
        author: 'Frank Columbo',
        url: 'url blah blah',
        likes: 2
    },
    {
        title: 'Second blog on test DB',
        author: 'Jessica Walter',
        url: 'urlurlurl',
        likes: 3
    },
    {
        title: 'Third blog on test DB',
        author: 'Mel Brooks',
        url: 'stuff',
        likes: 0
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialUsers, initialBlogs, nonExistingId, blogsInDb, usersInDb
}