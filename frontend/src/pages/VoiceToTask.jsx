import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { keyframes } from '@mui/system';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    width: 100%;
  }
  .input {
    color: #fff;
    font-size: 1rem;
    background-color: transparent;
    width: 100%;
    padding: 0.8em 1em;
    border: none;
    border-bottom: 2px solid #888;
    transition: border-color 0.3s;
  }
  .input:focus {
    outline: none;
    border-bottom-color: #47C9FF;
  }
  .input-border-alt {
    position: absolute;
    background: linear-gradient(90deg, #FF6464 0%, #FFBF59 50%, #47C9FF 100%);
    width: 0%;
    height: 3px;
    bottom: 0;
    left: 0;
    transition: width 0.4s ease;
  }
  .input:focus + .input-border-alt {
    width: 100%;
  }
`;

export default function VoiceToTask({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunksRef = useRef([]);
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => chunksRef.current.push(e.data);
        setMediaRecorder(recorder);
      } catch (e) {
        console.error('Mic error:', e);
      }
    }
    init();
  }, []);

  const handleRecord = () => {
    if (!mediaRecorder) return;
    if (!recording) {
      chunksRef.current = [];
      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorder.stop();
      setRecording(false);
      mediaRecorder.onstop = processAudio;
    }
  };

  const processAudio = async () => {
    const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
    setLoading(true);
    const fd = new FormData();
    fd.append('audio', blob, 'rec.wav');
    fd.append('host', host);
    fd.append('username', username);
    fd.append('password', password);
    if (text) fd.append('text', text); // Include optional text too

    try {
      const res = await fetch('http://localhost:5000/process_audio', { method: 'POST', body: fd });
      const data = await res.json();
      setTranscript(data.transcription);
      setCommand(data.command);
      setOutput(data.output);
      if (onResult) onResult({ transcription: data.transcription, command: data.command, output: data.output });
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveLogs = () => {
    const log = `
===== EXECUTION LOG =====
Timestamp: ${new Date().toLocaleString()}
Host: ${host}
Username: ${username}

===== USER TEXT INPUT =====
${text || '—'}

===== TRANSCRIPTION =====
${transcript || '—'}

===== COMMAND =====
${command || '—'}

===== OUTPUT =====
${output || '—'}
`.trim();

    const blob = new Blob([log], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Voice-Driven Command Executor
      </Typography>
      <Stack spacing={3}>
        {/* Recording Button */}
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleRecord} color={recording ? 'error' : 'primary'}>
              <GraphicEqIcon fontSize="large" sx={recording ? { animation: `${pulse} 1s infinite` } : {}} />
            </IconButton>
            <Typography>{recording ? 'Recording...' : 'Click to record voice'}</Typography>
          </Stack>
        </Paper>

        {/* Config Inputs */}
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Stack spacing={2}>
            {[
              { label: 'Host', value: host, setter: setHost },
              { label: 'Username', value: username, setter: setUsername },
              { label: 'Password', value: password, setter: setPassword, type: 'password' },
              { label: 'Or type your request (instead of voice)', value: text, setter: setText },
            ].map(({ label, value, setter, type }, i) => (
              <StyledWrapper key={i}>
                <div className="form-control">
                  <input
                    className="input"
                    placeholder={label}
                    value={value}
                    type={type || 'text'}
                    onChange={(e) => setter(e.target.value)}
                  />
                  <span className="input-border-alt" />
                </div>
              </StyledWrapper>
            ))}
          </Stack>
        </Paper>

        {/* Main Action Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          endIcon={loading ? <CircularProgress size={24} /> : <SendIcon />}
          onClick={handleRecord}
          disabled={loading || !mediaRecorder}
        >
          {recording ? 'Process' : 'Start'}
        </Button>

        {/* Results */}
        {(transcript || command || output) && (
          <>
            <Paper sx={{ p: 2, bgcolor: '#1e1e1e', borderRadius: 2 }}>
              <Typography variant="h6">Results</Typography>
              {transcript && (
                <>
                  <Typography variant="subtitle2" mt={2}>Transcription:</Typography>
                  <Typography>{transcript}</Typography>
                </>
              )}
              {command && (
                <>
                  <Typography variant="subtitle2" mt={2}>Command:</Typography>
                  <Typography sx={{ fontFamily: 'monospace' }}>{command}</Typography>
                </>
              )}
              {output && (
                <>
                  <Typography variant="subtitle2" mt={2}>Output:</Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{output}</Typography>
                </>
              )}
            </Paper>

            {/* Save Logs Button */}
            <Button
              variant="outlined"
              sx={{ mt: 2, borderColor: '#AE7EEC', color: '#AE7EEC' }}
              onClick={saveLogs}
            >
              Save Logs
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
