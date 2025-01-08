import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { useToastContext } from "./ToastContext";


const AutoCloseToast: React.FC = () => {

  const toastContext = useToastContext();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === "clickaway") return; 
    toastContext?.setOpen(false); 
  };

  return (
    <Snackbar
      open={toastContext?.open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} 
      TransitionComponent={(props) => <Slide {...props} direction="up" />} 
      sx={{
        "& .MuiPaper-root": {
          boxShadow: "0px 2px 5px -2px black", 
        },
        "& .MuiAlert-icon": {
            color:'white'
        },
      }}
    >
      <Alert
        severity="success"
        sx={{
            width: "100%",
            backgroundColor: "#61ca69", 
            color: "white", 
            fontWeight: "bold", 
        }}
      >
        {toastContext?.message}
      </Alert>
    </Snackbar>
  );
};

export default AutoCloseToast;
