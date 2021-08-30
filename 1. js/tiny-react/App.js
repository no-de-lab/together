/* @jsx createElement */

import {createElement, render} from './tinyReact';

function Hello(props){
    return <li className="item">{props.label}</li>
}

function App(){
    return (
        <div>
            <h1>hello world</h1>
            <ul className="board" onClick={() => null}>
                <Hello label="Hello" />
                <Hello label="World" />
                <Hello label="React" />
            </ul>
        </div>
    )
}

render(<App />, document.getElementById("root"))