// import "./sidebar.scss";

// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

// import { Link } from "react-router-dom";

// import { Grid } from "@mui/material";

// const Sidebar = () => {
//     return (

//     <Grid item xs={2}  position="sticky">
//         <div className="sidebar" >
//             <div className="center">
//                 <ul >
//                     <Link to="/users" style={{ textDecoration: "none" }}>
//                         <li>
//                             <PersonOutlineIcon className="icon" />
//                             <span>Users</span>
//                         </li>
//                     </Link>
//                     <Link to="/products" style={{ textDecoration: "none" }}>
//                         <li>
//                             <StoreIcon className="icon" />
//                             <span>Services</span>
//                         </li>
//                     </Link>
//                 </ul>
//             </div>

//         </div>
//     </Grid>
//     );
// };

// export default Sidebar;


import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

const Sidebar = () => {
    const { isLogin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Navigation moved here
    };

    return (
        <div className="sidebar">
            <div className="center">
                <ul>
                    <Link to="/home" style={{ textDecoration: "none" }}>
                        <li>
                            <HomeIcon className="icon" />
                            <span>Home</span>
                        </li>
                    </Link>

                    {isLogin ? (
                        <>
                            <Link to="/users" style={{ textDecoration: "none" }}>
                                <li>
                                    <PersonOutlineIcon className="icon" />
                                    <span>Users</span>
                                </li>
                            </Link>
                            <Link to="/products" style={{ textDecoration: "none" }}>
                                <li>
                                    <StoreIcon className="icon" />
                                    <span>Services</span>
                                </li>
                            </Link>
                            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                                <LogoutIcon className="icon" />
                                <span>Logout</span>
                            </li>
                        </>
                    ) : (
                        <Link to="/login" style={{ textDecoration: "none" }}>
                            <li>
                                <LoginIcon className="icon" />
                                <span>Login</span>
                            </li>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;