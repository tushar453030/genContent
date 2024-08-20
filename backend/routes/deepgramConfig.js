import fs from 'fs'
import YoutubeMp3Downloader from 'youtube-mp3-downloader'
import { createClient } from '@deepgram/sdk'
import { Downloader } from 'ytdl-mp3'

import ffmpeg from 'ffmpeg-static'
import dotenv from 'dotenv'
dotenv.config()

const deepgram = new createClient(process.env.DEEPGRAMKEY)

// const YD = new YoutubeMp3Downloader({
//   ffmpegPath: ffmpeg,
//   outputPath: './',
//   youtubeVideoQuality: 'highestaudio',
// })

const YD = new Downloader({
  getTags: true,
})

export { deepgram, YD }
