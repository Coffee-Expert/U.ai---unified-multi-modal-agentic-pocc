import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Card, CardContent, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, MenuItem
} from '@mui/material';
import PatchWindow from './patch_window';

const initialMachines = [
  {
    name: 'Server A',
    ip: '13.60.203.18',
    username: 'Administrator',
    password: 'hVCxR?NET4wtnKCGrPxVx4nn!JAeoIZF',
    os: 'windows'
  }
];

export default function PatchFrontend() {
  const [machines, setMachines] = useState(initialMachines);
  const [open, setOpen] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    ip: '',
    username: '',
    password: '',
    os: 'windows'
  });

  const [selectedMachine, setSelectedMachine] = useState(null); // Track machine selected

  const handleAddMachine = () => {
    setMachines([...machines, newMachine]);
    setNewMachine({ name: '', ip: '', username: '', password: '', os: 'windows' });
    setOpen(false);
  };

  // If a machine is selected, show PatchWindow instead
  if (selectedMachine) {
    return (
      <PatchWindow
        {...selectedMachine}
        onBack={() => setSelectedMachine(null)} // Custom prop for back action
      />
    );
  }

  return (
    <Box sx={{ bgcolor: '#121212', color: '#E0E0E0', minHeight: '100vh', p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#BB86FC' }}>
          Machines Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ borderColor: '#BB86FC', color: '#BB86FC', textTransform: 'none' }}
            onClick={() => console.log('Check all updates')}
          >
            Check All Updates
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#BB86FC', textTransform: 'none' }}
            onClick={() => setOpen(true)}
          >
            Add Machine
          </Button>
        </Box>
      </Box>

      {/* Grid of Machines */}
      <Grid container spacing={3}>
        {machines.map((machine, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                bgcolor: '#1E1E1E',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#2A2A2A' }
              }}
              onClick={() => setSelectedMachine(machine)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#BB86FC' }}>
                  {machine.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {machine.ip}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Machine Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent sx={{ bgcolor: '#1E1E1E' }}>
          <TextField
            label="Machine Name"
            fullWidth
            variant="standard"
            margin="dense"
            InputLabelProps={{ style: { color: '#BB86FC' } }}
            InputProps={{ style: { color: '#E0E0E0' } }}
            value={newMachine.name}
            onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
          />
          <TextField
            label="IP Address"
            fullWidth
            variant="standard"
            margin="dense"
            InputLabelProps={{ style: { color: '#BB86FC' } }}
            InputProps={{ style: { color: '#E0E0E0' } }}
            value={newMachine.ip}
            onChange={(e) => setNewMachine({ ...newMachine, ip: e.target.value })}
          />
          <TextField
            label="Username"
            fullWidth
            variant="standard"
            margin="dense"
            InputLabelProps={{ style: { color: '#BB86FC' } }}
            InputProps={{ style: { color: '#E0E0E0' } }}
            value={newMachine.username}
            onChange={(e) => setNewMachine({ ...newMachine, username: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            margin="dense"
            InputLabelProps={{ style: { color: '#BB86FC' } }}
            InputProps={{ style: { color: '#E0E0E0' } }}
            value={newMachine.password}
            onChange={(e) => setNewMachine({ ...newMachine, password: e.target.value })}
          />
          <TextField
            select
            label="Operating System"
            fullWidth
            variant="standard"
            margin="dense"
            InputLabelProps={{ style: { color: '#BB86FC' } }}
            InputProps={{ style: { color: '#E0E0E0' } }}
            value={newMachine.os}
            onChange={(e) => setNewMachine({ ...newMachine, os: e.target.value })}
          >
            <MenuItem value="windows">Windows</MenuItem>
            <MenuItem value="linux">Linux</MenuItem>
            <MenuItem value="mac">Mac</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#1E1E1E' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#BB86FC' }}>Cancel</Button>
          <Button onClick={handleAddMachine} sx={{ color: '#BB86FC' }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
