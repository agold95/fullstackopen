import { Button } from "react-bootstrap"

const BlogForm = ({ newBlog, setNewBlog, createNewBlog }) => {

  const handleNewBlog = async (event) => {
    event.preventDefault()
    createNewBlog(newBlog)
    event.target.reset()
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleNewBlog}>
        title:
        <input
          id="title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
        <br />
        author:
        <input
          id="author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
        <br />
        url:
        <input
          id="url"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        />
        <br />
        <Button id="createBlog" type="submit">
          save
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
