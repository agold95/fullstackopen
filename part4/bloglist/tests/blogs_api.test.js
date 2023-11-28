const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const userPromise = userObjects.map(user => user.save())
    await Promise.all(userPromise)

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const blogPromise = blogObjects.map(blog => blog.save())
    await Promise.all(blogPromise)
})

test('all blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)
})

test('blog\'s unique identifier is defined', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a blog can be added', async () => {
    const newBlog = {
        title: 'A new blog',
        author: 'A.T.',
        url: 'blahblah',
        likes: 0
    }

    const user = await api
        .post('/api/users')
        .send({ username: 'user', password: '12345' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const token = await api
        .post('/api/login')
        .send({ username: user.body.username, password: '12345' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `Bearer ${token.body.token}`, Accept: 'application/json' })
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('if likes property is missing it defaults to 0', async () => {
    const newBlog = {
        title: 'A blog with no likes',
        author: 'A.T.',
        url: 'blahblah'
    }

    const user = await api
        .post('/api/users')
        .send({ username: 'user', password: '12345' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const token = await api
        .post('/api/login')
        .send({ username: user.body.username, password: '12345' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `Bearer ${token.body.token}`, Accept: 'application/json' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    expect(savedBlog.body.likes).toBeDefined()
})

test('if title or url properties are missing, returns 400 error', async () => {
    const newBlog = {
        author: 'A.T.',
        likes: 4
    }

    const user = await api
        .post('/api/users')
        .send({ username: 'user', password: '12345' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const token = await api
        .post('/api/login')
        .send({ username: user.body.username, password: '12345' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ 'Authorization': `Bearer ${token.body.token}`, Accept: 'application/json' })
        .expect(400)
})

test('a blog cannot be deleted if no token is provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).toContain(blogToDelete.title)
})

test('a blog will be deleted if the user created it', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const user = await api
        .post('/api/users')
        .send({ username: 'user', password: '12345' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const token = await api
        .post('/api/login')
        .send({ username: user.body.username, password: '12345' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const createdBlog = await api
        .post('/api/blogs')
        .send({ title: 'blog to delete', author: 'deleter', url: 'blah', likes: 1 })
        .set({ 'Authorization': `Bearer ${token.body.token}`, Accept: 'application/json' })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogToDelete = createdBlog.body

    blogsAfterAdded = await helper.blogsInDb()
    expect(blogsAfterAdded).toHaveLength(blogsAtStart.length + 1)

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ 'Authorization': `Bearer ${token.body.token}`, Accept: 'application/json' })
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updateContent = {
        title: "Updated title",
        author: "updated author",
        url: "updated url",
        likes: blogToUpdate.likes
    }

    const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updateContent)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    expect(updatedBlog.body).toEqual({
        title: "Updated title",
        author: "updated author",
        url: "updated url",
        likes: blogToUpdate.likes,
        id: blogToUpdate.id
    })
    expect(updatedBlog.body).not.toBe(blogToUpdate)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'firstuser', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'firstuser',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
    
    test('username must be at least 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'a',
        name: 'b',
        password: 'abcdefg',
    }
        
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('username or password must be longer than 3 characters')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('password must be at least 3 characters long', async () => {
        const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'abcdefg',
        name: 'b',
        password: 'h',
    }
        
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('username or password must be longer than 3 characters')
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})