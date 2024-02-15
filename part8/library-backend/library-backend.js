const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ) : Book!

    addAuthor(
      name: String!
      born: Int
    ) : Author

    editAuthor(
      name: String!
      setBornTo: Int!
    ) : Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({})
      } else if (args.author) {
        return Book.find({ author: args.author })   
      } else if (args.genre) {
        return Book.find({ genres: args.genre })
      }
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: (root) => Book.filter(b => b.author === root.name).length    
  },
  Book: {
    author: async (root) => Author.findOne({ _id: root.author })
  },
  Mutation: {
    addBook: async (root, args) => {
    const author = await Author.findOne({ name: args.author })
    
    if (!author) {
      throw new GraphQLError('Author not found', {
        extensions: {
          code: 'AUTHOR_NOT_FOUND',
          invalidArgs: args.name,
          error
        }
      })
    }

    const book = new Book({
      title: args.title,
      published: args.published,
      author: author._id,
      genres: args.genres
    })

    try {
      await book.save();
    } catch (error) {
      throw new GraphQLError('Creating book failed', {
        extensions: {
          code: 'BAD_BOOK_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }

    return book
  },
    addAuthor: async (root, args) => {
      const author = new Author({ ...args })

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Creating author failed', {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    editAuthor: (root, args) => {
      const authorToUpdate = Author.find(a => a.name === args.name)

      if (!authorToUpdate) {
        throw new GraphQLError('This author does not exist', {
          extensions: {
            code: 'BAD_AUTHOR_EDIT_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      try {
        const updatedAuthor = { ...authorToUpdate, born: args.setBornTo }
        updatedAuthor.save()
      } catch {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_AUTHOR_EDIT_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return updatedAuthor  
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        await user.save()
      } catch {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})