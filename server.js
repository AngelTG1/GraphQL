const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./src/graphql/schema.js')
const { connectDB } = require("./src/db/index.js")
const { authenticate } = require("./src/middlewares/auth.js")

const port = process.env.PORT ?? 3000

connectDB()
const app = express();

app.use(authenticate)

app.get('/', (req, res) => {
    res.send("welcome to graphql")
})

app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}))

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})