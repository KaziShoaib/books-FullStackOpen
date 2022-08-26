require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { UserInputError, AuthenticationError } = require('apollo-server')

const {PubSub} = require('graphql-subscriptions')
const pubSub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser){
        throw new AuthenticationError('not authenticated')
      }
      let author = await Author.findOne({name: args.author})
      if(!author){
        author = new Author({
          name: args.author
        })
        try{
          await author.save()
        }catch(error){
          throw new UserInputError("author parameters not ok", {
            invalidArgs: args
          })
        }        
      }
      const book = new Book({
        title: args.title,
        author: author,
        published: args.published,
        genres: args.genres
      })
      try{
        await book.save()
      }catch(error){
        throw new UserInputError("book parameters not ok", {
          invalidArgs: args
        })
      }
      
      pubSub.publish('BOOK_ADDED', {bookAdded: book})
      return book
    },

    editAuthor: async (root, args, context) => {  
      const currentUser = context.currentUser
      if(!currentUser){
        throw new AuthenticationError('not authenticated')
      }   
      const author = await Author.findOne({name: args.name})
      if(!author)
        return null
      try{
        author.born = args.setBornTo      
        await author.save()
      }catch(error){        
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      
      return author
    },

    createUser: async(root, args) => {
      const existingUser = await User.findOne({username: args.username})
      if(existingUser){
        throw new UserInputError('username already exists', {
          invalidArgs: args.username
        })
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      
      const user = new User({
        username: args.username,
        passwordHash: passwordHash,
        favouriteGenre: args.favouriteGenre
      })
      try {
        await user.save()
      }catch(error){
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      return user
    },

    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      const passwordCorrect = user === null ? false : await bcrypt.compare   (args.password, user.passwordHash)      

      if(!(user && passwordCorrect)){
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET),
        username: user.username,
        favouriteGenre: user.favouriteGenre
      }
    }
  },
  
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    
    authorCount: async () => Author.collection.countDocuments(),
    
    allBooks: async (root, args) => {
      if(!args.author && !args.genre)
        return Book.find({}).populate('author')      
      if(args.author){
        const author = await Author.findOne({name: args.author})
        const matchedByAuthor = await Book.find({author: author}).populate('author')
        if(args.genre){
          const matchedByAuthorAndGenre = matchedByAuthor.filter(b => b.genres.includes(args.genre))
          return matchedByAuthorAndGenre
        }
        return matchedByAuthor
      }
      const matchedByGenre = await Book.find({genres: {$in: [args.genre]}}).populate('author')
      return matchedByGenre
    },
    
    allAuthors: async () => {
      return  Author.find({})
    },

    me: async (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({name: root.name})
      return Book.find({author: author}).countDocuments()
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers