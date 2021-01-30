import React, {useState, useEffect} from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';
import {useApolloClient} from '@apollo/client';
import { ALL_BOOKS, ALL_AUTHORS } from '../queries/queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS,{
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })
  const [genre, setGenre] = useState("all")
  const [genres, setGenres] = useState(["all"])
  
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }
  const books = result.data.allBooks

  books.map(book=>{
    book.genres.map(i=>{
      if(genres.includes(i)){return}
      else {setGenres(genres.concat(i)) }
    })
  })

  let booksToDisplay

  if(genre=="all"){
    booksToDisplay = books
  }
  else{
    booksToDisplay = books.filter((book) =>book.genres.includes(genre)) 
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToDisplay.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(i=>
            <button onClick={() => setGenre(i)}>{i}</button>
          )}
      </div>
    </div>
  )
}

export default Books