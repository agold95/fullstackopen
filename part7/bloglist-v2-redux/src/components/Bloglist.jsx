import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { notify } from '../reducers/notificationReducer'
import { removeBlog, createBlog, updateBlog } from '../reducers/blogReducer'

import Blog from './Blog'
import Togglable from './Toggleable'
import BlogForm from './BlogForm'

const BlogList = ({ blogs }) => {
  const user = useSelector(state => state.user)

  const [newBlog, setNewBlog] = useState({
    title: null,
    author: null,
    url: null
  })

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const createNewBlog = async (newBlog) => {
    try {
      dispatch(createBlog(newBlog))
      setNewBlog({
        title: null,
        author: null,
        url: null
      })
      dispatch(notify(`a new blog '${newBlog.title}' by ${newBlog.author} added`, 5))
    } catch (error) {
      dispatch(notify(error.message))
    }
  }

  const dispatchLike = async (id, blog) => {
    try {
      dispatch(updateBlog(id, blog))
      dispatch(notify(`blog '${blog.title}' liked`, 5))
    } catch (error) {
      dispatch(notify(error.message))
    }
  }

  const handleLikes = (blog) => {
    const blogObj = {
      ...blog,
      likes: blog.likes + 1
    }
    dispatchLike(blog.id, blogObj)
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id))
      dispatch(notify(`blog '${blog.title}' removed`, 5))
    }
  }

  return (
    <div>
      {!user ? (
        <></>
      ) :
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm newBlog={newBlog} setNewBlog={setNewBlog} createNewBlog={createNewBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleLikes={handleLikes}
              handleRemove={handleRemove}
              user={user}
            />
          )}
        </div>
      }
    </div>
  )
}

export default BlogList