import * as React from 'react';
import { TextField, Button } from 'material-ui';
import User from '../../models/User';
import { connect, Dispatch } from 'react-redux';
import State from '../../state/reducers/State';
import { FormEvent } from 'react';
import CardPage from '../common/CardPage';
import { updateHolidays, UpdateHolidaysAction } from '../../state/actions/userActions';
import { RouterChildContext } from 'react-router';
import * as PropTypes from 'prop-types';
import * as validator from 'validator';
import SaveIcon from 'material-ui-icons/Save';

interface EditUsersHolidaysProps {
    user: User;
    updateHolidays: (userId: number, remaining: number, comment: string) => Promise<UpdateHolidaysAction>;
}

interface EditUsersHolidaysState {
    areHolidaysValid: boolean;
    isCommentValid: boolean;
    holidaysRemaining: number | undefined;
    comment: string;
}

class EditUsersHolidays extends React.Component<EditUsersHolidaysProps, EditUsersHolidaysState> {
    static contextTypes = {
        router: PropTypes.any.isRequired
    };
    context: RouterChildContext<{}>;
    private readonly minCommentLength = 3;

    constructor(props: EditUsersHolidaysProps) {
        super(props);

        // const user = this.props.user;

        this.state = ({
            areHolidaysValid: true,
            isCommentValid: true,
            holidaysRemaining: undefined, // (user && user.holidays) ? user.holidays.remaining : undefined,
            comment: ''
        });
    }

    validateHolidays: () => boolean = () => {
        const isValid = this.state.holidaysRemaining !== undefined;
        this.setState({ areHolidaysValid: isValid });
        return isValid;
    }

    validateComment: () => boolean = () => {
        const isValid = validator.isLength(this.state.comment, this.minCommentLength);
        this.setState({ isCommentValid: isValid });
        return isValid;
    }

    save = async () => {
        if (this.validateHolidays() && this.validateComment()) {
            await this.props.updateHolidays(this.props.user.id, this.state.holidaysRemaining!, this.state.comment);
            this.context.router.history.push('/users');
        }
    }

    render() {
        if (!this.props.user) {
            return (
                <div>
                    Please select user from users list
                </div>
            );
        }

        return (
            <CardPage
                title="Chage holidays"
                actions={
                    <Button
                        onClick={this.save}
                    >
                        Save
                    <SaveIcon />
                    </Button>
                }
            >
                <form>
                    <TextField
                        value={`${this.props.user.firstName} ${this.props.user.lastName}`}
                        label="Name"
                        disabled={true}
                    />
                    <br />
                    <TextField
                        value={this.props.user.email}
                        label="Email"
                        disabled={true}
                    />
                    <br />
                    <TextField
                        label="Holidays remaining"
                        type="number"
                        name="holidays"
                        helperText={this.state.areHolidaysValid ? null : 'This field is required'}
                        error={!this.state.areHolidaysValid}
                        onChange={(ev: FormEvent<HTMLInputElement>) =>
                            this.setState({
                                holidaysRemaining: Number(ev.currentTarget.value)
                            })}
                        onBlur={this.validateHolidays}
                        value={this.state.holidaysRemaining}
                    />
                    <br />
                    <TextField
                        label="Comment"
                        type="text"
                        helperText={this.state.isCommentValid ? null
                            : `Please add a comment with at least ${this.minCommentLength} characters`}
                        error={!this.state.isCommentValid}
                        onChange={(ev: FormEvent<HTMLInputElement>) =>
                            this.setState({
                                comment: ev.currentTarget.value
                            })}
                        onBlur={this.validateComment}
                    />
                </form>
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
    updateHolidays: (userId: number, remaining: number, comment: string) => dispatch(updateHolidays(userId, remaining, comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUsersHolidays);
