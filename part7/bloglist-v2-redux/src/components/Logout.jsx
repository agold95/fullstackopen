import { Button } from "react-bootstrap"

const Logout = ({ username, handleLogout }) => {
  return (
    <Button onClick={handleLogout}>logout</Button>
  )
}

export default Logout