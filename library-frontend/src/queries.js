import { gql } from "@apollo/client"

const BOOK_DETAILS = gql `
  fragment BookDetails on Book {
    id
    title
    published
    genres
    author {
      id
      name
      born
      bookCount
    }
  }
`

const AUTHOR_DETAILS = gql `
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`

export const ALL_AUTHORS = gql `
  query{
    allAuthors{
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql `
  query{
    allBooks{
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ME = gql `
  query{
    me{
      username
      id
      favouriteGenre
    }
  }
`

export const NEW_BOOK = gql `
  mutation newBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ){
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const SET_BIRTHYEAR = gql `
  mutation setBirthyear($name: String!, $born: Int!){
    editAuthor(
      name: $name
      setBornTo: $born
    ){
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const LOGIN = gql `
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      value
      username
      favouriteGenre
    }
  }
`

export const BOOK_ADDED = gql `
  subscription {
    bookAdded{
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
