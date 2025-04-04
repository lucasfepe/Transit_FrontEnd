// src/components/LogoutButton.jsx
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../utils";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <IconButton
            onClick={logout}
            color="inherit"
            sx={{ position: "absolute", top: 16, right: 16 }}
            aria-label="logout"
        >
            <LogoutIcon />
        </IconButton>
    );
};

export default LogoutButton;
