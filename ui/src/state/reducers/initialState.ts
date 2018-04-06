import State from './State';

export const initialState: State = {
    isDrawerOpen: false,
    progress: {
        show: false,
        counter: 0
    },
    users: [],
    requests: []
};