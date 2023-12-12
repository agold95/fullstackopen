import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <h3>added blogs</h3>
      <div>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{ blog.title }</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default User