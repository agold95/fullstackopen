import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, Navigate, useMatch } from 'react-router-dom'

import { initilizeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogList from './components/Bloglist'
import Blog from './components/Blog'
import Logout from './components/Logout'
import User from './components/User'
import Users from './components/Users'

import blogService from './services/blogs'

import { Button } from 'react-bootstrap'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  const [loginVisible, setLoginVisible] = useState(false)

  const dispatch = useDispatch()

  const matchedUser = useMatch('/users/:id')
  const selectedUser = matchedUser
    ? users.find(user => user.id === matchedUser.params.id)
    : null

  const matchedBlog = useMatch('/blogs/:id')
  const blog = matchedBlog
    ? blogs.find(blog => blog.id === matchedBlog.params.id)
    : null

  useEffect(() => {
    dispatch(initilizeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
    dispatch(initializeUsers())
  }, [dispatch])

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <Button onClick={() => setLoginVisible(true)}>log in</Button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm />
          <Button onClick={() => setLoginVisible(false)}>cancel</Button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <div className='navbar'>
        <p className='navbar-item'><Link to="/">Blogs</Link></p>
        <p className='navbar-item'><Link to="/users">Users</Link></p>
        <p className='navbar-item'>{user.name} logged in</p>
        <p className='navbar-item'><Logout username={user.name} handleLogout={handleLogout} /></p>
      </div>
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
        <Route path="/login/" element={user ? <Navigate replace to="/" /> : loginForm()} />
      </Routes>
    </div>
  )
}

export default App
