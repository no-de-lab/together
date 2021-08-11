function renderElement(node){
    if(typeof node === "string"){
        return document.createTextNode(node)
    }
    const el = document.createElement(node.type);

    // 레이아웃 과정 진행하는 것, 재귀 호출
    node.children.map(renderElement).forEach(element => {
        el.appendChild(element)
    })

    return el;
}

export function render(vdom, container){
    container.appendChild(renderElement(vdom))
}
// 이게 가상돔이라고 봐주면 된다.
export function createElement(type, props, ...children){
    if(typeof type === "function"){
        return type.apply(null, [props, ...children]);
    }
    return {type, props, children}
}