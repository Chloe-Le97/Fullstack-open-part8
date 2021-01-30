import React, {useState} from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';
import { USER, ALL_BOOKS  } from '../queries/queries'

const RecomendBooks = (props) => {

  const user = useQuery(USER,{
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  const books = useQuery(ALL_BOOKS,{
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }

  if (user.loading)  {
    return <div>loading...</div>
  }
  if (books.loading)  {
   return <div>loading...</div>
 }

  let filter = user.data.me.favoriteGenre
  let filterBook = books.data.allBooks.filter(book => book.genres.includes(filter))
  

  return (
    <div>
      <h2>Books</h2>
      Books in your favorite genres: <strong>{filter}</strong> 
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
          {filterBook.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecomendBooks