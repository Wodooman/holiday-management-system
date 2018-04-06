import { usersReducer } from './usersReducer';
import { requestsReducer } from './requestsReducer';
import { combineReducers } from 'redux';
import isDrawerOpen from './drawerReducer';
import progress from './progressReducer';

const rootReducer = combineReducers({
    isDrawerOpen,
    progress,
    users: usersReducer,
    requests: requestsReducer
});

export default rootReducer;