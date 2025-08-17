import React, { forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Card, CardHeader, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MicIcon from '@mui/icons-material/Mic';
import TerminalIcon from '@mui/icons-material/Terminal';
import styled from '@mui/system/styled';

const PanelContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.04)',
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
}));

export default forwardRef(function VTTPanel({ transcription, command }, ref) {
  // expose reset if needed
  useImperativeHandle(ref, () => ({ reset: () => {} }));

  return (
    <PanelContainer>
      {/* Tutorial Card */}
      <StyledCard>
        <CardHeader
          avatar={<HelpOutlineIcon color="primary" />}
          title="How to Use"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <List dense>
            {[
              'Enter the destination PC’s IP address in “Host.”',
              'Type the SSH or WinRM Username.',
              'Type the corresponding Password.',
              'Click the mic icon to start recording.',
              'Speak your command; then click again to stop.',
            ].map((step, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  <Typography variant="body2" color="textSecondary">{i + 1}.</Typography>
                </ListItemIcon>
                <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>

      {/* User Prompt Card */}
      <StyledCard>
        <CardHeader
          avatar={<MicIcon color="secondary" />}
          title="User Prompt"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {transcription || '— no prompt yet —'}
          </Typography>
        </CardContent>
      </StyledCard>

      {/* Generated Command Card */}
      <StyledCard>
        <CardHeader
          avatar={<TerminalIcon color="secondary" />}
          title="Generated Command"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: 'Courier, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {command || '— no command generated —'}
          </Typography>
        </CardContent>
      </StyledCard>
    </PanelContainer>
  );
});
