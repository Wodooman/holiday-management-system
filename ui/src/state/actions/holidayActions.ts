import { TypeKeys } from './typeKeys';
import { showProgress, hideProgress } from './progressActions';
import HolidayService from '../../services/HolidayService';
import HolidayRequest from '../../models/HolidayRequest';
import { Dispatch, ActionCreator } from 'react-redux';
import State from '../reducers/State';
import { ThunkAction } from 'redux-thunk';

const holidayService = new HolidayService();

export interface CreateRequestAction {
    type: TypeKeys.CREATE_REQUEST;
    holidayRequest: HolidayRequest;
}

export interface GetAllRequestsAction {
    type: TypeKeys.GET_ALL_REQUESTS;
    requests: Array<HolidayRequest>;
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

export const getAllRequests: ActionCreator<ThunkAction<Promise<GetAllRequestsAction>, State, void>> =
    () => {
        return async (dispatch: Dispatch<State>): Promise<GetAllRequestsAction> => {
            try {
                dispatch(showProgress());
                const requests = await holidayService.getAllHolidayRequests();
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

export interface CancelHolidayRequestAction {
    type: TypeKeys.CANCEL_HOLIDAY_REQUEST;
    holidayRequestId: string;
}

export const cancelHolidayRequest: ActionCreator<ThunkAction<Promise<CancelHolidayRequestAction>, State, void>> =
    (holidayRequestId: string) => {
        return async (dispatch: Dispatch<State>, getState): Promise<CancelHolidayRequestAction> => {
            try {
                dispatch(showProgress());
                await holidayService.cancelHolidayRequest(holidayRequestId);
                dispatch(hideProgress());
                return dispatch(cancelHolidayRequestSuccess(holidayRequestId));
            } catch (error) {
                dispatch(hideProgress());
                throw error;
            }
        };
    };

export const cancelHolidayRequestSuccess: ActionCreator<CancelHolidayRequestAction>
    = (holidayRequestId: string) => ({
        type: TypeKeys.CANCEL_HOLIDAY_REQUEST,
        holidayRequestId: holidayRequestId
    });