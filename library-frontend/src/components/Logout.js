import { useApolloClient } from "@apollo/client"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"


const Logout = ({setToken, setUserdata}) => {
  const client = useApolloClient()
  
  const logout = () => {
    localStorage.clear()
    setToken(null)
    client.resetStore()
    setUserdata(null)
  }
  
  return (
    <div>
      <Container>
        <p className="text-center my-3">Click button to log out</p>       
        
        <Button className="d-block mx-auto my-3" variant="danger" size="sm" onClick={logout}>Log Out</Button>
        <img
              className="d-block mx-auto"
              src="https://emilyjanuary.files.wordpress.com/2013/09/my-top-ten-photo.jpg"
              alt="book covers"
              width="420"
              height="560"
            />
      </Container>
      
    </div>
  )
}

export default Logout