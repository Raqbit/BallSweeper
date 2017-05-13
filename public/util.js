function create2DArray(width, height) {
    let array = new Array(width);

    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(height);
    }

    return array;
}