import * as React from 'react';
import { Fragment } from 'react';
import { Toolbar, IconButton, Typography, AppBar } from 'material-ui';
import ProgressBar from './common/ProgressBar';
import MenuIcon from 'material-ui-icons/Menu';

import '../styles/appHeader.css';

export interface AppBarProps {
    showProgress: boolean;
    toggleDrawer: () => void;
}

class AppHeader extends React.PureComponent<AppBarProps, {}> {
    render() {
        return (
            <Fragment>
                <AppBar
                    position="fixed"
                    className="app-bar"
                >
                    <Toolbar>
                        <IconButton aria-label="Menu">
                            <MenuIcon onClick={this.props.toggleDrawer} />
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            Holiday System
                        </Typography>
                    </Toolbar>
                </AppBar>
                <ProgressBar showProgress={this.props.showProgress} />
            </Fragment>
        );
    }
}

export default AppHeader;
