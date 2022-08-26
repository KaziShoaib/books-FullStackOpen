//import { useQuery } from "@apollo/client"

import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"

//import { ALL_AUTHORS } from "../queries"

import EditAuthor from "./EditAuthor"
import LoadingComponent from "./LoadingComponent"

const Authors = ({setError, token, result}) => {
  //const result = useQuery(ALL_AUTHORS)
  if(result.loading){
    return(
      <div>
        <Container>
          <LoadingComponent />
        </Container>
      </div>
    )
  }

  const books = result.data ? result.data.allBooks : []
  let ids = new Set()
  const authors = books.map(book => book.author).filter(author => {
    const authorID = author.id
    return (
      ids.has(authorID) ? false : ids.add(authorID)
    )
  })

  return (
    <div>
      <Container>
        <h2 className="mt-3">LIST OF AUTHORS</h2>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Born</th>
              <th>Books</th>
            </tr>
          </thead>
          <tbody>          
            {authors.map((a, index) => (
              <tr key={a.name}>
                <td>{index+1}</td>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>      
      {token ? 
        <EditAuthor 
          authorNames={authors.map(a => a.name)} 
          setError={setError}
        /> : null}      
    </div>
  )
}

export default Authors
