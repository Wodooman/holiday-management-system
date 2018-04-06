import {  RegisterUserAction, GetAllUsersAction, UpdateHolidaysAction, GetUserDetailsAction } from './userActions';
import {  CreateRequestAction, GetAllRequestsAction } from './holidayActions';
import { TypeKeys } from './typeKeys';
import { ToggleDrawerAction } from './drawerActions';
import { ShowProgressAction, HideProgressAction } from './progressActions';

export type ActionTypes =
    | ToggleDrawerAction
    | ShowProgressAction
    | HideProgressAction
    | RegisterUserAction
    | GetAllUsersAction
    | UpdateHolidaysAction
    | OtherActions
    | CreateRequestAction
    | GetAllRequestsAction
    | GetUserDetailsAction;

export interface OtherActions {
    type: TypeKeys.OTHER_ACTION;
}