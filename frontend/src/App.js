import React, { useState } from 'react'
import axios from 'axios'
import {
  Container,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  CardContent,
  Card,
} from '@mui/material'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [content, setContent] = useState('')

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value)
  }

  const handleTabChange = async (event, newValue) => {
    setActiveTab(newValue)
    const tabNames = ['LinkedIn', 'Blog', 'Twitter']
    const tabName = tabNames[newValue]
    try {
      console.log(videoUrl)
      const response = await axios.post(
        `http://localhost:5000/generate/createLinkedInPost`,
        {
          videoUrl: videoUrl,
        }
      )
      console.log(response)
      const rawResponse = response.data.response
      const finalResponse = rawResponse.replace(/\n/g, '<br/>')
      setContent(finalResponse)
    } catch (error) {
      console.error('Error fetching data:', error)
      setContent('Error fetching data')
    }
  }

  const renderContent = () => {
    const tabTitles = ['LinkedIn Post', 'Blog Post', 'Twitter Post']
    return (
      <CardContent>
        <Typography variant='h5'>
          {['LinkedIn Post', 'Blog Post', 'Twitter Post'][activeTab]}
        </Typography>
        <Typography
          variant='body1'
          dangerouslySetInnerHTML={{
            __html: `${content}`,
          }}
        ></Typography>
      </CardContent>
    )
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
        </Card>
      </Box>
    </Container>
  )
}

export default App
