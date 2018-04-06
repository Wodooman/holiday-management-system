import { TypeKeys } from './typeKeys';
import { ActionCreator } from 'react-redux';

export interface ToggleDrawerAction {
    type: TypeKeys.DRAWER_TOGGLE;
    isOpen: boolean;
}

export const toggleDrawer: ActionCreator<ToggleDrawerAction> = (isOpen: boolean): ToggleDrawerAction => ({
    type: TypeKeys.DRAWER_TOGGLE,
    isOpen
});