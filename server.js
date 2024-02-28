const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./graphql/schema.js')
const { connectDB } = require("./db")
const { authenticate } = require("./middlewares/auth.js")

const port = process.env.PORT ?? 3000

connectDB()
const app = express();

app.use(authenticate)

app.get('/', (req, res) => {
    res.send("welcome to my graphql")
})

app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}))

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})