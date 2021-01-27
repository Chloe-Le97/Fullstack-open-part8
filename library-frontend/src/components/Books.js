import React, {useState} from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';
import { ALL_BOOKS } from '../queries/queries'

const Books = (props) => {

  const [filter,setFilter] = useState('all')

  const books = useQuery(ALL_BOOKS,{
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  

  if (!props.show) {
    return null
  }


  if (books.loading)  {
   return <div>loading...</div>
 }

 let filterBook = []

  if(filter=='all'){
    filterBook = books.data.allBooks
  }
  else{
   filterBook = books.data.allBooks.filter(book => book.genres.includes(filter))
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {console.log(filterBook)}
          {filterBook.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button onClick={()=>setFilter('refactoring')}>Refactoring</button>
        <button onClick={()=>setFilter('agile')}>Agile</button>
        <button onClick={()=>setFilter('patterns')}>Patterns</button>
        <button onClick={()=>setFilter('design')}>Design</button>
        <button onClick={()=>setFilter('crime')}>Crime</button>
        <button onClick={()=>setFilter('classic')}>Classic</button>
        <button onClick={()=>setFilter('all')}>All</button>
      </div>
    </div>
  )
}

export default Books