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
router.get('/createLinkedInPost', async (req, res) => {
  const { videoUrl } = req.body
  const transcriptText = await YoutubeTranscript.fetchTranscript(
    'https://www.youtube.com/watch?v=H58vbez_m4E'
  )

  res.send(transcriptText)
})

export default router
