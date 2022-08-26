import { useState } from "react"
import { useMutation } from "@apollo/client"
//import Select from "react-select"

import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { SET_BIRTHYEAR } from "../queries"

const EditAuthor = ({authorNames, setError}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [setBirtyear] = useMutation(SET_BIRTHYEAR, {
    onError: (error) => setError(error.graphQLErrors[0].message)
  })

  // const options = authorNames.map((authorName) => {        
  //   return {value: authorName, label: authorName}
  // })
  
  const submit = async (event) => {
    event.preventDefault()
    // if(!name){
    //   alert('name cannot be blank')
    //   return false
    // }
    setBirtyear({ variables: {name, born} })
    setName('')
    setBorn('')
  }
  

  return(
    <div>      
      <Container>
        <hr />
        <h2 className="mt-3">Set Year of Birth</h2>
        <Form onSubmit={submit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Select Author</Form.Label>
            <Form.Select 
              value={name} 
              onChange={event => setName(event.target.value)}
              required
            >
              <option value=''>-- Select Author --</option>
              {authorNames.map(n => <option key={n} value={n}>{n}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Born in</Form.Label>
            <Form.Control               
              placeholder="born in"
              type="number"
              value={born} 
              onChange={(event)=>setBorn(parseInt(event.target.value))}
              required 
            />
          </Form.Group>        
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Container>
        {/* <div>
          name: <Select
                  id="author-name"                  
                  value={options.filter(option => option.value === name)}
                  onChange={(event) => {                    
                    setName(event.value)
                  }}
                  options={options}
                  
                />
        </div> */}
    </div>
  )
}

export default EditAuthor