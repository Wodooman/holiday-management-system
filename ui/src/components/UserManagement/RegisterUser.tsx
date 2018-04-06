import * as React from 'react';
import { Component, FormEvent } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { registerUser, RegisterUserAction } from '../../state/actions/userActions';
import * as validator from 'validator';
import * as PropTypes from 'prop-types';

// material-ui
import { TextField, Button } from 'material-ui';
import State from '../../state/reducers/State';
import { RouterChildContext } from 'react-router';
import CardPage from '../common/CardPage';
import SaveIcon from 'material-ui-icons/Save';

interface RegisterUserProps {
    registerUser: (userEmail: string, holidays: number) => Promise<RegisterUserAction>;
}

interface RegisterUserState {
    userEmail: string;
    holidays: number | null;
    isEmailValid: boolean;
    areHolidaysValid: boolean;
}

class RegisterUser extends Component<RegisterUserProps, RegisterUserState> {
    static contextTypes = {
        router: PropTypes.any.isRequired
    };

    context: RouterChildContext<{}>;

    constructor(props: RegisterUserProps) {
        super(props);

        this.state = {
            userEmail: '',
            holidays: null,
            isEmailValid: true,
            areHolidaysValid: true
        };
    }

    registerUser = async () => {
        if (!this.isFormValid()) {
            return;
        }

        let res = await this.props.registerUser(this.state.userEmail, this.state.holidays!);
        this.context.router.history.push(`/users/details/${res.user.id}`);
    }

    isFormValid = () => {
        return this.validateEmail() && this.validateHolidays();
    }

    validateEmail = () => {
        const isValid = validator.isEmail(this.state.userEmail);
        this.setState({ isEmailValid: isValid });
        return isValid;
    }

    validateHolidays = () => {
        const isValid = this.state.holidays !== null;
        this.setState({ areHolidaysValid: isValid });
        return isValid;
    }

    render() {
        return (
            <CardPage
                title="Register new user"
                actions={
                    <Button
                        onClick={this.registerUser}
                    >
                        Save
                        <SaveIcon />
                    </Button>
                }
            >
                <form>
                    <TextField
                        label="E-mail"
                        name="email"
                        helperText={this.state.isEmailValid ? null : 'This is not a correct e-mail address'}
                        error={!this.state.isEmailValid}
                        onChange={(ev: FormEvent<HTMLInputElement>) =>
                            this.setState({ userEmail: ev.currentTarget.value })}
                        onBlur={this.validateEmail}
                    />
                    <br />
                    <TextField
                        label="Holiday days"
                        type="number"
                        name="holidays"
                        error={!this.state.areHolidaysValid}
                        helperText={this.state.areHolidaysValid ? null : 'This field is required'}
                        onChange={(ev: FormEvent<HTMLInputElement>) =>
                            this.setState({
                                holidays: Number(ev.currentTarget.value)
                            })}
                        onBlur={this.validateHolidays}
                    />
                </form>
            </CardPage >
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
    registerUser: (userEmail: string, holidayDays: number) => dispatch(registerUser(userEmail, holidayDays))
});

export default connect(null, mapDispatchToProps)(RegisterUser);