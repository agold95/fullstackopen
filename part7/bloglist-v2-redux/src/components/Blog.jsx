import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { updateBlog, commentBlog } from '../reducers/blogReducer'

import { Button } from 'react-bootstrap'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

  const [likes, setLikes] = useState(blog.likes)
  const [comment, setComment] = useState('')

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

  const handleComment = async (event) => {
    try {
      event.preventDefault()
      dispatch(commentBlog(blog.id, comment))
      setComment('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blogContent">
        <h2>
          {blog.title} by: {blog.author}
        </h2>
        <a href={blog.url}>{blog.url}</a>
        <p id="likes">
          Likes: {blog.likes}
          <Button id="likeButton" onClick={() => handleLikes(blog)}>
            like
          </Button>
        </p>
        <p>added by {blog.user.username}</p>
      </div>
      <div>
        <h4>Comments</h4>
        <form onSubmit={handleComment}>
          <input
            type="text"
            name="comment"
            placeholder='comment'
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type='submit'>Add comment</Button>
        </form>
        <ul>
          {blog.comments.map((comment, blog) => {
            return <li key={blog}>{ comment }</li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default Blog
