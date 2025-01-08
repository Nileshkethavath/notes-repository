import { Box, Divider, Typography } from '@mui/material';
export const Error = () => {

  return (
    <Box
      display={'flex'}
      alignContent={'center'}
      justifyContent={'center'}
      flexWrap={'wrap'}
      height={'100vh'}
      width={'100vw'}
      sx={{
        backgroundColor: 'rgb(0 0 0 / 25%)',
      }}
    >
      <Box
        sx={() => ({
          width: '400px',
          backgroundColor: 'white',
          borderRadius: '8px',
          animation: 'jump 600ms ease-out',
          boxShadow: '0px 4px 15px -2px rgba(0, 0, 0, 0.3)',
          '@keyframes jump': {
            '0%': { transform: 'translateX(5px)' },
            '10%': { transform: 'translateX(-10px)' },
            '20%': { transform: 'translateX(9px)' },
            '30%': { transform: 'translateX(-8px)' },
            '40%': { transform: 'translateX(7px)' },
            '50%': { transform: 'translateX(-6px)' },
            '60%': { transform: 'translateX(5px)' },
            '70%': { transform: 'translateX(-4px)' },
            '80%': { transform: 'translateX(3px)' },
            '90%': { transform: 'translateX(-2px)' },
            '100%': { transform: 'translateX(1px)' },
          },
        })}
      >
        {/* Header */}
        <Typography
          variant="h6"
          bgcolor={'#f4f4f4'}
          sx={{
            fontWeight: '700',
            color: '#d32f2f',
            marginBottom: 1,
            textAlign: 'center',
            padding: 2,
            margin: '0px',
            borderRadius: '8px',
          }}
        >
          Invalid Note
        </Typography>

        <Divider />


        <Typography
          variant="body1"
          sx={{
            color: '#333',
            textAlign: 'center',
            padding:'8px 0px 0px 0px'
          }}
        >
          The URL does not meet the naming conventions.
        </Typography>


        <Box
          component="ul"
          sx={{
            listStyleType: 'disc',
            margin: '8px 16px',
            color: '#555',
            
          }}
        >
          <Typography
            component="li"
            variant="body2"
            sx={{
              marginBottom: 1,
              fontWeight: 500,
            }}
          >
            It must be 10 to 25 characters long.
          </Typography>
          <Typography
            component="li"
            variant="body2"
            sx={{
              marginBottom: 0,
              fontWeight: 500,
            }}
          >
            It should contain only letters and numbers.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
