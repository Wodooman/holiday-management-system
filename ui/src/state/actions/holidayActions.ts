import { TypeKeys } from './typeKeys';
import { showProgress, hideProgress } from './progressActions';
import HolidayService from '../../services/HolidayService';
import UserService from '../../services/UserService';
import HolidayRequest from '../../models/HolidayRequest';
import { Dispatch, ActionCreator } from 'react-redux';
import State from '../reducers/State';
import { ThunkAction } from 'redux-thunk';

const holidayService = new HolidayService();
const userService = new UserService();

export interface CreateRequestAction {
    type: TypeKeys.CREATE_REQUEST;
    holidayRequest: HolidayRequest;
}

export const createHolidayRequest: ActionCreator<ThunkAction<Promise<CreateRequestAction>, State, void>>
    = (userId: number, startDate: Date, endDate: Date, days: number, type: string, comment: string, creationDate: Date) => {
        return async (dispatch: Dispatch<State>): Promise<CreateRequestAction> => {
            try {
                dispatch(showProgress());
                const holidayRequest = await holidayService.createHolidayRequest(userId, startDate, endDate, days, type, comment, creationDate);
                dispatch(hideProgress());
                return dispatch(createHolidayRequestSuccess(holidayRequest));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const createHolidayRequestSuccess: ActionCreator<CreateRequestAction> = (holidayRequest: HolidayRequest) => ({
    type: TypeKeys.CREATE_REQUEST,
    holidayRequest
});

export interface GetAllRequestsAction {
    type: TypeKeys.GET_ALL_REQUESTS;
    requests: Array<HolidayRequest>;
}

export const getAllRequests: ActionCreator<ThunkAction<Promise<GetAllRequestsAction>, State, void>> =
    () => {
        return async (dispatch: Dispatch<State>): Promise<GetAllRequestsAction> => {
            try {
                dispatch(showProgress());
                let requests = await holidayService.getAllHolidayRequests();
                let users = await userService.getAllUsers();
                requests.forEach((request: HolidayRequest)  => {
                    request.user = users.find(u => u.id === request.userId);
                });

                dispatch(hideProgress());
                return dispatch(getAllRequestsSuccess(requests));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const getAllRequestsSuccess: ActionCreator<GetAllRequestsAction> = (requests: Array<HolidayRequest>) => ({
    type: TypeKeys.GET_ALL_REQUESTS,
    requests
});

export interface ChangeHolidayRequestStatusAction {
    type: TypeKeys.CHANGE_HOLIDAY_REQUEST_STATUS;
    holidayRequestId: string;
    status: string;
}

export const changeHolidayRequestStatus: ActionCreator<ThunkAction<Promise<ChangeHolidayRequestStatusAction>, State, void>> =
    (holidayRequestId: string, status: string) => {
        return async (dispatch: Dispatch<State>, getState): Promise<ChangeHolidayRequestStatusAction> => {
            try {
                dispatch(showProgress());
                await holidayService.changeHolidayRequestStatus(holidayRequestId, status);
                dispatch(hideProgress());
                return dispatch(changeHolidayRequestStatusSuccess(holidayRequestId));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const changeHolidayRequestStatusSuccess: ActionCreator<ChangeHolidayRequestStatusAction>
    = (holidayRequestId: string, status: string) => ({
        type: TypeKeys.CHANGE_HOLIDAY_REQUEST_STATUS,
        holidayRequestId: holidayRequestId,
        status: status
    });