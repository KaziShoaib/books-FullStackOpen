import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container"
import InputGroup from "react-bootstrap/InputGroup"

///import { ALL_AUTHORS, ALL_BOOKS, NEW_BOOK } from '../queries'
import { ALL_BOOKS, NEW_BOOK } from '../queries'

const NewBook = ({setError}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [newBook, result] = useMutation(NEW_BOOK, {
    //refetchQueries: [ {query: ALL_AUTHORS} ],
    onError: (error) => setError(error.graphQLErrors[0].message),
    update: (cache, response) => {
      const addedBook = response.data.addBook
      cache.updateQuery({query: ALL_BOOKS}, ({allBooks})=>{
        return {
          allBooks: allBooks.map(book => book.title).includes(addedBook.title) ? allBooks : allBooks.concat(addedBook)
        }
      })
    }
  })
  const navigate = useNavigate()
  
  useEffect(()=>{
    if(result.data){
      navigate('/books')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    if(!document.getElementById('genre-list').innerText.length){
      setError('must add genre')
      return false
    }

    console.log('add book...')
    
    newBook({variables: {title, author, published, genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <Container>
        <h2 className="mt-3">Add a New Book</h2>
        <Form onSubmit={submit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Title of the book</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="book title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              required
            />            
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name of the author</Form.Label>
            <Form.Control 
              placeholder="author name"
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Year of publication</Form.Label>
            <Form.Control 
              placeholder="year"
              type="number"
              value={published}
              onChange={({ target }) => setPublished(parseInt(target.value))}
              required 
            />
          </Form.Group>
          <Form.Label>
            Book Genres
          </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="type a genre"
              type='text'
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <Button variant="outline-secondary" onClick={addGenre}>
              Add Genre
            </Button>            
          </InputGroup>
          <Form.Group className='mb-3'>
            <Form.Label>
              <span className='text-secondary'>Genres: </span>
              <span id='genre-list' className='fst-italic'>
                {genres.join(', ')}
              </span>
            </Form.Label>
          </Form.Group>                
          <Button variant="primary" type="submit">
            Add Book
          </Button>
        </Form>
      </Container>      
    </div>
  )
}

export default NewBook
