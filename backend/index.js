import express from 'express'
import googleGemini from './routes/googleGemini.js'
import cors from 'cors'

const app = express()
const port = 5000

app.use(express.json())
app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  next()
})

app.get('/', async (req, res) => {
  res.send('I am home')
})

app.use('/generate', googleGemini)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
