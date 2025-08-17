import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import { useSidebarContext } from '../context/SidebarContext';

const fileIcons = {
  mp4: <MovieIcon />,
  mkv: <MovieIcon />,
  mp3: <AudiotrackIcon />,
  pdf: <PictureAsPdfIcon />,
  txt: <DescriptionIcon />,
  jpg: <ImageIcon />,
  jpeg: <ImageIcon />,
  png: <ImageIcon />,
  default: <InsertDriveFileIcon />,
};

const VideoPanel = forwardRef(({ onSaveChat }, ref) => {
  const { videoMode, setVideoMode } = useSidebarContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    getMode: () => videoMode,
  }));

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setVideoMode(newMode);
      setFiles([]);
      setUploadResult(null);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || videoMode !== 'multimodal') return;
    setIsProcessing(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
      setFiles(prev => [...prev, { name: file.name, size: file.size, response: data }]);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadResult({ error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearDatabase = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/clear", {
        method: "POST",
      });
      if (!res.ok) throw new Error('Clear failed');
      // Reset local state
      setFiles([]);
      setUploadResult(null);
      console.log('Vector database cleared');
    } catch (err) {
      console.error('Error clearing database:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Agent Mode</Typography>

      <ToggleButtonGroup
        color="primary"
        value={videoMode}
        exclusive
        onChange={handleModeChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="multimodal">Multimodal Agent</ToggleButton>
        <ToggleButton value="chat">Chat Agent</ToggleButton>
      </ToggleButtonGroup>

      <Button
        variant="contained"
        onClick={() => onSaveChat && onSaveChat()}
        fullWidth
        sx={{ mb: 2, textTransform: "none" }}
      >
        Save Chat
      </Button>

      {videoMode === 'multimodal' && (
        <>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2, textTransform: "none" }}
          >
            Upload File
            <input
              ref={inputRef}
              type="file"
              hidden
              accept=".mp4,.mkv,.mp3,.jpg,.jpeg,.png,.pdf,.txt"
              onChange={handleFileUpload}
            />
          </Button>

          <Button
            variant="text"
            fullWidth
            onClick={handleClearDatabase}
            sx={{ mb: 2, color: '#FF6464', textTransform: 'none' }}
          >
            Clear Vector Database
          </Button>
        </>
      )}

      {isProcessing && (
        <Box display="flex" flexDirection="column" alignItems="center" my={2}>
          <CircularProgress />
          <Typography mt={1}>Processing your file, hang tight...</Typography>
        </Box>
      )}

      {uploadResult && (
        <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#252525' }}>
          <Typography variant="subtitle2">
            {uploadResult.error
              ? `Error: ${uploadResult.error}`
              : `Upload successful: type=${uploadResult.type}, count=${uploadResult.count || ''}`}
          </Typography>
        </Card>
      )}

      <Typography variant="subtitle1" mt={2}>Uploaded Files:</Typography>
      <List dense>
        {files.map((file, idx) => (
          <ListItem key={idx} sx={{ pl: 0 }}>
            <ListItemIcon>
              {fileIcons[file.name.split('.').pop().toLowerCase()] || fileIcons.default}
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024).toFixed(1)} KB`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
});

export default VideoPanel;
