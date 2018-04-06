import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import State from '../reducers/State';

export default function configureStore(initialState?: State) {
    return createStore(
        rootReducer,
        initialState,        
        composeWithDevTools(
            applyMiddleware(thunk, reduxImmutableStateInvariant())
        )
    );
}