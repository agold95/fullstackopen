import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        title:
        <input id='title' value={title} onChange={({ target }) => setTitle(target.value)} />
        <br />
        author:
        <input id='author' value={author} onChange={({ target }) => setAuthor(target.value)} />
        <br />
        url:
        <input id='url' value={url} onChange={({ target }) => setUrl(target.value)} />
        <br />
        <button id="createBlog" type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm