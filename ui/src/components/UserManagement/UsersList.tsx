import * as React from 'react';
import User from '../../models/User';
import State from '../../state/reducers/State';
import { Dispatch } from 'redux';
import { getAllUsers, GetAllUsersAction } from '../../state/actions/userActions';
import { connect } from 'react-redux';
import CardPage from '../common/CardPage';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton } from 'material-ui';
import EditIcon from 'material-ui-icons/Edit';
import ViewIcon from 'material-ui-icons/AccountCircle';
import { Link } from 'react-router-dom';

interface UserListProps {
    users: Array<User>;
    getAllUsers: () => Promise<GetAllUsersAction>;
}

interface UserListState {
    isLoading: boolean;
}

class UserList extends React.Component<UserListProps, UserListState> {
    constructor(props: UserListProps) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    async componentDidMount() {
        if (this.props.users.length === 0) {
            await this.props.getAllUsers();
        }
        this.setState({ isLoading: false });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    Loading users...
                </div>
            );
        }
        return (
            <CardPage
                title="Users list"
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.users.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell>
                                    <Link to={`/users/edit/${row.id}`} className="linkButton">
                                        <IconButton aria-label="Edit">
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <Link to={`/users/view/${row.id}`} className="linkButton">
                                        <IconButton aria-label="View">
                                            <ViewIcon />
                                        </IconButton>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardPage>
        );
    }
}

const mapStateToProps = (state: State, ownProps: {}) => ({
    users: state.users
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    getAllUsers: () => dispatch(getAllUsers())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
