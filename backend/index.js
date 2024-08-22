import express from 'express'
import googleGemini from './routes/googleGemini.js'
import cors from 'cors'
import fetch from 'node-fetch'
import { Innertube } from 'youtubei.js/web'
const app = express()

const port = 8080

app.use(express.json())
// app.use(function (request, response, next) {
//   response.header('Access-Control-Allow-Origin', '*')
//   response.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   )
//   next()
// })
// app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Content-Type', 'application/json;charset=UTF-8')
//   next()
// })

// app.get('/', async (req, res) => {
//   res.send('I am home')
// })

// app.use('/generate', googleGemini)

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`)
// })

const youtube = await Innertube.create({
  lang: 'en',
  location: 'US',
  retrieve_player: false,
})

// Utility function to copy headers
function copyHeader(headerName, to, from) {
  const hdrVal = from.get(headerName)
  if (hdrVal) {
    to.set(headerName, hdrVal)
  }
}

// Fetch Transcript function
const fetchTranscript = async (url) => {
  try {
    const info = await youtube.getInfo(url)
    const transcriptData = await info.getTranscript()

    return transcriptData.transcript.content.body.initial_segments.map(
      (segment) => segment.snippet.text
    )
  } catch (error) {
    console.error('Error fetching transcript:', error)
    throw error
  }
}

// Proxy handler function
const proxyHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-goog-visitor-id, x-origin, x-youtube-client-version, x-youtube-client-name, x-goog-api-format-version, x-user-agent, Accept-Language, Range, Referer',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    })
    return res.status(200).send('')
  }

  const url = new URL(req.url, `http://localhost/`)
  if (!url.searchParams.has('__host')) {
    return res
      .status(400)
      .send(
        'Request is formatted incorrectly. Please include __host in the query string.'
      )
  }

  url.host = url.searchParams.get('__host')
  url.protocol = 'https'
  url.port = '443'
  url.searchParams.delete('__host')

  const requestHeaders = new Headers(
    JSON.parse(url.searchParams.get('__headers') || '{}')
  )
  copyHeader('range', requestHeaders, req.headers)

  if (!requestHeaders.has('user-agent')) {
    copyHeader('user-agent', requestHeaders, req.headers)
  }
  url.searchParams.delete('__headers')

  try {
    const fetchRes = await fetch(url.toString(), {
      method: req.method,
      headers: requestHeaders,
      body: req.body,
    })

    const headers = new Headers()
    copyHeader('content-length', headers, fetchRes.headers)
    copyHeader('content-type', headers, fetchRes.headers)
    copyHeader('content-disposition', headers, fetchRes.headers)
    copyHeader('accept-ranges', headers, fetchRes.headers)
    copyHeader('content-range', headers, fetchRes.headers)

    headers.set('Access-Control-Allow-Origin', req.headers.origin || '*')
    headers.set('Access-Control-Allow-Headers', '*')
    headers.set('Access-Control-Allow-Methods', '*')
    headers.set('Access-Control-Allow-Credentials', 'true')

    res.set(Object.fromEntries(headers.entries()))
    return res.status(fetchRes.status).send(await fetchRes.text())
  } catch (error) {
    console.error('Error in proxy handler:', error)
    return res.status(500).send('Internal Server Error')
  }
}
app.all('/proxy', proxyHandler)

app.use('/generate', googleGemini)
// Express route handling
app.post('/LinkedInPostV2', async (req, res) => {
  try {
    const { videoUrl } = req.body
    console.log(videoUrl)
    const transcriptArray = await fetchTranscript(videoUrl)
    res.send({ transcript: transcriptArray })
  } catch (error) {
    console.error('Error generating LinkedIn post:', error)
    res.status(500).send({ response: 'Error generating LinkedIn post', error })
  }
})
app.get('/', async (req, res) => {
  res.send('I am home')
})
// Additional route for proxying requests

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
