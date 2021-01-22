
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://Chloe:19021997@cluster0.17p9e.mongodb.net/newbloglist?retryWrites=true&w=majority'
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = gql`
    type Book {
        title: String!
        published: String!,
        author: Author!,
        id: ID!,
        genres: [String!]!
    },

    type Author {
      name: String!
      born: Int
      id: ID!
    },

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }
    
    type Token {
      value: String!
    }

    type Mutation {
        addBook(
          title: String!
          author: String!
          published: Int!
          genres: [String!]
        ): Book
    
        editAuthor(
            name: String!
            setBornTo: Int!
          ): Author

        createUser(
            username: String!
            favoriteGenre: String!
          ): User
          
        login(
            username: String!
            password: String!
          ): Token
      }
    
    type Query {
        allBooks(author:String,genre:String): [Book!]
        bookCount: Int!
        authorCount: Int!
        allAuthors: [Author!]
        me: User
    }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (roots,args) => {
      const all = await Book.find({}).populate("author")
      return all
    },
    allAuthors: () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation:{
      addBook: async (root,args,{currentUser}) => {
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          try {
            await author.save();
          }catch(error){
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
        }
        const book = new Book({title:args.title,published:args.published,author:author._id,genres:args.genres})
        try{
          await book.save()
        }catch(error){
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        const savedBook = await book.populate("author").execPopulate();
        return savedBook
    },
    editAuthor: async (root,args,{currentUser}) =>{
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;
      try{
        author.save()
      }catch(e){
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secred' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      // console.log(currentUser)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})