import React, {useState} from 'react'
import { gql, useQuery,useMutation } from '@apollo/client';
import { ALL_AUTHORS,EDIT_AUTHOR } from '../queries/queries';
import Select from "react-select";

const Authors = (props) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'white' : 'blue',
      padding: 20,
    }),

  }
  const [name, setName] = useState('');
  const [year, setYear] = useState('')

  const authors = useQuery(ALL_AUTHORS,{
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR,{
    refetchQueries: [{query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }
  

   if (authors.loading)  {
    return <div>loading...</div>
  }

  const setBirthYear = async (event) =>{
    event.preventDefault()
   
    const yearN = Number(year)
    await editAuthor({variables:{name:name.value,year:yearN}})

    setName('');
    setYear('')
  }
  const authorName = authors.data.allAuthors.map(p => {return{value:p.name,label:p.name}})

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {props.token?(<div>      
        <h2>Set birthyear for author</h2>
      <form onSubmit={setBirthYear}>
            <Select styles={customStyles} onChange={setName} options={authorName}/>
            <div>
              born
              <input value={year} onChange={({target})=>setYear(target.value)}></input>
            </div>
            <button type='submit'>Send</button>
      </form>
      </div>):(null)}

    </div>
  )
}

export default Authors
