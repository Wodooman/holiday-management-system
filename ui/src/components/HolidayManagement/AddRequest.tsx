import * as React from 'react';
import { Component, FormEvent } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
// import * as validator from 'validator';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';

// material-ui
import { Button, TextField, Select, MenuItem } from 'material-ui';
import SaveIcon from 'material-ui-icons/Save';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import State from '../../state/reducers/State';
import CardPage from '../common/CardPage';
import { createHolidayRequest, CreateRequestAction } from '../../state/actions/holidayActions';
import RequestTypes from '../../dictionaries/RequestTypes';
import RequestType from '../../models/RequestType';

import InfiniteCalendar, {
    Calendar,
    withRange,
  } from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // Make sure to import the default stylesheet
const CalendarWithRange = withRange(Calendar);

interface AddRequestProps {
    createRequest: (userId: number, startDate: Date, endDate: Date, days: number, type: string, comment: string, creationDate: Date) 
    => Promise<CreateRequestAction>;
    match: any;
}

interface CreateRequestState {
    userId: number | null;
    startDate: Date | null;
    endDate: Date | null;
    days: number | null;
    type: string;
    comment: string | null;
    areHolidaysValid: boolean;
    isTypeValid: boolean;
    minDate: Date;
    maxDate: Date;
}

class AddRequest extends Component<AddRequestProps, CreateRequestState> {
    static contextTypes = {
        router: PropTypes.any.isRequired
    };

    context: RouterChildContext<{}>;

    constructor(props: AddRequestProps) {
        super(props);
        
        let today = new Date();
        let yearStart = new Date(today.getFullYear(), 0, 1);
        let yearEnd = new Date(today.getFullYear() + 1, 0, 0);

        const userId = this.props.match.params.id ? Number(this.props.match.params.id) : 0;

        this.state = {
            userId: userId,
            startDate: new Date(),
            endDate: new Date(),
            days: null,
            type: '',
            comment: null,
            areHolidaysValid: true,
            isTypeValid: true,
            minDate: yearStart,
            maxDate: yearEnd
        };
    }

    createRequest = async () => {
        if (!this.isFormValid()) {
            return;
        }

        await this.props.createRequest(
            this.state.userId!, this.state.startDate!, this.state.endDate!, this.state.days!, this.state.type!, this.state.comment!, new Date());
        this.context.router.history.push(`/users/view/${this.state.userId}`);
    }

    isFormValid = () => {
        let isTypeValid = this.validateType();
        let areHolidaysValid = this.validateHolidays();
        return isTypeValid && areHolidaysValid;
    }

    validateHolidays = () => {
        const isValid = this.state.days !== null;
        this.setState({ areHolidaysValid: isValid });
        return isValid;
    }

    validateType = () => {
        const isValid = this.state.type !== null && this.state.type !== '';
        this.setState({ isTypeValid: isValid });
        return isValid;
    }

    getRequestTypes(): Array<RequestType> {
        return RequestTypes().filter(c => c.id !== 'holidayFromPrevYear');
    }

    render() {
        const style = {
            formControl: {
                minWidth: 150
              }
        };

        return (
            <CardPage
                title="Create Leave Request"
                actions={
                    <Button
                        onClick={this.createRequest}
                    >
                        Save
                        <SaveIcon />
                    </Button>
                }
            >
            
                        <FormControl style={style.formControl} error={!this.state.isTypeValid}>
                            <InputLabel htmlFor="holiday-type-input">Type</InputLabel>
                            <Select
                                value={this.state.type}
                                onChange={(ev) =>
                                    this.setState({ type: ev.target.value }, () => {this.validateType(); })}
                                input={<Input id="holiday-type-input" />}
                            >
                                {this.getRequestTypes().map(requestType => 
                                    <MenuItem key={requestType.id} value={requestType.id}>{requestType.Name}</MenuItem>    
                                )}
                                }
                            </Select>
                            <FormHelperText>{this.state.isTypeValid ? '' : 'This field is required'}</FormHelperText>
                        </FormControl>
                        <br />
                        <InfiniteCalendar
                            Component={CalendarWithRange}
                            min={this.state.minDate}
                            max={this.state.maxDate}
                            height={300}
                            locale={{
                                headerFormat: 'MMM Do',
                            }}
                            selected={{
                                start: this.state.startDate,
                                end: this.state.endDate,
                            }}
                            displayOptions={{}}
                            onSelect={(selectedDate) => {
                                if (selectedDate.eventType === 3) { // 3 = Selection done
                                    this.setState({ startDate: selectedDate.start, endDate: selectedDate.end });
                                }
                            }}
                        />
                        <br />
                        <TextField
                            label="Holiday days"
                            type="number"
                            name="days"
                            error={!this.state.areHolidaysValid}
                            helperText={this.state.areHolidaysValid ? null : 'This field is required'}
                            onChange={(ev: FormEvent<HTMLInputElement>) =>
                                this.setState({ days: Number(ev.currentTarget.value)}, () => this.validateHolidays())}
                        />
                        <br />
                        <TextField
                            label="Comment"
                            name="comment"
                            onChange={(ev: FormEvent<HTMLInputElement>) =>
                                this.setState({ comment: ev.currentTarget.value })}
                        />
            </CardPage >
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    createRequest: (userId: number, startDate: Date, endDate: Date, days: number, type: string, comment: string, creationDate: Date) => 
        dispatch(createHolidayRequest(userId, startDate, endDate, days, type, comment, creationDate))
});

export default (connect(null, mapDispatchToProps)(AddRequest));