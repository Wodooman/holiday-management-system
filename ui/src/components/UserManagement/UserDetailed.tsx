import * as React from 'react';
import User from '../../models/User';
import { connect } from 'react-redux';
import State from '../../state/reducers/State';
import { Fragment } from 'react';
import CardPage from '../common/CardPage';
import { TextField } from 'material-ui';

interface UserDetailedProps {
    user: User;
}

class UserDetailed extends React.Component<UserDetailedProps, {}> {

    render() {
        if (!this.props.user) {
            return (
                <div>
                    Loading user details...
                </div>
            );
        }
        return (
            <CardPage title="User details">
                    <TextField
                        value={this.props.user.firstName}
                        label="First Name"
                        disabled={true}
                    />
                    <br />
                    <TextField
                        value={this.props.user.lastName}
                        label="Last Name"
                        disabled={true}
                    />
                    <br />
                    <TextField
                        value={this.props.user.email}
                        label="E-mail"
                        disabled={true}
                    />
                    <br />
                    {this.props.user.holidayContainer &&
                        <Fragment>
                            {/* <TextField
                                value={this.props.user.holidays.remaining}
                                label="Holidays remaining"
                                disabled={true}
                            />
                            <br />
                            <TextField
                                value={this.props.user.holidays.taken}
                                label="Holidays taken"
                                disabled={true}
                            /> */}
                        </Fragment>
                    }
            </CardPage>
        );
    }
}

// tslint:disable-next-line:no-any
const mapStateToProps = (state: State, ownProps: any) => {
    const user = state.users.find(u => u.id === ownProps.match.params.id);
    return {
        user
    };

};

export default connect(mapStateToProps)(UserDetailed);
