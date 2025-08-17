// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainLayout from './components/MainLayout';
import ChatInterface from './pages/ChatInterface';
import VideoPanel from './sidebars/VideoPanel';
import { SidebarProvider } from './context/SidebarContext'; // ✅ context import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPageWrapper />} />
      </Routes>
    </Router>
  );
}

// ✅ Wrapped in SidebarProvider
function MainPageWrapper() {
  const videoRef = React.useRef();
  const [videoUrl, setVideoUrl] = React.useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      const formData = new FormData();
      formData.append('video', file);

      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log("✅ Upload result:", result.message);
      } catch (error) {
        console.error("❌ Upload error:", error);
      }
    }
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.seekTo(seconds);
    }
  };

  return (
    <SidebarProvider>
      <MainLayout
        centerContent={<ChatInterface onTimestampClick={handleSeek} />}
        rightContent={<VideoPanel ref={videoRef} videoUrl={videoUrl} handleUpload={handleUpload} />}
      />
    </SidebarProvider>
  );
}

export default App;
