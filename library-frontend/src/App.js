
import React, { useState,useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import RecomendBooks from './components/RecomendBook'
import NewBook from './components/NewBook'
import Login from './components/Login'
import {useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED, CREATE_BOOK } from './queries/queries'
import './App.style.css'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map((p) => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS }).allBooks

    if (!includedIn(dataInStore, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: {allBooks:dataInStore.concat(addedBook)}
      })
    }

  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added!`)
      updateCacheWith(addedBook)
    },
  })


  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('book-user-token')
    if (loggedUserJSON) {
      setToken(loggedUserJSON)
    }
  },[])
  

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <div className='app_button'>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token?(
        <div>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </div>):(
        <div>
          <button onClick={() => setPage('login')}>login</button>
        </div>)}
      </div>

      <Authors
        show={page === 'authors'} setError={notify} token={token}
      />

      <Books
        show={page === 'books'} setError={notify}
      />

      {token?(<div>     
        <NewBook
        setPage={setPage}
        show={page === "add"}
        setError={notify}
        updateCacheWith={updateCacheWith}
      />
      <RecomendBooks show={page === 'recommend'} setError={notify}/>
      </div>
      ):(
        <Login show={page === 'login'} setError={notify} setToken={setToken} setPage={setPage}/>
      )}


      

    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
    {errorMessage}
    </div>
  )
}

export default App