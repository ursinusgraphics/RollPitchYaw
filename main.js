$('body').on('contextmenu', '#MainGLCanvas', function(e){ return false; }); //Need this to disable the menu that pops up on right clicking
var glcanvas = document.getElementById("MainGLCanvas");
GimbalCanvas(glcanvas);//Add fields to glcanvas that help with rendering
glcanvas.mesh.loadFile("Airbusa380.off");
glcanvas.initGimbals();

const calpha1 = document.getElementById("calpha1");
const calpha2 = document.getElementById("calpha2");
const salphapos = document.getElementById("salphapos");
const salphaneg = document.getElementById("salphaneg");

const cbeta1 = document.getElementById("cbeta1");
const cbeta2 = document.getElementById("cbeta2");
const sbetapos = document.getElementById("sbetapos");
const sbetaneg = document.getElementById("sbetaneg");

const cgamma1 = document.getElementById("cgamma1");
const cgamma2 = document.getElementById("cgamma2");
const sgammapos = document.getElementById("sgammapos");
const sgammaneg = document.getElementById("sgammaneg");

let rEntries = [];
for (let i = 0; i < 3; i++) {
    rEntries.push([]);
    for (let j = 0; j < 3; j++) {
        rEntries[i].push(document.getElementById("r"+i+""+j))
    }
}


var displayPlaneCheckbox = document.getElementById('displayPlaneCheckbox');
displayPlaneCheckbox.addEventListener('change', function(e) {
    glcanvas.displayPlane = displayPlaneCheckbox.checked;
    requestAnimFrame(glcanvas.repaint);
});
displayPlaneCheckbox.checked = true;

var displayGimbalsCheckbox = document.getElementById('displayGimbalsCheckbox');
displayGimbalsCheckbox.addEventListener('change', function(e) {
    glcanvas.displayGimbals = displayGimbalsCheckbox.checked;
    requestAnimFrame(glcanvas.repaint);
});
displayGimbalsCheckbox.checked = true;

var displayAxesCheckbox = document.getElementById('displayAxesCheckbox');
displayAxesCheckbox.addEventListener('change', function(e) {
    glcanvas.displayAxes = displayAxesCheckbox.checked;
    requestAnimFrame(glcanvas.repaint);
});
displayAxesCheckbox.checked = true;

//Yaw stuff
var yawSlider = document.getElementById('yawSlider');
var yawTxt = document.getElementById('yawTxt');
yawSlider.addEventListener('input', function(e) {
    glcanvas.yawAngle = 2*Math.PI*yawSlider.value/1000.0;
    yawTxt.value = "" + (glcanvas.yawAngle*180.0/Math.PI).toFixed(1);
    requestAnimFrame(glcanvas.repaint);
});
function callYawSet() {
    glcanvas.yawAngle = Math.PI*parseFloat(yawTxt.value)/180.0;
    yawSlider.value = glcanvas.yawAngle*1000/(2*Math.PI);
    requestAnimFrame(glcanvas.repaint);
}

//Pitch stuff
var pitchSlider = document.getElementById('pitchSlider');
var pitchTxt = document.getElementById('pitchTxt');
pitchSlider.addEventListener('input', function(e) {
    glcanvas.pitchAngle = 2*Math.PI*pitchSlider.value/1000.0;
    pitchTxt.value = "" + (glcanvas.pitchAngle*180.0/Math.PI).toFixed(1);
    requestAnimFrame(glcanvas.repaint);
});
function callPitchSet() {
    glcanvas.pitchAngle = Math.PI*parseFloat(pitchTxt.value)/180.0;
    pitchSlider.value = glcanvas.pitchAngle*1000/(2*Math.PI);
    requestAnimFrame(glcanvas.repaint);
}

//Roll stuff
var rollSlider = document.getElementById('rollSlider');
var rollTxt = document.getElementById('rollTxt');
rollSlider.addEventListener('input', function(e) {
    glcanvas.rollAngle = 2*Math.PI*rollSlider.value/1000.0;
    rollTxt.value = "" + (glcanvas.rollAngle*180.0/Math.PI).toFixed(1);
    requestAnimFrame(glcanvas.repaint);
});
function callRollSet() {
    glcanvas.rollAngle = Math.PI*parseFloat(rollTxt.value)/180.0;
    rollSlider.value = glcanvas.rollAngle*1000/(2*Math.PI);
    requestAnimFrame(glcanvas.repaint);
}
requestAnimFrame(glcanvas.repaint);


//Put some initial values in the textboxes and sliders
yawTxt.value = "0";
callYawSet();
pitchTxt.value = "0";
callPitchSet();
rollTxt.value = "0";
callRollSet();

//Animation functions
var yaw1 = document.getElementById('yaw1');
var pitch1 = document.getElementById('pitch1');
var roll1 = document.getElementById('roll1');
var yaw2 = document.getElementById('yaw2');
var pitch2 = document.getElementById('pitch2');
var roll2 = document.getElementById('roll2');
function callOrientation1SetCurrent() {
    yaw1.value = yawTxt.value;
    pitch1.value = pitchTxt.value;
    roll1.value = rollTxt.value;
}
function callOrientation2SetCurrent() {
    yaw2.value = yawTxt.value;
    pitch2.value = pitchTxt.value;
    roll2.value = rollTxt.value;
}

function updateSliders() {
    yawTxt.value = "" + (glcanvas.yawAngle*180.0/Math.PI).toFixed(1);
    yawSlider.value = glcanvas.yawAngle * 1000.0/(2*Math.PI);
    pitchTxt.value = "" + (glcanvas.pitchAngle*180.0/Math.PI).toFixed(1);
    pitchSlider.value = glcanvas.pitchAngle * 1000.0/(2*Math.PI);
    rollTxt.value = "" + (glcanvas.rollAngle*180.0/Math.PI).toFixed(1);
    rollSlider.value = glcanvas.rollAngle * 1000.0/(2*Math.PI);
}


function doALERPAnimationStep() {
    var currTime = (new Date()).getTime();
    var dT = (currTime - startTime) / 1000.0;
    if (dT > totalTime) {
        animating = false;
        dT = 1;
    }
    else {
        dT = dT/totalTime;
    }

    glcanvas.yawAngle = (1-dT)*y1 + dT*y2;
    glcanvas.pitchAngle = (1-dT)*p1 + dT*p2;
    glcanvas.rollAngle = (1-dT)*r1 + dT*r2;
    updateSliders();
    glcanvas.repaint();
    if (animating) {
        requestAnimFrame(doALERPAnimationStep);
    }
}

function doSLERPAnimationStep() {
    var currTime = (new Date()).getTime();
    var dT = (currTime - startTime) / 1000.0;
    if (dT > totalTime) {
        animating = false;
        dT = 1;
    }
    else {
        dT = dT/totalTime;
    }
    glcanvas.yawAngle = (1-dT)*y1 + dT*y2;
    glcanvas.pitchAngle = (1-dT)*p1 + dT*p2;
    glcanvas.rollAngle = (1-dT)*r1 + dT*r2;

    let q = quat.slerp(quat.create(), q1, q2, dT);
    let R = quat2Rot(q);
    let R11 = R[0], R21 = R[1], R31 = R[2];
    let R12 = R[4], R22 = R[5], R32 = R[6];
    let R13 = R[8], R23 = R[9], R33 = R[10];
    glcanvas.yawAngle = Math.atan2(R13, R33);
    if (glcanvas.yawAngle < 0) {
        glcanvas.yawAngle += 2*Math.PI;
    }
    glcanvas.pitchAngle = Math.asin(-R23);
    if (glcanvas.pitchAngle < 0) {
        glcanvas.pitchAngle += 2*Math.PI;
    }
    glcanvas.rollAngle = Math.atan2(R21, R22);
    if (glcanvas.rollAngle < 0) {
        glcanvas.rollAngle += 2*Math.PI;
    }

    updateSliders();
    glcanvas.repaint();
    if (animating) {
        requestAnimFrame(doSLERPAnimationStep);
    }
}

let lerpButton = document.getElementById("lerpButton");
lerpButton.checked = true;
let slerpButton = document.getElementById("slerpButton");
slerpButton.checked = false;
var y1 = 0.0, p1 = 0.0, r1 = 0.0, y2 = 0.0, p2 = 0.0, r2 = 0.0;
var q1 = null, q2 = null;
var animating = false;
var startTime = 0;
var totalTime = 0;
function doAnimation() {
    y1 = parseFloat(yaw1.value)*Math.PI/180;
    p1 = parseFloat(pitch1.value)*Math.PI/180;
    r1 = parseFloat(roll1.value)*Math.PI/180;
    y2 = parseFloat(yaw2.value)*Math.PI/180;
    p2 = parseFloat(pitch2.value)*Math.PI/180;
    r2 = parseFloat(roll2.value)*Math.PI/180;
    animating = true;
    startTime = (new Date()).getTime();
    if (lerpButton.checked) {
        totalTime = (Math.abs(y1-y2) + Math.abs(p1-p2) + Math.abs(r1-r2))/(Math.PI); //1 Second for each 180 degree change
        requestAnimFrame(doALERPAnimationStep);
    }
    else {
        let R1 = yawPitchRoll2Rot(y1, p1, r1).R;
        q1 = rot2Quat(R1);
        let R2 = yawPitchRoll2Rot(y2, p2, r2).R;
        q2 = rot2Quat(R2);
        requestAnimFrame(doSLERPAnimationStep);
    }
}