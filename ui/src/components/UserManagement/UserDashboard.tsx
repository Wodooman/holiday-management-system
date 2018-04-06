import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import User from '../../models/User';
import State from '../../state/reducers/State';
import CardPage from '../common/CardPage';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { getUserDeatails, GetUserDetailsAction } from '../../state/actions/userActions';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import * as Formatter from '../../utilities/Formatter';

interface UserDashboardProps {
    user: User;
    getUserDeatails: (id: number) => Promise<GetUserDetailsAction>;
    match: any;
}

class UserDashboard extends React.Component<UserDashboardProps, {}> {
    static contextTypes = {
        router: PropTypes.any.isRequired
    };
    context: RouterChildContext<{}>;
    constructor(props: UserDashboardProps) {
        super(props);
    }

    async componentDidMount() {
        const userId = this.props.match.params.id ? Number(this.props.match.params.id) : 0;
        await this.props.getUserDeatails(userId);

        this.setState({ isLoading: false });
    }

    addRequestClick(event: Event) {
        event.preventDefault();
        this.context.router.history.push(`/holidayRequests/create/${this.props.user.id}`);
    }

    render() {
        if (!this.props.user) {
            return (
                <div>
                    Loading information...
                </div>
            );
        }
        return (
            <CardPage title={this.props.user.firstName + ' ' + this.props.user.lastName}>
                    <h2>User Info</h2>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>E-mail</TableCell>
                                <TableCell>{this.props.user.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Holidays per year</TableCell>
                                <TableCell>{this.props.user.holidayContainer ? 
                                    Formatter.resolveHolidayAmountType(this.props.user.holidayContainer.holidaysPerYear) : ''}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Is First Month Counted</TableCell>
                                <TableCell>
                                    {this.props.user.holidayContainer ? 
                                        Formatter.formatBoolean(this.props.user.holidayContainer.isFirstMonthCounted) : ''}
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Is New Employee</TableCell>
                                <TableCell>
                                    {this.props.user.holidayContainer ? Formatter.formatBoolean(this.props.user.holidayContainer.isNewEmployee) : ''}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Start Date</TableCell>
                                <TableCell>
                                    {this.props.user.holidayContainer ? Formatter.formatDate(this.props.user.holidayContainer.startDate) : ''}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <br />
                    <h2>Summary</h2>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Available</TableCell>
                                <TableCell>Taken</TableCell>
                                <TableCell>Sum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { this.props.user.holidayContainer && this.props.user.holidayContainer.categories 
                                ? this.props.user.holidayContainer.categories.map(n => 
                                    <TableRow key={n.category}>
                                        <TableCell>{Formatter.resolveHolidayType(n.category)}</TableCell>
                                        <TableCell>{n.available}</TableCell>
                                        <TableCell>{n.taken}</TableCell>
                                        <TableCell>{n.sum}</TableCell>
                                    </TableRow>
                            ) : ''} 
                        </TableBody>
                    </Table>
                    <h2>Holidays</h2>
                    <Button variant="fab" color="primary" aria-label="add" onClick={this.addRequestClick.bind(this)}>
                        <AddIcon />
                    </Button>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Days</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Creation date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { this.props.user.requests ? this.props.user.requests.map(n => 
                                    <TableRow key={n._id}>
                                        <TableCell>
                                            {Formatter.formatDate(n.startDate)}
                                        </TableCell>
                                        <TableCell>
                                            {Formatter.formatDate(n.endDate)}
                                        </TableCell>
                                        <TableCell>{n.days}</TableCell>
                                        <TableCell>{Formatter.resolveHolidayType(n.type)}</TableCell>
                                        <TableCell>{n.comment}</TableCell>
                                        <TableCell>
                                            {Formatter.formatDate(n.creationDate)}
                                        </TableCell>
                                    </TableRow>
                            ) : ''} 
                        </TableBody>
                    </Table>
            </CardPage>
        );
    }
}

// tslint:disable-next-line:no-any
const mapStateToProps = (state: State, ownProps: any) => {
    const userId = ownProps.match.params.id ? Number(ownProps.match.params.id) : 0;
    const user = state.users.find(u => u.id === userId);
    return {
        user
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    getUserDeatails: (id: Number) => dispatch(getUserDeatails(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
