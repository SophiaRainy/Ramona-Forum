import React from 'react';
import BadgeManagement from './BadgeManagement';
import AnnouncementManagement from './AnnouncementManagement';
import { Typography, Container, Box, Tabs, Tab } from '@mui/material';

const AdminDashboard = ({ token, setError }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          管理员面板
        </Typography>
        <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
          <Tab label="徽章管理" />
          <Tab label="公告管理" />
        </Tabs>
        {value === 0 && <BadgeManagement token={token} setError={setError} />}
        {value === 1 && <AnnouncementManagement token={token} setError={setError} />}
      </Box>
    </Container>
  );
};

export default AdminDashboard;