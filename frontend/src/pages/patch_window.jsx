import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, List, ListItem, ListItemText,
  Divider, Paper, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useSidebarContext } from '../context/SidebarContext';

export default function PatchWindow({ name, ip, username, password, os, onBack }) {
  const [consoleOutput, setConsoleOutput] = useState('');
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentView, setPatchState } = useSidebarContext();

  useEffect(() => {
    setCurrentView('patch');
    setPatchState(prev => ({
      ...prev,
      machine: { name, ip, username, os },
    }));
  }, []);

  const fetchPatchInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/patch', {
        host: ip,
        username,
        password,
        os,
      });

      const rawLog = response.data.log || [];
      setConsoleOutput(rawLog.join('\n'));

      const summary = {
        total: rawLog.filter(l => l.includes("updates")).length,
        reboot: rawLog.filter(l => l.includes("Reboot-required")).length,
        nonReboot: rawLog.filter(l => l.includes("No-reboot")).length,
      };

      setPatchState(prev => ({
        ...prev,
        patchSummary: summary,
      }));

      const updatesFound = rawLog.filter(line =>
        line.startsWith("📦 Install Output:") || line.includes("KB")
      );

      setUpdates(updatesFound.map((text, index) => ({
        id: index,
        title: text.replace("📦 Install Output:", '').trim(),
        requiresReboot: text.toLowerCase().includes("reboot"),
      })));

    } catch (error) {
      setConsoleOutput(`⚠️ Error: ${error.message}`);
      setUpdates([]);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#1C1C1E',
        color: '#E5E5EA',
        p: 4,
        borderRadius: 3,
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        fontFamily: 'SF Pro Display, Roboto, sans-serif',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="600" sx={{ color: '#AE7EEC' }}>
            {name || 'Machine'} — Patch Agent
          </Typography>
          <Typography variant="body2" sx={{ color: '#9E9EA2' }}>
            IP: {ip} | OS: {os} | User: {username}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={fetchPatchInfo}
          disabled={loading}
          sx={{
            bgcolor: '#AE7EEC',
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#955ede' },
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Fetch Updates'}
        </Button>
      </Box>

      <Button
        variant="text"
        onClick={onBack}
        sx={{ color: '#AE7EEC', mb: 2, textTransform: 'none' }}
      >
        ← Back to Machine Grid
      </Button>

      <Divider sx={{ borderColor: '#2C2C2E', mb: 2 }} />

      {/* Update Summary */}
      <Box>
        <Typography variant="h6" sx={{ color: '#E5E5EA', mb: 1 }}>
          Available Updates
        </Typography>
        {updates.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#888' }}>
            No updates detected. Click "Fetch Updates" to scan.
          </Typography>
        ) : (
          <List
            sx={{
              borderRadius: 2,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {updates.map((u) => (
              <ListItem key={u.id} divider sx={{ py: 1.5 }}>
                <ListItemText
                  primary={u.title}
                  secondary={u.requiresReboot ? '🔁 Reboot Required' : '✅ No Reboot Needed'}
                  primaryTypographyProps={{ fontWeight: 500, color: '#FFF' }}
                  secondaryTypographyProps={{ color: '#9E9EA2' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Console Output */}
      <Box mt={4}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#9E9EA2' }}>
          System Console
        </Typography>
        <Paper
          elevation={3}
          sx={{
            bgcolor: '#2C2C2E',
            color: '#D1D1D6',
            fontFamily: 'Menlo, monospace',
            fontSize: '0.85rem',
            p: 2,
            height: 240,
            overflowY: 'auto',
            borderRadius: 2,
            whiteSpace: 'pre-line',
            border: '1px solid #3A3A3C',
          }}
        >
          {consoleOutput || 'No output yet. Click "Fetch Updates" to run the patch process.'}
        </Paper>
      </Box>

      {/* Footer Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={fetchPatchInfo}
          sx={{
            borderColor: '#AE7EEC',
            color: '#AE7EEC',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(174, 126, 236, 0.05)',
              borderColor: '#955ede',
            },
          }}
        >
          Re-run Patch
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigator.clipboard.writeText(consoleOutput || '')}
          sx={{
            borderColor: '#AE7EEC',
            color: '#AE7EEC',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(174, 126, 236, 0.05)',
              borderColor: '#955ede',
            },
          }}
        >
          Copy Logs
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const blob = new Blob([consoleOutput], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name || 'machine'}_patch_log.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          sx={{
            borderColor: '#AE7EEC',
            color: '#AE7EEC',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'rgba(174, 126, 236, 0.05)',
              borderColor: '#955ede',
            },
          }}
        >
          Export Logs
        </Button>
      </Box>
    </Box>
  );
}
