const Users = ({ users }) => {
  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{ user.blogs.length }</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users