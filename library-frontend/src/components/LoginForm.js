import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries"

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container"

const LoginForm = ({setToken, setError, setUserdata}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => setError(error.graphQLErrors[0].message)
  })

  useEffect(()=>{
    if(result.data){
      const token = result.data.login.value
      setToken(token)
      setUserdata({
        username: result.data.login.username,
        favouriteGenre: result.data.login.favouriteGenre
      })
      localStorage.setItem('library-user-token', token)
      // console.log('$$$')
      // console.log(localStorage.getItem('library-user-token'))
      // getCurrentUser().then(output => console.log(output))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[result.data])

  const submit = async (event) => {
    event.preventDefault()
    await login({variables: {username, password}})    
  }

  return (
    <div>
      <Container>
        <h2 className="mt-3">Log In</h2>
        <Form onSubmit={submit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="type username"
              value={username} 
              onChange={(event)=>setUsername(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              
              placeholder="Password"
              value={password}
              type="password"
              onChange={(event)=>setPassword(event.target.value)}
              required 
            />
          </Form.Group>        
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  )
}

export default LoginForm