/**
 * Creates a matrix from the given angle around the X axis
 *
 * @param {Number} theta the angle to rotate the matrix by
 */
function fromXRotation(theta) {
    let s = Math.sin(theta);
    let c = Math.cos(theta);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

/**
 * Creates a matrix from the given angle around the Y axis
 *
 * @param {Number} theta the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(theta) {
    let s = Math.sin(theta);
    let c = Math.cos(theta); // Perform axis-specific matrix multiplication
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

/**
 * Creates a matrix from the given angle around the Z axis
 * 
 * @param {Number} theta the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(theta) {
    let s = Math.sin(theta);
    let c = Math.cos(theta); // Perform axis-specific matrix multiplication
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}