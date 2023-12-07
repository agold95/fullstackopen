import { useState, useEffect, useRef } from "react"

import { useQuery, useMutation, useQueryClient } from "react-query"

import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/Toggleable"

import blogService from "./services/blogs"
import loginService from "./services/login"

import { useNotificationValue, useNotificationDispatch } from "./NotificationContext"

import { useLoginValue, useLoginDispatch } from "./LoginContext"

const App = () => {
  const queryClient = useQueryClient()

  const message = useNotificationValue()
  const setMessage = useNotificationDispatch()
  const user = useLoginValue()
  const setUser = useLoginDispatch()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginVisible, setLoginVisible] = useState(false);

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })

  const blogFormRef = useRef()

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  /*
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, []);
  */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser({ type: 'SET', data: loggedUserJSON })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser({ type: 'SET', data: user })
      setUsername("")
      setPassword("")
      setMessage({
        type: "SHOW",
        data: `${user.name} logged in`
      })
      setTimeout(() => {
        setMessage({type: "HIDE"})
      }, 5000)
    } catch (exception) {
      setUsername("")
      setPassword("")
      setMessage({
        type: "SHOW",
        data: 'wrong username or password'
      })
      setTimeout(() => {
        setMessage({type: "HIDE"})
      }, 5000)
    }
  };

  const handleLogout = () => {
    window.localStorage.clear()
    setUser({ type: 'REMOVE' })
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
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(blogObject)
    setMessage({
      type: "SHOW",
      data: `blog ${blogObject.title} created`
    })
    setTimeout(() => {
      setMessage({ type: "HIDE" })
    }, 5000)
  }

  const handleLikes = async (blog) => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 },
      {
        onSuccess: () => {
          setMessage({
            type: "SHOW",
            data: `blog '${blog.title}' voted`
          })
          setTimeout(() => {
            setMessage({ type: "HIDE" })
          }, 5000)
        }
      }
    )
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(blog.id)
      setMessage({
        type: "SHOW",
        data: `blog ${blog.title} removed`
      })
      setTimeout(() => {
        setMessage({ type: "HIDE" })
      }, 5000)
    }
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data.sort((a, b) => b.likes - a.likes)

  if (user === false) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        {loginForm()}
      </div>
    );
  }

  const mappedBlogs = blogs.map((blog) => (
    <Blog
      key={blog.id}
      blog={blog}
      handleLikes={handleLikes}
      handleRemove={handleRemove}
      user={user}
    />
  ));

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      {blogForm()}
      {mappedBlogs}
    </div>
  );
};

export default App;
