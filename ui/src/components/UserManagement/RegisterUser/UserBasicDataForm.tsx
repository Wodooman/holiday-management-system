import * as React from 'react';
import FormControl from '../../common/FormControl';
import { TextField, Select, MenuItem, Input, Grid } from 'material-ui';
import { ChangeEvent, FormEvent } from 'react';
import { DatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';

export interface UserBasicDataProps {
    isEmailValid: boolean;
    onEmailChange: (event: FormEvent<HTMLInputElement>) => void;
    validateEmail: () => boolean;
    holidaysPerYear: number;
    onHolidaysPerYearChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    isNewEmployee: boolean;
    onIsNewEmployeeChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    startDate: Date | Moment;
    onStartDateChange: (date: Date | Moment) => void;
    isFirstMonthCounted: boolean;
    onIsFirstMonthCountedChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export default class UserBasicDataForm extends React.PureComponent<UserBasicDataProps, {}> {
    render() {
        return (
            <Grid item={true} xs={12} style={{marginBottom: '3em'}}>
                <FormControl>
                    <TextField
                        label="E-mail"
                        name="email"
                        helperText={this.props.isEmailValid ? null : 'This is not a correct e-mail address'}
                        error={!this.props.isEmailValid}
                        onChange={this.props.onEmailChange}
                        onBlur={this.props.validateEmail}
                    />
                </FormControl>
                <FormControl label="Holidays per year" >
                    <Select
                        value={this.props.holidaysPerYear}
                        onChange={this.props.onHolidaysPerYearChange}
                        input={<Input />}
                    >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={26}>26</MenuItem>
                    </Select>
                </FormControl>
                <FormControl label="Is new employee?" >
                    <Select
                        value={this.props.isNewEmployee ? 1 : 0}
                        onChange={this.props.onIsNewEmployeeChange}
                        input={<Input />}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <DatePicker
                        keyboard={true}
                        clearable={true}
                        label="Start date"
                        maxDateMessage="Date must be less than today"
                        value={this.props.startDate}
                        onChange={this.props.onStartDateChange}
                        animateYearScrolling={false}
                    />
                </FormControl>
                <FormControl label="Is first month counted?" >
                    <Select
                        value={this.props.isFirstMonthCounted ? 1 : 0}
                        onChange={this.props.onIsFirstMonthCountedChange}
                        input={<Input />}
                    >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        );
    }
}
