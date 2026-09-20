const initialState = {
    items: [],
    isLoading: false,
    error: null
};

const advertsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADVERTS_LOADING':
            return { ...state, isLoading: true };
        case 'ADVERTS_SUCCESS':
            return { ...state, items: action.payload, isLoading: false };
        case 'ADVERTS_ERROR':
            return { ...state, error: action.error, isLoading: false };
        default:
            return state;
    }
};

export default advertsReducer;
