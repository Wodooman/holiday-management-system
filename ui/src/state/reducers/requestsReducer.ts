import { initialState } from './initialState';
import { TypeKeys } from './../actions/typeKeys';
import { Reducer } from 'redux';
import { ActionTypes } from '../actions/actionTypes';
import HolidayRequest from '../../models/HolidayRequest';

export const requestsReducer: Reducer<Array<HolidayRequest>> = (requests: Array<HolidayRequest> = initialState.requests, action: ActionTypes) => {

    switch (action.type) {
        case TypeKeys.CREATE_REQUEST:
            requests = [...requests, action.holidayRequest];
            break;
        case TypeKeys.GET_ALL_REQUESTS:
            requests = action.requests;
            break;
        default:
            break;
    }
    return requests;
};