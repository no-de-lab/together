const makeFreezeObj = (originObj = Object.create(null), newObj) => {
    return Object.freeze({...originObj, ...newObj})
}

export const createStore = (reducer) => {
    let state;
    const getState = () => ({...state})

    const listeners = new Set();
    const subscribe = (fn) => listeners.add(fn);
    const publish = () => listeners.forEach((listener) => listener());

    const dispatch = (action) => {
        if(!(action instanceof Action)) throw Error('action 은 Action 객체여야 한다')
        state = reducer(state, action)
        publish();
    }
    return {getState, dispatch, subscribe};
}

export class Action {
    constructor(type, otherState){
        if(type === undefined) throw Error('type은 반드시 있어야 합니다.')

        this.type = type;
        Object.assign(this, otherState)
    }
}