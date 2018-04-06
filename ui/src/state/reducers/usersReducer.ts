import { initialState } from './initialState';
import { TypeKeys } from './../actions/typeKeys';
import { Reducer } from 'redux';
import { ActionTypes } from '../actions/actionTypes';
import User from '../../models/User';
import HolidayContainer from '../../models/HolidayContainer';

export const usersReducer: Reducer<Array<User>> = (users: Array<User> = initialState.users, action: ActionTypes) => {

    switch (action.type) {
        case TypeKeys.REGISTER_USER:
            users = [...users, action.user];
            break;
        case TypeKeys.GET_ALL_USERS:
            users = action.users;
            break;
        case TypeKeys.UPDATE_HOLIDAYS:
            const updatedUser = Object.assign({}, users.find(u => u.id === action.userId)!);
            updatedUser.holidayContainer = new HolidayContainer(action.userId);
            users = [
                ...users.filter(u => u.id !== action.userId),
                updatedUser
            ];
            break;
        case TypeKeys.GET_USER_DETAILS:
            let newUsers = users.filter(c => c.id !== action.user.id);
            users = [...newUsers, action.user];
            break;
        default:
            break;
    }
    return users;
};