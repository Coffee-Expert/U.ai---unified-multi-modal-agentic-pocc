import React from 'react';
import {
  Box, Typography, Card, CardHeader, CardContent, Divider,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DnsIcon from '@mui/icons-material/Dns';
import TerminalIcon from '@mui/icons-material/Terminal';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import InventoryIcon from '@mui/icons-material/Inventory';
import styled from '@mui/system/styled';
import { useSidebarContext } from '../context/SidebarContext';

const PanelContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
});

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
}));

export default function PatchSidebar({ onQuickAction }) {
  const { patchState } = useSidebarContext();
  const machine = patchState?.machine;
  const patchSummary = patchState?.patchSummary;

  if (!machine) {
    return (
      <Box p={2} color="text.secondary" fontStyle="italic">
        Select and run patch on a machine to view details here.
      </Box>
    );
  }

  return (
    <PanelContainer>
      {/* Machine Info */}
      <StyledCard>
        <CardHeader
          avatar={<DnsIcon color="primary" />}
          title="Machine Info"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2"><strong>Host:</strong> {machine.ip}</Typography>
          <Typography variant="body2"><strong>User:</strong> {machine.username}</Typography>
          <Typography variant="body2"><strong>OS:</strong> {machine.os}</Typography>
        </CardContent>
      </StyledCard>

      {/* Patch Summary */}
      <StyledCard>
        <CardHeader
          avatar={<InventoryIcon color="secondary" />}
          title="Patch Summary"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2">📦 <strong>Total:</strong> {patchSummary?.total ?? '—'}</Typography>
          <Typography variant="body2">🔁 <strong>Reboot:</strong> {patchSummary?.reboot ?? '—'}</Typography>
          <Typography variant="body2">✅ <strong>No Reboot:</strong> {patchSummary?.nonReboot ?? '—'}</Typography>
        </CardContent>
      </StyledCard>


      {/* Help */}
      <StyledCard>
        <CardHeader
          avatar={<InfoIcon color="disabled" />}
          title="Patch Notes"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This tool automatically checks and installs updates via WinRM or SSH. Results appear in the console.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            Reboot-required updates are installed last to minimize disruptions.
          </Typography>
        </CardContent>
      </StyledCard>
    </PanelContainer>
  );
}
