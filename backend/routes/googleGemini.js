import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import { YoutubeTranscript } from 'youtube-transcript'

dotenv.config()

const router = express.Router()

//configure google generative ai

const gemini_api_key = process.env.GEMINI_API_KEY
const googleAI = new GoogleGenerativeAI(gemini_api_key)

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

//routes
router.post('/createLinkedInPost', async (req, res) => {
  const { videoUrl } = req.body
  const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl)
  const transcriptText = transcriptArray.map((part) => part.text).join(' ')
  const cleanedTranscript = transcriptText.replace(/[^\w\s]/g, '')

  const prompt = `
  Act as a user who created a video on youtube now create a post for LinkedIn. The character limit must be below 1000 also add neccessary hashtag at the end of the post. Use the below transcript to frame your reponse
  Transcipt: ${cleanedTranscript}
  `

  const result = await geminiModel.generateContent(prompt)

  const response = result.response.text()
  console.log(response)

  res.json({ response })
})

export default router
