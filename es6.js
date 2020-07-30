function move({ x, y } = { x: 0, y: 0 }) {
    return x + y;
}
move({ x: 1, y: 2 }) // 1,2
move({ x: 1 }) //1,undefine
move({}) //undefine undefine
move() //0，0