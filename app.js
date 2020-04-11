import express from 'express'
import { json } from 'body-parser'
import graphqlHttp from 'express-graphql'
import mongoose from 'mongoose'

//const graphQlSchema = require('./graphql/schema/index')
//const graphQlResolvers = require('./graphql/resolvers/index')
import schema from './graphql/schema'
import auth from './middleware/auth'

const app = express()

app.use(json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(auth)

app.use(
  '/graphql',
  graphqlHttp(request => ({
    schema: schema,
    //context,
    graphiql: true
  }))
)
mongoose.set('useUnifiedTopology', true)
mongoose.set('debug', true)
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ogjsn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    app.listen(process.env.PORT || 8000)
  })
  .catch(err => {
    console.log(err)
  })
