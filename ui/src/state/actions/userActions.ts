import { GetAllUsersAction } from './userActions';
import { TypeKeys } from './typeKeys';
import { showProgress, hideProgress } from './progressActions';
import UserService from '../../services/UserService';
import HolidayService from '../../services/HolidayService';
import User from '../../models/User';
import { Dispatch, ActionCreator } from 'react-redux';
import State from '../reducers/State';
import { ThunkAction } from 'redux-thunk';
import HolidayContainerContract from '../../services/api/contracts/HolidayContainerContract';

const userService = new UserService();
const holidayService = new HolidayService();

export interface RegisterUserAction {
    type: TypeKeys.REGISTER_USER;
    user: User;
}

export interface GetAllUsersAction {
    type: TypeKeys.GET_ALL_USERS;
    users: Array<User>;
}

export interface UpdateHolidaysAction {
    type: TypeKeys.UPDATE_HOLIDAYS;
    userId: number;
    holidaysRemaining: number;
}

export interface GetUserDetailsAction {
    type: TypeKeys.GET_USER_DETAILS;
    user: User;
}

export const registerUser: ActionCreator<ThunkAction<Promise<RegisterUserAction>, State, void>>
    = (userEmail: string, holidays: HolidayContainerContract) => {
        return async (dispatch: Dispatch<State>): Promise<RegisterUserAction> => {
            try {
                dispatch(showProgress());
                const user = await userService.registerUser(userEmail, holidays);
                dispatch(hideProgress());
                return dispatch(registerUserSuccess(user));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const registerUserSuccess: ActionCreator<RegisterUserAction> = (user: User) => ({
    type: TypeKeys.REGISTER_USER,
    user
});

export const getAllUsers: ActionCreator<ThunkAction<Promise<GetAllUsersAction>, State, void>> =
    () => {
        return async (dispatch: Dispatch<State>): Promise<GetAllUsersAction> => {
            try {
                dispatch(showProgress());
                const users = await userService.getAllUsers();
                dispatch(hideProgress());
                return dispatch(getAllUsersSuccess(users));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const updateHolidays: ActionCreator<ThunkAction<Promise<UpdateHolidaysAction>, State, void>> =
    (userId: number, holidaysRemaining: number, comment: string) => {
        return async (dispatch: Dispatch<State>, getState): Promise<UpdateHolidaysAction> => {
            try {
                dispatch(showProgress());
                await userService.updateHolidays(userId, holidaysRemaining, comment);
                dispatch(hideProgress());
                return dispatch(updateHolidaysSuccess(userId, holidaysRemaining));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const updateHolidaysSuccess: ActionCreator<UpdateHolidaysAction>
    = (usersId: number, holidaysRemaining: number) => ({
        type: TypeKeys.UPDATE_HOLIDAYS,
        userId: usersId,
        holidaysRemaining
    });

export const getAllUsersSuccess: ActionCreator<GetAllUsersAction> = (users: Array<User>) => ({
    type: TypeKeys.GET_ALL_USERS,
    users
});

export const getUserDeatails: ActionCreator<ThunkAction<Promise<GetUserDetailsAction>, State, void>> =
    (id: number) => {
        return async (dispatch: Dispatch<State>): Promise<GetUserDetailsAction> => {
            try {
                dispatch(showProgress());
                const user = await userService.getUserDeatails(id);
                user.holidayContainer = await holidayService.getHolidayContainer(id);
                user.requests = await holidayService.getHolidayRequestsForUser(id);
                dispatch(hideProgress());
                return dispatch(getUserDetailsSuccess(user));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const getUserDetailsSuccess: ActionCreator<GetUserDetailsAction> = (user: User) => ({
    type: TypeKeys.GET_USER_DETAILS,
    user
});