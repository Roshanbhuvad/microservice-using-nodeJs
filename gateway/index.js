const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', proxy('http://localhost:8001'))

app.use('/order', proxy('http://localhost:8003'))
app.use('/', proxy('http://localhost:8002'))


app.listen(8000, () => {
    console.log("Gateway is listening to port 8000")
})