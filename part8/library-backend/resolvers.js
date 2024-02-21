const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({}).populate('author')
      } else if (args.author) {
        return await Book.find({ author: args.author }).populate('author') 
      } else if (args.genre) {
        return await Book.find({ genres: args.genre }).populate('author')
      }
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => await Book.filter(b => b.author === root.name).length    
  },
  Book: {
    author: async (root) => await Author.findOne({ _id: root.author })
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

        pubsub.publish('BOOK_ADDED', { bookAdded: book })
      
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
    editAuthor: async (root, args) => {
      try {
        const authorToUpdate = await Author.findOne({ name: args.name })
        if (!authorToUpdate) {
          throw new GraphQLError('This author does not exist', {
            extensions: {
              code: 'BAD_AUTHOR_EDIT_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        authorToUpdate.born = args.setBornTo
        await authorToUpdate.save()
        return authorToUpdate
      } catch {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_AUTHOR_EDIT_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
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
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }    
  }
}

module.exports = resolvers