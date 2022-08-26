/* eslint-disable jsx-a11y/anchor-is-valid */
//import { useQuery } from "@apollo/client"

import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'

//import { ALL_BOOKS } from "../queries"
import LoadingComponent from "./LoadingComponent"
import { useState } from "react"

const Books = ({userdata, result}) => {
  const [genreFilter, setGenreFilter] = useState('')
  //const result = useQuery(ALL_BOOKS)

  if(result.loading){
    return (
      <div>
        <Container>
          <div>
            <LoadingComponent />
          </div>          
        </Container>
      </div>
    )
  }

  //console.log(userdata)
  const books = result.data ? result.data.allBooks : []
  const genreSet = new Set()
  books.map(b => b.genres.map(g => genreSet.add(g.toLowerCase())))
  const booksFilteredByGenre = genreFilter ? books.filter(
    b => b.genres.map(g => g.toLowerCase()).includes(genreFilter)) : books
  

  return (
    <div>
      <Container>
      <h2 className="mt-3">BOOK LIST</h2>
        <div className="my-4">
          <h3>Filter By Genre</h3>
          <div>
            {Array.from(genreSet).map(genre => 
                <Badge 
                  key={genre}
                  bg='secondary' 
                  text="light" 
                  className="mx-1" onClick={() => setGenreFilter(genre)}>
                      <a 
                        href="#" 
                        className='text-reset text-decoration-none'
                      >
                        {genre}
                      </a>
                </Badge>
            )}
            <Badge 
              bg='info' 
              text="light" 
              className="mx-1" onClick={() => setGenreFilter('')}>
                <a 
                  href="#" 
                  className='text-reset text-decoration-none'
                >
                  All Genres
                </a>
            </Badge>
            {
              userdata ?
              <Badge 
                bg='success' 
                text="light" 
                className="mx-1" onClick={() => setGenreFilter(userdata.favouriteGenre)}>
                  <a 
                    href="#" 
                    className='text-reset text-decoration-none'
                  >
                    Recommended
                  </a>
              </Badge> : null
            }
          </div>
        </div>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {booksFilteredByGenre.map((b, index) => (
              <tr key={b.title}>
                <td>{index+1}</td>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>        
      </Container>      
    </div>
  )
}

export default Books
