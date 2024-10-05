import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Typography, Card, CardContent, Grid, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AnnouncementManagement = ({ token, setError }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    startDate: new Date(),
    endDate: new Date(),
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('/api/announcements', {
        headers: { 'x-auth-token': token }
      });
      setAnnouncements(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取公告失败');
    }
  };

  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name) => (date) => {
    setNewAnnouncement({ ...newAnnouncement, [name]: date });
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/announcements', newAnnouncement, {
        headers: { 'x-auth-token': token }
      });
      fetchAnnouncements();
      setNewAnnouncement({
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(),
      });
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.msg || '创建公告失败');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>公告管理</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        创建新公告
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell>开始日期</TableCell>
              <TableCell>结束日期</TableCell>
              <TableCell>状态</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement._id}>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{new Date(announcement.startDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(announcement.endDate).toLocaleString()}</TableCell>
                <TableCell>{announcement.isActive ? '活跃' : '已结束'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>创建新公告</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="title"
            label="公告标题"
            value={newAnnouncement.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="content"
            label="公告内容"
            multiline
            rows={4}
            value={newAnnouncement.content}
            onChange={handleInputChange}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="开始日期"
              value={newAnnouncement.startDate}
              onChange={handleDateChange('startDate')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <DateTimePicker
              label="结束日期"
              value={newAnnouncement.endDate}
              onChange={handleDateChange('endDate')}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={createAnnouncement} variant="contained" color="primary">
            创建
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementManagement;