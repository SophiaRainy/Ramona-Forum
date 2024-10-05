import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button } from '@mui/material';

const AnnouncementModal = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get('/api/announcements/active');
      if (res.data) {
        setAnnouncement(res.data);
        setOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch announcement:', err);
    }
  };

  const handleClose = () => setOpen(false);

  if (!announcement) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="announcement-modal-title"
      aria-describedby="announcement-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="announcement-modal-title" variant="h6" component="h2">
          {announcement.title}
        </Typography>
        <Typography id="announcement-modal-description" sx={{ mt: 2 }}>
          {announcement.content}
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }}>关闭</Button>
      </Box>
    </Modal>
  );
};

export default AnnouncementModal;