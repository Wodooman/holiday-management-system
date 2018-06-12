import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import CardPage from '../common/CardPage';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import Check from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Cancel';

import State from '../../state/reducers/State';
import HolidayRequest from '../../models/HolidayRequest';
import { getAllRequests, GetAllRequestsAction } from '../../state/actions/holidayActions';
import { changeHolidayRequestStatus, ChangeHolidayRequestStatusAction } from '../../state/actions/holidayActions';
import * as HolidayRequestStatuses from '../../dictionaries/HolidayRequestStatuses';
import * as Formatter from '../../utilities/Formatter';

interface RequestsListProps {
    requests: Array<HolidayRequest>;
    getAllRequests: () => Promise<GetAllRequestsAction>;
    changeHolidayRequestStatus: (id: string, status: string) => Promise<ChangeHolidayRequestStatusAction>;
}

interface RequestListState {
    isLoading: boolean;
}

class RequestList extends React.Component<RequestsListProps, RequestListState> {
    constructor(props: RequestsListProps) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    async componentDidMount() {
        await this.props.getAllRequests();
        this.setState({ isLoading: false });
    }

    async approveClick(id: string, event: Event) {
        await this.handleClick(id, event, HolidayRequestStatuses.StatusesIds.approved);
    }

    async rejectClick(id: string, event: Event) {
        await this.handleClick(id, event, HolidayRequestStatuses.StatusesIds.rejected);
    }

    async handleClick(id: string, event: Event, newState: string) {
        event.preventDefault();
        this.setState({ isLoading: true });
        await this.props.changeHolidayRequestStatus(id, newState);
        await this.props.getAllRequests();
        this.setState({ isLoading: false });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    Loading requests...
                </div>
            );
        }
        return (
            <CardPage
                title="Requests list"
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Creation date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.requests.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.user ? (row.user.firstName + ' ' + row.user.lastName) : ''}</TableCell>
                                <TableCell>
                                {row.startDate !== null ? Formatter.formatDate(row.startDate) : ''}
                                </TableCell>
                                <TableCell>
                                {row.endDate !== null ? Formatter.formatDate(row.endDate) : ''}
                                </TableCell>
                                <TableCell>{row.days}</TableCell>
                                <TableCell>{Formatter.resolveHolidayType(row.type)}</TableCell>
                                <TableCell>{row.comment}</TableCell>
                                <TableCell>
                                {row.creationDate !== null ? Formatter.formatDate(row.creationDate) : ''}
                                </TableCell>
                                <TableCell>{Formatter.resolveHolidayRequestStatus(row.status)}</TableCell>
                                <TableCell>
                                    {(row.status === 'waitingForApprove') && 
                                        <div>
                                            <IconButton color="primary" aria-label="Approve" onClick={this.approveClick.bind(this, row._id)}>
                                                <Check />
                                            </IconButton>
                                            &nbsp;
                                            <IconButton color="secondary" aria-label="Reject" onClick={this.rejectClick.bind(this, row._id)}>
                                                <Cancel />
                                            </IconButton>
                                        </div>
                                    }
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
    requests: state.requests
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    getAllRequests: () => dispatch(getAllRequests()),
    changeHolidayRequestStatus: (id: string, status: string) => dispatch(changeHolidayRequestStatus(id, status))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestList);
