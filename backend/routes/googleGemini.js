import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { YoutubeTranscript } from 'youtube-transcript'
import { deepgram, YD } from './deepgramConfig.js'

dotenv.config()

const router = express.Router()

// Configure Google Generative AI
const gemini_api_key = process.env.GEMINI_API_KEY
const googleAI = new GoogleGenerativeAI(gemini_api_key)
async function getYouTubeVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 200,
}

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
})

// Routes
router.post('/LinkedInPost', async (req, res) => {
  try {
    const { videoUrl } = req.body
    console.log(videoUrl)
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    const transcriptText = transcriptArray.map((part) => part.text).join(' ')

    const cleanedTranscript = transcriptText.replace(/[^\w\s]/g, '')

    const prompt = `
    Act as a user who created a video on youtube now create a post for LinkedIn. The character limit must be below 1000 also add necessary hashtags at the end of the post. Use the below transcript to frame your response:
    Transcript: ${cleanedTranscript}
    `

    const result = await geminiModel.generateContent(prompt)

    const response = result.response.text()

    res.send({ response })
  } catch (error) {
    console.error('Error generating LinkedIn post:', error)
    res.status(500).send({ response: 'Error generating LinkedIn post', error })
  }
})

router.post('/LinkedInPostV2', async (req, res) => {
  try {
    const { videoUrl } = req.body
    console.log(videoUrl)
    const videoId = await getYouTubeVideoId(videoUrl)
    console.log(videoId)
    // YD.download(videoId, `${videoId}.mp3`)
    const song = await YD.downloadSong(videoUrl)
    console.log(song)
    // YD.on('progress', (data) => {
    //   console.log(data.progress.percentage + '% downloaded')
    // })

    // YD.on('finished', async (err, video) => {
    //   const videoFileName = video.file
    //   console.log(`Downloaded ${videoFileName}`)
    //   console.log(video)

    //   // Continue on to get transcript here
    // })
  } catch (error) {
    console.error('Error generating LinkedIn post:', error)
    res.status(500).send({ response: 'Error generating LinkedIn post', error })
  }
})
router.post('/BlogPost', async (req, res) => {
  try {
    const { videoUrl } = req.body
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl)
    const transcriptText = transcriptArray.map((part) => part.text).join(' ')
    const cleanedTranscript = transcriptText.replace(/[^\w\s]/g, '')

    const prompt = `
    Act as a user who created a video on youtube now create a blog on it. The word limit must be below 500. Use the below transcript to know the content about the video and then frame your response:
    Transcript: ${cleanedTranscript}
    `

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()

    res.send({ response })
  } catch (error) {
    console.error('Error generating Blog post:', error)
    res.status(500).send({ response: 'Error generating Blog post', error })
  }
})

router.post('/TwitterPost', async (req, res) => {
  try {
    const { videoUrl } = req.body
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl)
    const transcriptText = transcriptArray.map((part) => part.text).join(' ')
    const cleanedTranscript = transcriptText.replace(/[^\w\s]/g, '')

    const prompt = `
    Act as a user who created a video on youtube now create a tweet for Twitter. The character limit must be below 200 also add necessary hashtags at the end of the post. Use the below transcript to frame your response:
    Transcript: ${cleanedTranscript}
    `

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()

    res.send({ response })
  } catch (error) {
    console.error('Error generating Twitter post:', error)
    res.status(500).send({ response: 'Error generating Twitter post', error })
  }
})

export default router
