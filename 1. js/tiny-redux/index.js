import {createStore, makeFreezeObj, Action} from './redux.js'

const reducer = (state = makeFreezeObj(), action) => {
    switch(action.type){
        case 'increment' : return makeFreezeObj(state, {count: (state.count?? 1)+1})
        case 'reset': return makeFreezeObj(state, {count:action.resetValue??1})
        default: throw new Error('등록되지 않은 action')
    }
}
const state = createStore(reducer);

state.subscribe(() => console.log(state.getState().count))

state.dispatch(new Action('increment'))
state.dispatch(new Action('reset', {resetValue:0}))