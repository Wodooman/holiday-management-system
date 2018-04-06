import { ActionCreator } from 'react-redux';
import { TypeKeys } from './typeKeys';

export interface ShowProgressAction {
    type: TypeKeys.SHOW_PROGRESS;
}

export interface HideProgressAction {
    type: TypeKeys.HIDE_PROGRESS;
}

export const showProgress: ActionCreator<ShowProgressAction> = () => ({
        type: TypeKeys.SHOW_PROGRESS
});

export const hideProgress: ActionCreator<HideProgressAction> = () => ({
        type: TypeKeys.HIDE_PROGRESS
});