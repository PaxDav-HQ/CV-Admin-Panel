const initState = {
    currency: 'NGN',
    rates: { 
        NGN: 1
    }
}

const CurrencyReducer = (state=initState, action)=>{
    // return state
    switch(action.type){
        case 'SET_CURRENCY':
            return {
                ...state,
                currency: action.payload
            }
        case 'SET_EXCHANGE_RATE':
            return {
                ...state,
                rates: action.payload
            }
        default:
            return state
    }
}

export default CurrencyReducer