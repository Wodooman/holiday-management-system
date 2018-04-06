import { initialState } from './initialState';
import { TypeKeys } from './../actions/typeKeys';
import { ActionTypes } from '../actions/actionTypes';

export default function progressReducer(state: { show: boolean, counter: number } = initialState.progress,
                                        action: ActionTypes) {

    if (action.type === TypeKeys.SHOW_PROGRESS) {
        const counter = state.counter + 1;
        const show = counter > 0;
        state = Object.assign({}, { counter, show });
    } else if (action.type === TypeKeys.HIDE_PROGRESS) {
        const counter = state.counter - 1;
        const show = counter > 0;
        state = Object.assign({}, { counter, show });
    }

    return state;
}