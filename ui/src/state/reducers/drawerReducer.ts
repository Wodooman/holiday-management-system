import { TypeKeys } from './../actions/typeKeys';
import { ActionTypes } from '../actions/actionTypes';

export default function drawerReducer(state: boolean = false, action: ActionTypes) {
    if (action.type === TypeKeys.DRAWER_TOGGLE) {
        state = action.isOpen;
    }

    return state;
}