import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Select, MenuItem, FormControl, InputLabel, 
  Typography, Card, CardContent, Grid, Box
} from '@mui/material';

const BadgeManagement = ({ token, setError }) => {
  const [badges, setBadges] = useState([]);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    imageUrl: '',
    criteria: 'post_count',
    thresholds: [{ level: 1, value: 1 }]
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/api/badges', {
        headers: { 'x-auth-token': token }
      });
      setBadges(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || '获取徽章失败');
    }
  };

  const handleInputChange = (e) => {
    setNewBadge({ ...newBadge, [e.target.name]: e.target.value });
  };

  const handleThresholdChange = (index, field, value) => {
    const updatedThresholds = newBadge.thresholds.map((threshold, i) => 
      i === index ? { ...threshold, [field]: value } : threshold
    );
    setNewBadge({ ...newBadge, thresholds: updatedThresholds });
  };

  const addThreshold = () => {
    setNewBadge({
      ...newBadge,
      thresholds: [...newBadge.thresholds, { level: newBadge.thresholds.length + 1, value: 1 }]
    });
  };

  const createBadge = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/badges', newBadge, {
        headers: { 'x-auth-token': token }
      });
      fetchBadges();
      setNewBadge({
        name: '',
        description: '',
        imageUrl: '',
        criteria: 'post_count',
        thresholds: [{ level: 1, value: 1 }]
      });
    } catch (err) {
      setError(err.response?.data?.msg || '创建徽章失败');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>徽章管理</Typography>
      <form onSubmit={createBadge}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="徽章名称"
              value={newBadge.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="徽章描述"
              value={newBadge.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="imageUrl"
              label="徽章图片URL"
              value={newBadge.imageUrl}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>条件</InputLabel>
              <Select
                name="criteria"
                value={newBadge.criteria}
                onChange={handleInputChange}
              >
                <MenuItem value="post_count">发帖数量</MenuItem>
                <MenuItem value="comment_count">评论数量</MenuItem>
                <MenuItem value="like_count">获赞数量</MenuItem>
                <MenuItem value="follower_count">关注者数量</MenuItem>
                <MenuItem value="login_streak">连续登录天数</MenuItem>
                <MenuItem value="reputation">声誉值</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {newBadge.thresholds.map((threshold, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" justifyContent="space-between">
                <TextField
                  label="等级"
                  type="number"
                  value={threshold.level}
                  onChange={(e) => handleThresholdChange(index, 'level', parseInt(e.target.value))}
                  required
                />
                <TextField
                  label="阈值"
                  type="number"
                  value={threshold.value}
                  onChange={(e) => handleThresholdChange(index, 'value', parseInt(e.target.value))}
                  required
                />
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={addThreshold}>添加阈值</Button>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">创建徽章</Button>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>现有徽章</Typography>
      <Grid container spacing={2}>
        {badges.map(badge => (
          <Grid item xs={12} sm={6} key={badge._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{badge.name}</Typography>
                <Typography variant="body2">{badge.description}</Typography>
                <img src={badge.imageUrl} alt={badge.name} style={{ width: '50px', height: '50px' }} />
                <Typography>条件: {badge.criteria}</Typography>
                <Typography>阈值:</Typography>
                <ul>
                  {badge.thresholds.map((threshold, index) => (
                    <li key={index}>等级 {threshold.level}: {threshold.value}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BadgeManagement;