// src/components/LogoutButton.jsx
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../utils";
import {Box} from "@mui/material";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
      
     <Box
     component="img"
     src="/logo.png"
     alt="Logo"
     sx={{ position: "absolute", top: 16, left: 16,
       display: 'block',
       maxWidth: '50px', // Adjust this value based on your needs
       width: '100%',
       height: 'auto',
       marginBottom: 2, // Adds some space between the image and the text below
     }}
   />);
};

export default LogoutButton;
