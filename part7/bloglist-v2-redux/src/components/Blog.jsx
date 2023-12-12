import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { updateBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
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
    setLikes(blogObj.likes)
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blogContent">
        <p>
          {blog.title} by: {blog.author}
        </p>
        <a href={blog.url}>{blog.url}</a>
        <p id="likes">
          Likes: {blog.likes}
          <button id="likeButton" onClick={() => handleLikes(blog)}>
            like
          </button>
        </p>
        <p>added by {blog.user.username}</p>
      </div>
    </div>
  )
}

export default Blog
