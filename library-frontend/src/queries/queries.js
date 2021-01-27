import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
    }
    published
    genres
    id
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title,
      published,
      author{name},
      genres
    }
  }
`;

export const ALL_AUTHORS = gql`
  query  {
    allAuthors  {
      name
      born
    }
  }
`

export const ALL_BOOKS = gql`
  query  {
    allBooks  {
      title
      published
      author{name,born}
      genres
    }
  }
`


export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year)  {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const USER = gql`
  query{
    me{
      username
      favoriteGenre
    }}
`
