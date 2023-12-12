import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { notify } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

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

  /*
  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id))
      dispatch(notify(`blog '${blog.title}' removed`, 5))
    }
  }
  */

  return (
    <div>
      {!user ? (
        <></>
      ) :
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm newBlog={newBlog} setNewBlog={setNewBlog} createNewBlog={createNewBlog} />
          </Togglable>
          <table>
            <tbody>
              {blogs.map(blog =>
                <tr key={blog.id}>
                  <td>
                    <Link to={`/blogs/${blog.id}`}>{ blog.title }</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

export default BlogList