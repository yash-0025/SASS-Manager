import "./sidebar.scss";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { Link } from "react-router-dom";

import { Grid } from "@mui/material";

const Sidebar = () => {
    return (

    <Grid item xs={2}  position="sticky">
        <div className="sidebar" >
            <div className="center">
                <ul >
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
                </ul>
            </div>

        </div>
    </Grid>
    );
};

export default Sidebar;