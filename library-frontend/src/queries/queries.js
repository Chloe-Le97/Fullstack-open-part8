import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    id
    title
    author {
      name
    }
    published
    genres
  }
`;

export const CREATE_BOOK = gql`
  mutation addBook(
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
      id
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
      id
      title
      published
      author{name,born}
      genres
    }
  }
`
export const FIND_BOOK = gql`
  query allBooks($nameToSearch: String!) {
    allBooks(genres: $nameToSearch) {
      id
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
export const BOOK_ADDED = gql`
  subscription{bookAdded
    {      
  ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

// export const BOOK_ADDED = gql`
//   subscription{bookAdded{id,title,author{name},genres}}
// `