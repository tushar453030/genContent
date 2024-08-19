import React, { useState } from 'react'
import axios from 'axios'
import {
  Container,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  CardContent,
  Card,
  CircularProgress,
  IconButton,
} from '@mui/material'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'

function App() {
  const [videoUrl, setVideoUrl] = useState(null)
  const [activeTab, setActiveTab] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value)
    setError('')
  }

  const handleTabChange = async (event, newValue) => {
    if (!videoUrl) {
      setError('Please enter the YouTube URL')
      return
    }
    setActiveTab(newValue)
    setLoading(true)
    const tabNames = ['LinkedIn', 'Blog', 'Twitter']
    const tabName = tabNames[newValue]
    try {
      const response = await axios.post(
        `https://gen-content-5yf3mtbui-tushar453030s-projects.vercel.app/generate/${tabName}Post`,
        {
          videoUrl: videoUrl,
        }
      )

      const rawResponse = response.data.response
      const finalResponse = rawResponse.replace(/\n/g, '<br/>')
      setContent(finalResponse)
    } catch (error) {
      console.error('Error fetching data:', error)
      setContent('Error fetching data')
    }
    setLoading(false)
  }

  const renderContent = () => {
    return (
      <CardContent>
        <Typography variant='h5'>
          {['LinkedIn Post', 'Blog Post', 'Twitter Post'][activeTab]}
        </Typography>
        {loading ? ( // Display loader when loading is true
          <CircularProgress />
        ) : (
          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{
              __html: `${content}`,
            }}
          ></Typography>
        )}
      </CardContent>
    )
  }

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content.replace(/<br\/>/g, '\n'))
      alert('Content copied to clipboard!')
    }
  }

  return (
    <Container maxWidth='md'>
      <Box sx={{ minHeight: '300vh', padding: 4 }}>
        <Typography variant='h4' gutterBottom>
          Generate Content
        </Typography>
        <TextField
          fullWidth
          label='Enter YouTube URL'
          variant='outlined'
          value={videoUrl}
          onChange={handleInputChange}
          sx={{ marginBottom: 3 }}
        />
        {error && (
          <Typography color='error' sx={{ marginBottom: 3 }}>
            {error}
          </Typography>
        )}
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 4,
            boxShadow: 5,
            borderRadius: 2,
            backgroundColor: '#ffffff', // Different background color for the Card
            minHeight: '300px',
          }}
        >
          <Tabs
            orientation='vertical'
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor='primary'
            textColor='primary'
            sx={{
              borderRight: 3,
              borderColor: 'divider',
              justifyContent: 'space-evenly',
              backgroundColor: '#fafafa', // Optional: slight background difference for the tabs
            }}
          >
            <Tab label='LinkedIn Post' />
            <Tab label='Blog Post' />
            <Tab label='Twitter Post' />
          </Tabs>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>{renderContent()}</Box>
          {content && (
            <IconButton
              onClick={handleCopy}
              sx={{
                position: 'relative',
                alignItems: 'flex-start',
                maxHeight: '40px',
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          )}
        </Card>
      </Box>
    </Container>
  )
}

export default App
