import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import CardPage from '../common/CardPage';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'material-ui';

import State from '../../state/reducers/State';
import HolidayRequest from '../../models/HolidayRequest';
import { getAllRequests, GetAllRequestsAction } from '../../state/actions/holidayActions';

import * as Formatter from '../../utilities/Formatter';

interface RequestsListProps {
    requests: Array<HolidayRequest>;
    getAllRequests: () => Promise<GetAllRequestsAction>;
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
        // if (this.props.requests.length === 0) {
        await this.props.getAllRequests();
        // }
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.requests.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.userId}</TableCell>
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
    getAllRequests: () => dispatch(getAllRequests())
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestList);
