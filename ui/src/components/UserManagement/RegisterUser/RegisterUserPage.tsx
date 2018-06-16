import * as React from 'react';
import { Component, FormEvent, ChangeEvent } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { registerUser, RegisterUserAction } from '../../../state/actions/userActions';
import * as validator from 'validator';
import * as PropTypes from 'prop-types';
import { Button, Grid } from 'material-ui';
import State from '../../../state/reducers/State';
import { RouterChildContext } from 'react-router';
import CardPage from '../../common/CardPage';
import SaveIcon from 'material-ui-icons/Save';
import { Moment } from 'moment';
import UserBasicData from './UserBasicDataForm';
import AvailableHolidaysForm from './AvailableHolidaysForm';
import { TakenHolidaysForm } from './TakenHolidaysForm';
import HolidayContainerContract from '../../../services/api/contracts/HolidayContainerContract';
import HolidayCategory from '../../../services/api/contracts/HolidayCategory';
import HolidayContainerRowContract from '../../../services/api/contracts/HolidayContainerRowContract';
import * as _ from 'lodash';

interface RegisterUserProps {
  registerUser: (userEmail: string, holidays: HolidayContainerContract) => Promise<RegisterUserAction>;
}

interface RegisterUserState {
  userEmail: string;
  isEmailValid: boolean;
  holidaysPerYear: number;
  isNewEmployee: boolean;
  isFirstMonthCounted: boolean;
  startDate: Date | Moment;
  available: {
    category: HolidayCategory;
    available: number;
  }[];
  taken: {
    category: HolidayCategory;
    taken: number;
  }[];
}

class RegisterUserPage extends Component<RegisterUserProps, RegisterUserState> {
  static contextTypes = {
    router: PropTypes.any.isRequired
  };

  context: RouterChildContext<{}>;

  constructor(props: RegisterUserProps) {
    super(props);

    this.state = {
      userEmail: '',
      isEmailValid: true,
      holidaysPerYear: 26,
      isNewEmployee: true,
      startDate: new Date(),
      isFirstMonthCounted: true,
      available: [],
      taken: []
    };
  }

  registerUser = async () => {
    if (!this.isFormValid()) {
      return;
    }

    const holidayContainerContract: HolidayContainerContract = {
      holidaysPerYear: this.state.holidaysPerYear.toString(),
      startDate: this.state.startDate.toString(),
      isFirstMonthCounted: this.state.isFirstMonthCounted,
      isNewEmployee: this.state.isNewEmployee,
      categories: this.getCategories(),
    };

    let res = await this.props.registerUser(this.state.userEmail, holidayContainerContract);
    this.context.router.history.push(`/users/details/${res.user.id}`);
  }

  getCategories(): HolidayContainerRowContract[] {
    const result: HolidayContainerRowContract[] = [];
    const holidays: { category: HolidayCategory, taken?: number, available?: number }[]
      = [...this.state.available, ...this.state.taken];
    const groupedByCat = _.groupBy(holidays, h => h.category);
    for (const holidayCat in groupedByCat) {
      if (groupedByCat.hasOwnProperty(holidayCat)) {
        const holidayRow = Object.assign({}, ...groupedByCat[holidayCat]);
        holidayRow.sum = holidayRow.available && holidayRow.taken ?
          holidayRow.available - holidayRow.taken :
          (holidayRow.available ? holidayRow.available : holidayRow.taken);
        result.push(holidayRow);
      }
    }

    return result;
  }

  isFormValid = () => {
    return this.validateEmail();
  }

  validateEmail = () => {
    const isValid = validator.isEmail(this.state.userEmail);
    this.setState({ isEmailValid: isValid });
    return isValid;
  }

  updateTaken(category: HolidayCategory, taken: number) {
    const holidays = this.state.taken.slice();
    const categoryIndex = holidays.findIndex(h => h.category === category);
    if (categoryIndex > -1) {
      holidays.splice(categoryIndex, 1, { category, taken });
    } else {
      holidays.push({ category, taken });
    }

    const partialUpdate = { taken: holidays } as Pick<RegisterUserState, 'taken'>;
    this.setState(partialUpdate);
  }
  
  updateAvailable(category: HolidayCategory, available: number) {
    const holidays = this.state.available.slice();
    const categoryIndex = holidays.findIndex(h => h.category === category);
    if (categoryIndex > -1) {
      holidays.splice(categoryIndex, 1, { category, available });
    } else {
      holidays.push({ category, available });
    }

    const partialUpdate = { available: holidays } as Pick<RegisterUserState, 'available'>;
    this.setState(partialUpdate);
  }

  render() {
    return (
      <CardPage
        title="Register new user"
        actions={
          <Button onClick={this.registerUser}>
            Save <SaveIcon />
          </Button>}
      >
        <form>
          <UserBasicData
            onEmailChange={(ev: FormEvent<HTMLInputElement>) =>
              this.setState({ userEmail: ev.currentTarget.value })}
            startDate={this.state.startDate}
            onStartDateChange={startDate => this.setState({ startDate })}
            holidaysPerYear={this.state.holidaysPerYear}
            isEmailValid={this.state.isEmailValid}
            isFirstMonthCounted={this.state.isFirstMonthCounted}
            validateEmail={this.validateEmail}
            onHolidaysPerYearChange={(ev: ChangeEvent<HTMLInputElement>) =>
              this.setState({ holidaysPerYear: Number(ev.currentTarget.value) })}
            isNewEmployee={this.state.isNewEmployee}
            onIsNewEmployeeChange={(ev: ChangeEvent<HTMLInputElement>) =>
              this.setState({ isNewEmployee: Boolean(ev.currentTarget.value) })}
            onIsFirstMonthCountedChange={(ev: ChangeEvent<HTMLInputElement>) =>
              this.setState({ isFirstMonthCounted: Boolean(ev.currentTarget.value) })}
          />

          {!this.state.isNewEmployee &&
            <Grid container={true}>
              <AvailableHolidaysForm
                isVisible={!this.state.isNewEmployee}
                onMovedFromPreviousYearChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  this.updateAvailable('FromPreviousYear', Number(ev.currentTarget.value))}
                onOtherChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  this.updateAvailable('Other', Number(ev.currentTarget.value))}
                onOvertimesChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  this.updateAvailable('Overtime', Number(ev.currentTarget.value))}
              />

              <TakenHolidaysForm
                isVisible={!this.state.isNewEmployee}
                onMovedFromPreviousChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  this.updateTaken('FromPreviousYear', Number(ev.currentTarget.value))}
                onTakenChange={(ev: FormEvent<HTMLInputElement>) =>
                  this.updateTaken('Normal', Number(ev.currentTarget.value))}
                onOnRequestChange={(ev: FormEvent<HTMLInputElement>) =>
                  this.updateTaken('OnRequest', Number(ev.currentTarget.value))}
                onNotPaidChange={(ev: FormEvent<HTMLInputElement>) =>
                  this.updateTaken('NotPaid', Number(ev.currentTarget.value))}
                onOtherChange={(ev: FormEvent<HTMLInputElement>) =>
                  this.updateTaken('Other', Number(ev.currentTarget.value))}
                onForOvertimesChange={(ev: FormEvent<HTMLInputElement>) =>
                  this.updateTaken('Overtime', Number(ev.currentTarget.value))}
              />
            </Grid>
          }
        </form>
      </CardPage >
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  registerUser: (userEmail: string, holidays: HolidayContainerContract) => dispatch(registerUser(userEmail, holidays))
});

export default connect(null, mapDispatchToProps)(RegisterUserPage);