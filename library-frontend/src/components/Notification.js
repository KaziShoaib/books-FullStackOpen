import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'

const Notification = ({errorMessage}) => {
  if(!errorMessage)
      return null
  return (
    <div>
      <Container>
        <Alert variant='danger' className='text-center my-3 text-uppercase fw-bolder'>{errorMessage}</Alert>
      </Container>
    </div>
  )  
}

export default Notification