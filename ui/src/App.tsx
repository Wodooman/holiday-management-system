import * as React from 'react';
import { Component, Fragment } from 'react';
import RegisterUser from './components/UserManagement/RegisterUser';
import UserDetailed from './components/UserManagement/UserDetailed';
import UserDashboard from './components/UserManagement/UserDashboard';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import { ToggleDrawerAction, toggleDrawer } from './state/actions/drawerActions';
import './styles/app.css';
import { connect } from 'react-redux';

// material-ui
import State from './state/reducers/State';
import { Dispatch } from 'react-redux';
import UsersList from './components/UserManagement/UsersList';
import { Grid } from 'material-ui';
import AppHeader from './components/AppHeader';
import EditUsersHolidays from './components/UserManagement/EditUsersHolidays';
import AddRequest from './components/HolidayManagement/AddRequest';
import RequestsList from './components/HolidayManagement/RequestsList';

export interface AppProps {
  isDrawerOpen: boolean;
  toggleDrawer: (isOpen: boolean) => ToggleDrawerAction;
  showProgress: boolean;
}

class App extends Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);
  }

  toggleDrawer = () => {
    this.props.toggleDrawer(!this.props.isDrawerOpen);
  }

  render() {
    return (
      <Router>
        <Fragment>
          <AppHeader showProgress={this.props.showProgress} toggleDrawer={this.toggleDrawer} />
          <Grid container={true} style={{paddingTop: 80}}>
            <Sidebar
              isDrawerOpen={this.props.isDrawerOpen}
            />
            <Grid item={true} xs={10} className="root" style={this.props.isDrawerOpen ? { marginLeft: '210px' } : { marginLeft: '30px' }}>
              <Route exact={true} path="/" component={Home} />
              <Route exact={true} path="/users/register" component={RegisterUser} />
              <Route exact={true} path="/users/details/:id" component={UserDetailed} />
              <Route exact={true} path="/users/view/:id" component={UserDashboard} />
              <Route exact={true} path="/users" component={UsersList} />
              <Route exact={true} path="/holidayRequests" component={RequestsList} />
              <Route exact={true} path="/holidayRequests/create/:id" component={AddRequest} />
              <Route exact={true} path="/users/edit/:id" component={EditUsersHolidays} />
            </Grid>
          </Grid>
        </Fragment>
      </Router >
    );
  }
}

const mapStateToProps = (state: State, ownProps: {}) => ({
  isDrawerOpen: state.isDrawerOpen,
  showProgress: state.progress.counter > 0
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  toggleDrawer: (isOpen: boolean) => dispatch(toggleDrawer(isOpen))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
