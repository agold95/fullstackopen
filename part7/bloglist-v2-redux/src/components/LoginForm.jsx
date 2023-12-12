import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { setUser } from '../reducers/userReducer'
import { notify } from '../reducers/notificationReducer'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(newUser))
      blogService.setToken(newUser.token)
      dispatch(setUser(newUser))
      setUsername('')
      setPassword('')
      dispatch(notify(`${newUser.name} logged in`, 5))
    } catch (exception) {
      setUsername('')
      setPassword('')
      dispatch(notify('wrong username or password', 5))
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button id="login-button" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
