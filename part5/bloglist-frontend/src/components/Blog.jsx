import { useState } from "react"

const Blog = ({ blog, handleLikes, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  const deleteButton = blog.user.username === user.username ? true : false

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible} className="title">
        {blog.title} by: {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="blogContent">
        <p>{blog.title} by: {blog.author}<button onClick={toggleVisibility}>hide</button></p>
        <p>{blog.url}</p>
        <p id="likes">Likes: {blog.likes}<button id="likeButton" onClick={() => handleLikes(blog)}>like</button></p>
        <p>{blog.user.username}</p>
        {deleteButton && <button onClick={() => handleRemove(blog)}>delete</button>}
      </div>
    </div>
  )
}

export default Blog