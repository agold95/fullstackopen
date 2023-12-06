import { useState } from "react"
import { useDispatch } from "react-redux"
import { createBlog } from "../reducers/blogReducer";
import { notify } from "../reducers/notificationReducer"

const BlogForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addBlog = async (event) => {
    event.preventDefault()
    const blog = { title, author, url }
    dispatch(createBlog(blog))
    dispatch(notify(`a new blog '${blog.title}' by ${blog.author} added`, 5))
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        title:
        <input
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <br />
        author:
        <input
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br />
        url:
        <input
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <br />
        <button id="createBlog" type="submit">
          save
        </button>
      </form>
    </div>
  )
}

export default BlogForm
