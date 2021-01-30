import React, { useState,useEffect } from 'react'
import { gql, useMutation,useQuery } from '@apollo/client'

import {CREATE_BOOK,ALL_BOOKS,ALL_AUTHORS} from '../queries/queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [addNewBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    awaitRefetchQueries:true,
    onError: (error) => {
      props.setError(error)
    },
    // update: (store, response) => {
    //   props.updateCacheWith(response.data.addBook)
    // }
  })
  
  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
  
    const published = Number(publishedYear)
    
    await addNewBook({variables:{title,author,published,genres:genres}})
    
    props.setPage('books')
    setTitle('')
    setPublishedYear('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre.toString()))
    setGenre('')
  }


  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={publishedYear}
            onChange={({ target }) => setPublishedYear(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(', ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook