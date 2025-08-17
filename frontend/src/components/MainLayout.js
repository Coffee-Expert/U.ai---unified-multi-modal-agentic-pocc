import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';

import VoiceToTask from '../pages/VoiceToTask';
import VideoPanel from '../sidebars/VideoPanel';
import VTTPanel from '../sidebars/VTTpanel';
import PatchFrontend from '../pages/patch_frontend';
import PatchSidebar from '../sidebars/PatchPanel';
import { useSidebarContext } from '../context/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainLayout({ centerContent, rightContent }) {
  const [selectedItem, setSelectedItem] = useState('Live preview [Vlexa]');
  const [vttData, setVttData] = useState({ transcription: '', command: '', output: '' });

  const videoPanelRef = useRef();
  const sectionRefs = useRef({});
  const { currentView, setCurrentView } = useSidebarContext();

  const sidebarItems = [
    'Documentation',
    'Live preview [Vlexa]',
    'Voice to Remote Task',
    'Patch Management Agent',
  ];

  useEffect(() => {
    if (selectedItem === 'Patch Management Agent') {
      setCurrentView('patch');
    } else if (selectedItem === 'Voice to Remote Task') {
      setCurrentView('voice');
    } else if (selectedItem === 'Live preview [Vlexa]') {
      setCurrentView('vlexa');
    } else {
      setCurrentView(null);
    }
  }, [selectedItem]);

  const renderCenter = () => {
    switch (selectedItem) {
      case 'Documentation': {
        const scrollToSection = (key) => {
          const section = sectionRefs.current[key];
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        };

        const handleQuickLaunch = (action) => {
          const map = {
            vlexa: 'Live preview [Vlexa]',
            voice: 'Voice to Remote Task',
            patch: 'Patch Management Agent',
          };
          setSelectedItem(map[action]);
        };

        const bentoItems = [
          {
            key: 'overview',
            title: '🧠 Overview & Goals',
            size: 6,
            image: 'https://images.pexels.com/photos/1072851/pexels-photo-1072851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          {
            key: 'tech',
            title: '🔧 Tools & Technologies',
            size: 3,
            image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
          },
          {
            key: 'landing',
            title: '🌐 Landing Page',
            size: 3,
            image: 'https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          {
            key: 'chat',
            title: '💬 Chat Interface',
            size: 4,
            image: 'https://images.pexels.com/photos/352505/pexels-photo-352505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          {
            key: 'rag',
            title: '📚 RAG Pipeline',
            size: 8,
            image: 'https://images.pexels.com/photos/16956944/pexels-photo-16956944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          {
            key: 'components',
            title: '⚙️ Component Breakdown',
            size: 12,
            image: 'https://images.pexels.com/photos/1912172/pexels-photo-1912172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          },
          {
            key: 'launch-vlexa',
            title: '🔥 Launch Vlexa',
            size: 4,
            image: 'https://images.pexels.com/photos/158826/structure-light-led-movement-158826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            action: 'vlexa',
          },
          {
            key: 'launch-vtt',
            title: '🎙️ Voice to Task',
            size: 4,
            image: 'https://images.pexels.com/photos/1072851/pexels-photo-1072851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            action: 'voice',
          },
          {
            key: 'launch-patch',
            title: '🩹 Auto Patch Mgmt',
            size: 4,
            image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
            action: 'patch',
          },
        ];

        return (
          <Box
  sx={{
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto',
    width: '100%',
    maxWidth: { xs: '100%', md: '100%', lg: 'calc(100vw - 80px)' }, // dynamically scale with screen
    mb: 6,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }}
>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(12, 1fr)', mb: 6 }}>
              {bentoItems.map((item) => (
                <Box
                  key={item.key}
                  onClick={() =>
                    item.action ? handleQuickLaunch(item.action) : scrollToSection(item.key)
                  }
                  sx={{
                    gridColumn: `span ${item.size}`,
                    height: 220,
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      p: 2,
                      bgcolor: 'rgba(0,0,0,0.6)',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ color: '#f5f5f7' }}>
              <Box ref={(el) => (sectionRefs.current['overview'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  🧠 Overview & Goals
                </Typography>
                <ul>
                  <li>🚀 Enhance IT operations</li>
                  <li>🎥 Enable multimedia Q&A and semantic search</li>
                  <li>🎙️ Streamline user interaction via voice commands</li>
                  <li>💬 Provide a centralized chatbot experience</li>
                </ul>
              </Box>

              <Box ref={(el) => (sectionRefs.current['tech'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  🔧 Tools & Technologies
                </Typography>
                <Typography><strong>Backend:</strong> Flask, LangGraph</Typography>
                <Typography><strong>Frontend:</strong> ReactJS, Streamlit, MUI</Typography>
                <Typography><strong>Agents:</strong> GPT-3.5, Groq, LangChain</Typography>
                <Typography><strong>Voice:</strong> Whisper, SoundDevice, Scipy</Typography>
                <Typography><strong>Embeddings:</strong> MiniLM-L6-v2, ChromaDB</Typography>
                <Typography><strong>Media:</strong> ffmpeg</Typography>
                <Typography><strong>Execution:</strong> WinRM, SSH, PowerShell</Typography>
              </Box>

              <Box ref={(el) => (sectionRefs.current['landing'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  🌐 Unified Landing Page
                </Typography>
                <ul>
                  <li>Visual mission banner</li>
                  <li>Highlights of 5 intelligent agents</li>
                  <li>“Get Started” button routes to Vlexa</li>
                </ul>
              </Box>

              <Box ref={(el) => (sectionRefs.current['chat'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  💬 Unified Chat Interface
                </Typography>
                <ul>
                  <li>Sidebar navigation for modules</li>
                  <li>Mode toggle: Multimodal ↔ Chatbot</li>
                  <li>Upload: Video, audio, PDF</li>
                  <li>LangChain + Whisper Q&A with context</li>
                </ul>
              </Box>

              <Box ref={(el) => (sectionRefs.current['rag'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  📚 RAG-Based Pipeline
                </Typography>
                <ol>
                  <li>Index data into chunks → Embed → Store in ChromaDB</li>
                  <li>Retrieve top-K → Feed to LLM → Grounded answer</li>
                </ol>
                <Box
                  component="img"
                  src="/concept.png"
                  alt="RAG Concept"
                  sx={{
                    width: '100%',
                    mt: 2,
                    borderRadius: 2,
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Box ref={(el) => (sectionRefs.current['components'] = el)} sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ color: '#AE7EEC', fontWeight: 'bold' }}>
                  ⚙️ Component Breakdown
                </Typography>
                <ul>
                  <li>🤖 Chatbot Agent: LangGraph </li>
                  <li>🎥 Video Q&A: Whisper → ChromaDB → LangChain</li>
                  <li>📄 PDF Chat: Embedded doc chunks → searchable QA</li>
                  <li>🩹 Patch Manager: EC2 WinRM + LangGraph automation</li>
                  <li>🎙️ Voice Task Agent: Whisper + LangChain → execute via WinRM/SSH</li>
                </ul>
              </Box>
            </Box>
          </Box>
        );
      }

      case 'Live preview [Vlexa]':
        return centerContent;

      case 'Voice to Remote Task':
        return <VoiceToTask onResult={setVttData} />;

      case 'Patch Management Agent':
        return <PatchFrontend />;

      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">{selectedItem}</Typography>
            <Typography sx={{ mt: 1, fontStyle: 'italic' }} color="text.secondary">
              Content for this module is coming soon.
            </Typography>
          </Box>
        );
    }
  };

  const renderRight = () => {
    switch (currentView) {
      case 'patch':
        return <PatchSidebar />;
      case 'vlexa':
        return <VideoPanel ref={videoPanelRef} />;
      case 'voice':
        return <VTTPanel {...vttData} />;
      default:
        return rightContent || (
          <Typography variant="body2" color="text.secondary">
            Select a module to see additional info.
          </Typography>
        );
    }
  };

  return (
    <Box display="flex" height="100vh" gap={2} bgcolor="background.default" p={2}>
      {/* Left Sidebar */}
      <Box
        sx={{
          minwidth: 240,
          bgcolor: '#1f1f1f',
          borderRight: '1px solid #333',
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          U.ai – AI TaskForce
        </Typography>
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                selected={selectedItem === item}
                onClick={() => setSelectedItem(item)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
  
      {/* Center Content */}
      <Box flexGrow={1}>
        {renderCenter()}
      </Box>
  
      {/* Right Sidebar - Only Show If Not Documentation */}
      {selectedItem !== 'Documentation' && (
        <Box sx={{ width: 250 }}>
          {renderRight()}
        </Box>
      )}
    </Box>
  );
  
}
