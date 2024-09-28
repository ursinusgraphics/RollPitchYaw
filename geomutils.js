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
 */
function fromZRotation(theta) {
  let s = Math.sin(theta);
  let c = Math.cos(theta); // Perform axis-specific matrix multiplication
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}



/**

 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} ret
 */

function quat2Rot(q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ret[0] = 1 - yy - zz;
  ret[1] = yx + wz;
  ret[2] = zx - wy;
  ret[4] = yx - wz;
  ret[5] = 1 - xx - zz;
  ret[6] = zy + wx;
  ret[8] = zx + wy;
  ret[9] = zy - wx;
  ret[10] = 1 - xx - yy;
  ret[15] = 1;
  return ret;
}


/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} Quaternion of the rotation component
 */

function rot2Quat(mat) {
  let ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let sm11 = mat[0];
  let sm12 = mat[1];
  let sm13 = mat[2];
  let sm21 = mat[4];
  let sm22 = mat[5];
  let sm23 = mat[6];
  let sm31 = mat[8];
  let sm32 = mat[9];
  let sm33 = mat[10];
  let trace = sm11 + sm22 + sm33;
  let S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    ret[3] = 0.25 * S;
    ret[0] = (sm23 - sm32) / S;
    ret[1] = (sm31 - sm13) / S;
    ret[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    ret[3] = (sm23 - sm32) / S;
    ret[0] = 0.25 * S;
    ret[1] = (sm12 + sm21) / S;
    ret[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    ret[3] = (sm31 - sm13) / S;
    ret[0] = (sm12 + sm21) / S;
    ret[1] = 0.25 * S;
    ret[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    ret[3] = (sm12 - sm21) / S;
    ret[0] = (sm31 + sm13) / S;
    ret[1] = (sm23 + sm32) / S;
    ret[2] = 0.25 * S;
  }
  return ret;
}

function yawPitchRoll2Rot(yawAngle, pitchAngle, rollAngle) {
  let rotYaw = fromYRotation(yawAngle);
  let rotPitch = fromXRotation(pitchAngle);
  let rotRoll = fromZRotation(rollAngle);

  let R = mat4.create();
  mat4.multiply(R, R, rotYaw);
  mat4.multiply(R, R, rotPitch);
  mat4.multiply(R, R, rotRoll);
  return {"rotYaw":rotYaw, "rotPitch":rotPitch, "rotRoll":rotRoll, "R":R};
}