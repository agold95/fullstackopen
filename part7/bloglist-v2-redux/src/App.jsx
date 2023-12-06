import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import { notify } from "./reducers/notificationReducer"
import { removeBlog, initilizeBlogs, updateBlog } from "./reducers/blogReducer"
import { setUser } from "./reducers/userReducer"

import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/Toggleable"

import blogService from "./services/blogs"
import loginService from "./services/login"

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initilizeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(newUser))
      blogService.setToken(newUser.token)
      dispatch(setUser(newUser))
      setUsername('')
      setPassword('')
      dispatch(notify(`${newUser.name} logged in`, 5))
    } catch (exception) {
      setUsername('')
      setPassword('')
      dispatch(notify('wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm />
    </Togglable>
  )

  const handleLikes = (blog) => {
    const blogObj = {
      ...blog,
      likes: blog.likes + 1
    }
    updateLikes(blog.id, blogObj)
  }

  const updateLikes = async (id, blog) => {
    dispatch(updateBlog(id, blog))
    dispatch(notify('blog liked', 5))
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id))
      dispatch(notify(`blog '${blog.title}' removed`, 5))
    }
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

  const mappedBlogs = blogs.map((blog) => (
    <Blog
      key={blog.id}
      blog={blog}
      handleLikes={handleLikes}
      handleRemove={handleRemove}
      user={user}
    />
  ))

  return (
    <div>
      <h2>Blogs</h2>
      <Notification/>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      {blogForm()}
      {mappedBlogs}
    </div>
  )
}

export default App
