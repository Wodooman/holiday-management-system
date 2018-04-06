import * as React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

// material ui
import Drawer from 'material-ui/Drawer';
import { Grid, List } from 'material-ui';
import ListItem from 'material-ui/List/ListItem';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import UserListIcon from 'material-ui-icons/List';
import ListItemIcon from 'material-ui/List/ListItemIcon';
import ListItemText from 'material-ui/List/ListItemText';

interface SidebarProps {
    isDrawerOpen: boolean;
}

class Sidebar extends React.PureComponent<SidebarProps, {}> {
    render() {
        return (
            <Grid item={true} >
                <Drawer
                    open={this.props.isDrawerOpen}
                    anchor="left"
                    className="drawer"
                    variant="persistent"
                >
                    <List>
                        <Link to="/users" className="menu-item" >
                            <ListItem button={true}>
                                <ListItemIcon>
                                    <UserListIcon />
                                </ListItemIcon>
                                <ListItemText inset={true} primary="User List" />
                            </ListItem>
                        </Link>
                        <Link to="/users/register" className="menu-item" >
                            <ListItem button={true}>
                                <ListItemIcon>
                                    <PersonAddIcon />
                                </ListItemIcon>
                                <ListItemText inset={true} primary="Register User" />
                            </ListItem>
                        </Link>
                        <Link to="/holidayRequests" className="menu-item" >
                            <ListItem button={true}>
                                <ListItemIcon>
                                    <UserListIcon />
                                </ListItemIcon>
                                <ListItemText inset={true} primary="Holiday Requests List" />
                            </ListItem>
                        </Link>
                    </List>
                </Drawer >
            </Grid>);
    }
}

export default Sidebar;
