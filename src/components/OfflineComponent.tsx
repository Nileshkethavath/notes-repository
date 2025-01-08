import React from 'react';
import { Box, Typography, Icon } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';

export const OfflineComponent: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      sx={{
        backgroundColor: '#f8f9fa',
        color: '#495057',
      }}
    >
      <Icon sx={{ fontSize: 80, color: '#6c757d', mb: 2 }}>
        <WifiOffIcon fontSize="inherit" />
      </Icon>
      <Typography variant="h4" sx={{ mb: 1 }}>
        No Internet Connection
      </Typography>
      <Typography variant="body1">
        Please check your connection and try again when you're back online.
      </Typography>
    </Box>
  );
};


