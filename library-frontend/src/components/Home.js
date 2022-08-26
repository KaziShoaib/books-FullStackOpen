import Container from 'react-bootstrap/Container'

const Home = () => {
  return (
    <div>
      <Container>
        <h2 className='text-center my-3'>Welcome to Library App</h2>
        
        <img
              className="d-block mx-auto"
              src="https://i.dailymail.co.uk/1s/2022/03/02/01/54828855-0-image-a-3_1646184600349.jpg"
              alt="book covers"
              width="900"
              height="600"
            />
        
      </Container>
    </div>
  )
}

export default Home