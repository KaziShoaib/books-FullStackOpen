import { useState, useEffect } from 'react'
import { useSubscription, useApolloClient, useQuery } from '@apollo/client'
import {BrowserRouter as Router, Link, Routes, Route, Navigate} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import Notification from './components/Notification'

import { BOOK_ADDED, ALL_BOOKS } from './queries'


const App = () => {
  const result = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [userdata, setUserdata] = useState(null)
  //const result = useQuery(ME)
  //const [getCurrentUser, {called, loading, data}] = useLazyQuery(ME)
  const client = useApolloClient()

  useEffect(()=>{
    const savedToken = localStorage.getItem('library-user-token')
    if(savedToken){
      setToken(savedToken)      
    }
  }, [])  
  
  //console.log(token)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({subscriptionData}) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} was added`)
      client.cache.updateQuery({query: ALL_BOOKS}, ({allBooks})=>{
        return {
          allBooks: allBooks.map(book => book.title).includes(addedBook.title) ? allBooks : allBooks.concat(addedBook)
        }
      })
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(()=>{setErrorMessage(null)}, 2000)
  }

 
  const padding = {padding: 5}
  return (
    <div>
      <Router>
        <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
          <Container>
          <Navbar.Brand href="#" as='span'>
            <Link className='text-reset text-decoration-none' style={padding} to="/">Home</Link>
          </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav>
                <Nav.Link href="#" as="span">
                  <Link className='text-reset text-decoration-none' style={padding} to="/authors">Authors</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                  <Link className='text-reset text-decoration-none' style={padding} to="/books">Books</Link>
                </Nav.Link>
                <Nav.Link href="#" as="span">
                { 
                  token ? 
                  <Link className='text-reset text-decoration-none' style={padding} to="/add">Add Book</Link>:
                  null                  
                }
                </Nav.Link>                               
              </Nav>
              <Nav className='ms-auto'>
                <Nav.Link href="#" as="span">
                {
                  token ? 
                  <span>
                    { userdata ? 
                    <span className='mx-5 fst-italic'>Welcome, {userdata.username}</span> : null 
                    }
                    <Link className='text-reset text-decoration-none' style={padding} to="/logout">Logout</Link>
                  </span>                                    
                  :
                  <Link className='text-reset text-decoration-none ' style={padding} to="/login">Login</Link>
                }
                </Nav.Link> 
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Notification errorMessage={errorMessage}/>
        <Routes>
          <Route 
            path='/'
            element= {<Home/>}
          />
          <Route 
            path='/authors' 
            element={ <Authors setError={notify} token={token} result={result}/> }
          />
          <Route 
            path='/books' 
            element={ <Books userdata={userdata} result={result}/> }
          />           
          <Route 
            path='/add' 
            element={ token ? 
                      <NewBook setError={notify}/> :  
                      <Navigate replace to='/login'/>
                    }
          /> 
          <Route 
            path='/login'
            element = { !token ?
                        <LoginForm setToken={setToken} setError={notify} setUserdata={setUserdata}/>:
                        <Navigate replace to='/'/>
                      }
          />
          <Route 
            path='/logout'
            element = {
                        token ?
                        <Logout setToken={setToken} setUserdata={setUserdata}/>:
                        <Navigate replace to='/'/>
                      }
          />        
        </Routes>
      </Router>
                  
    </div>
  )
}

export default App
