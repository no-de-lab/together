## redux? 

- 중앙 스토어 하나를 가지고 있고 이는 객체
- 기본 컨셉은 상태를 사용은 하되 변경할 수 없게 한다.(클로저)
- 컴포넌트가 상태를 직접 바꾸면 다른 컴포넌트가 그 영향을 받기 때문이다.
- 상태를 변경하는 코드는 개발자가 만들고, 이 함수를 리듀서라고 한다. 상태가 바뀔 때 리듀서 함수를 호출하면 현 상태를 리듀서 함수에 넘긴다.

## 만들기
1. 전역으로 활용할 수 있는 저장소를 만들고
2. 상태를 직접적으로 바꿀 수 없게끔 클로저를 이용해 state를 은닉화한다.
3. createStore를 통해 store를 생성할 수 있고, getState를 이용해 상태를 볼 수 있다. 객체에 직접 접근하는 것은 해당 객체를 변경하거나 오염시킬 수 있으므로, immutable하게 객체 복사를 활용해 오염을 줄이자.
4. 원하는 의도에 따라 상태를 변경하고자 할 때, 변경 메서드로만 만들어본다.
5. 이것저것 함수가 계속 생기는데, 그때마다 redux.js의 코드를 수정하게 되면 변경의 여파가 redux.js 를 사용하는 모든 곳에 미친다. 좀 더 안전하게 사용하기 위해서는, 이를 추상화하는 과정이 필요하다.
변경 로직을 사용자측에 받는 쪽으로 변경해야한다. 이를 위해 createStore에서 비즈니스 로직을 받아야한다. 이를 reducer라고 한다. 
6. 변경 로직을 외부에서 호출하기 위해 dispatch라는 메서드를 만들고, 상태에 반영될 수 있게끔 한다.
7. 만약 특정값 자체를 정해놓고 시작하고 싶다면, 객체 방식으로 action 명령어를 만들기
8. class를 이용해서 Action 객체를 redux.js에 만들고, action명령을 Action 객체에서만 받을 수 있게 하여 실수의 여지를 줄일 수 있다.
9. 상태의 변경이 만들어졌다면, 상태가 변경됐을 때 반응할 수 있는 함수들을 추가할 수 있게 subscribe를 만들어야한다. 중복을 줄이려면 Set을 이용하는 것도 방법! 

## 특징
- 오직 순수함수여야하는 reducer, 아무런 외부 의존성 없이 내부적으로 동작돼야한다.
- 동일한 요청을 한번 보내는 것과 여러번 연속으로 보내는 것이 같은 효과를 지니고, 서버의 상태도 동일하게 남을 때, 해당 http 메서드가 멱등성을 가졌다고 말한다. 
- 리듀서는 실행할 때마다 결과가 일정하지 않을 수 없다. 비동기 작업(api 호출)과 같은 것들이 순수하지 않은 작업이라고 할 수 있는데, reducer는 동기적 로직으로 동작하기에, reducer자체로는 가능하지 않다. 
- 이 때 미들웨어를 사용한다. 
- 이 미들웨어란, 데이터 흐름 속에서 중간에 데이터가 거치게 하는 것을 말함. 따라서, 순서에 의존성이 존재하는 미들웨어는 적용시 조심! 

* 금번에는 미들웨어까지 리덕스에 적용하지는 않음.

## 미들웨어의 형태 
```javascript
const myMiddleWare = store => dispatch => action => {
    dispatch(action)
}

const yourMiddleWare(store) {
    return function(dispatch){
        return function(action){
            dispatch(action)
        }
    }
}

const outMiddleWare(store, dispatch, action){
    dispatch(action)
}
```
- 리덕스에서 지연 호출에 대한 부분을 알려준다. 
- 3가지 위의 미들웨어는 모두 dispatch(action)이라는 점에서 동일하지만,
- 인자 하나하나 받는 함수의 중첨과 인자 3개를 받는 것의 차이이다. 
- 클로저가 있기에 인자를 1개씩 받을 수 있고, 이렇게 한개씩 받는 것을 커링이라고 한다. 

* 이 커링을 쓰는 이유는, 액션이 들어왔을 때, 어떤 액션이 들어왔는지를 확인하고자 하기에
-> 그게 아니라면 dispatch이전에 콘솔 찍거나 해서 일일이 확인하게 되는데, 이후 코드 변경 및 빌드하는 과정이 모두 비용이다. 

```javascript
// 제작자
const add1 = function(a, b) {
    return a + b;
}

const add2 = function(a) {
    return function(b) {
        return a + b;
    }
}

// 사용자
add1(10, 20);	// 중간에 개입할 수가 없다.
add2(10)(20);	// 중간에 개입할 수 있다.


// 몽키패칭을 할 수 있는 구조인 것이다.
const addTen = add2(10);
// do something
addTen(20);
```

- 커링은 인자와 인자 사이 사용자가 개입할 수 있게끔 해준다. 
- 이를 통해 미들웨어를 만들면 리덕스가 원하는대로 이 미들웨어를 가져다가 원하는 것을 만들어낼 수 있다 ! 

## 미들웨어 구현

```javascript
const logger = store => next => action => {
    let result = next(action)
    return result;
}

const crashReporter = store => next => action => {
    try {
        return next(action)
    }catch(err){
        throw err;
    }
}
```

이를 통해 미들웨어를 store에 넣어주면, 모든 디스패치를 할 때마다 미들웨어도 함께 동작한다. 
- redux-saga의 경우, 액션이 디스패치 됐는데, 그것이 비동기 혹은 api 호출이라면, 사가가 next를 안하고 ajax를 한다. 비동기 응답이 오면 next를 한다.