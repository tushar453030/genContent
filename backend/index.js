import express from 'express'

const app = express()
const port = 5000

app.use(express.json())

app.get('/', async (req, res) => {
  res.send('I am home')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
