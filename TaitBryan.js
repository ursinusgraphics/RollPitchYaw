function makeCylinderMesh(axis, center, R, H, color) {
    cylinder = new PolyMesh();
    var vertexArr = [];
    var res = 100;
    var vals = [0, 0, 0];
    //Make the main cylinder part
    for (var i = 0; i < res; i++) {
        vertexArr.push([]);
        for (var j = 0; j < 2; j++) {
            vals[axis[0]] = R*Math.cos(i*2*3.141/res);
            vals[axis[1]] = R*Math.sin(i*2*3.141/res);
            vals[axis[2]] = H/2*(2*j-1)
            var v = vec3.fromValues(vals[0] + center[0], vals[1] + center[1], vals[2] + center[2]);
            vertexArr[i].push(cylinder.addVertex(v, color));
        }
    }
    //Make the faces
    var i2;
    for (var i1 = 0; i1 < res; i1++) {
        i2 = (i1+1) % res;
        cylinder.addFace([vertexArr[i1][0], vertexArr[i2][0], vertexArr[i2][1]]);
        cylinder.addFace([vertexArr[i1][0], vertexArr[i2][1], vertexArr[i1][1]]);
    }
    return cylinder;
}

function GimbalCanvas(glcanvas) {
    SimpleMeshCanvas(glcanvas, "GLEAT/Viewers"); //Call the boilerplate code to set up mouse interaction
    
    glcanvas.displayPlane = true;
    glcanvas.displayGimbals = true;
    glcanvas.displayAxes = true;
    
    glcanvas.initGimbals = function() {
        var bbox = this.mesh.getBBox();
        var center = bbox.getCenter();
        vec3.scale(center, center, -1);
        this.mesh.Translate(center); //Translate to origin
        bbox = this.mesh.getBBox();
        center = bbox.getCenter();
        var R = bbox.getDiagLength();
        var H = R/20.0;
        
        this.yawgimbal = makeCylinderMesh([0, 1, 2], center, R, H, vec3.fromValues(0.122, 0.467, 0.706));
        this.yawConnection = makeCylinderMesh([0, 2, 1], vec3.fromValues(center[0], center[1]-R*(1+1/10.0), center[2]), H/3, R/5.0, vec3.fromValues(0.5, 0.5, 0.5));
        
        this.pitchgimbal = makeCylinderMesh([0, 2, 1], center, R-R/20, H, vec3.fromValues(1, 0.498, 0.055));
        this.pitchConnection = makeCylinderMesh([1, 2, 0], vec3.fromValues(center[0]+R-R/20, center[1], center[2]), H/3, R/10.0, vec3.fromValues(0.5, 0.5, 0.5));
        
        this.rollgimbal = makeCylinderMesh([1, 2, 0], center, R-R/10, H, vec3.fromValues(0.173, 0.627, 0.173));
        this.rollConnection = makeCylinderMesh([0, 1, 2], vec3.fromValues(center[0], center[1], center[2]+R*(1-1/10.0)), H/3, R/10.0);
        
        this.meshConnection = makeCylinderMesh([0, 2, 1], vec3.fromValues(center[0], center[1]+R/2-R/10, center[2]), H/4, R*1.02, vec3.fromValues(0.5, 0.5, 0.5));
        
        this.yawAngle = 0.0;
        this.pitchAngle = 0.0;
        this.rollAngle = 0.0;
        this.camera.centerOnMesh(this.yawgimbal);
        this.camera.theta = -Math.PI/2;

        this.axisXMesh = makeCylinderMesh([1, 2, 0], vec3.fromValues(center[0]+R*0.15, center[1], center[2]), H/3, R*0.3, vec3.fromValues(1, 0, 0));
        this.axisYMesh = makeCylinderMesh([0, 2, 1], vec3.fromValues(center[0], center[1]+R*0.15, center[2]), H/3, R*0.3, vec3.fromValues(0, 1, 0));
        this.axisZMesh = makeCylinderMesh([0, 1, 2], [center[0]+H/10, center[1], center[2]+R*0.15], H/3, R*0.3, vec3.fromValues(0, 0, 1));
    }

	glcanvas.colorBlack = vec3.fromValues(0.0, 0.0, 0.0);
	glcanvas.colorWhite = vec3.fromValues(1.0, 1.0, 1.0);
	
	//Setup repaint function	
	glcanvas.repaint = async function() {
		glcanvas.gl.viewport(0, 0, glcanvas.gl.viewportWidth, glcanvas.gl.viewportHeight);
		glcanvas.gl.clear(glcanvas.gl.COLOR_BUFFER_BIT | glcanvas.gl.DEPTH_BUFFER_BIT);
		
		var pMatrix = mat4.create();
		mat4.perspective(pMatrix, 45, glcanvas.gl.viewportWidth / glcanvas.gl.viewportHeight, glcanvas.camera.R/100.0, glcanvas.camera.R*2);
		var mvMatrix = glcanvas.camera.getMVMatrix();
		if (glcanvas.displayGimbals) {
		    glcanvas.yawConnection.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);	
	    }

        let res = yawPitchRoll2Rot(glcanvas.yawAngle, glcanvas.pitchAngle, glcanvas.rollAngle);
        let R = res["R"], rotYaw = res["rotYaw"], rotPitch = res["rotPitch"], rotRoll = res["rotRoll"];
        mat4.multiply(mvMatrix, mvMatrix, rotYaw);
        if (glcanvas.displayGimbals) {
		    glcanvas.yawgimbal.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);
		    glcanvas.pitchConnection.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);	
	    }
        mat4.multiply(mvMatrix, mvMatrix, rotPitch);
        if (glcanvas.displayGimbals) {
		    glcanvas.pitchgimbal.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);
		    glcanvas.rollConnection.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);	
	    }
		mat4.multiply(mvMatrix, mvMatrix, rotRoll);
		if (glcanvas.displayGimbals) {
		    glcanvas.rollgimbal.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);
		    glcanvas.meshConnection.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.colorWhite, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.ambientColor);
		}
        if (glcanvas.displayPlane) {
            glcanvas.mesh.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.ambientColor, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.lightColor);
        }

        if (glcanvas.displayAxes) {
            glcanvas.axisXMesh.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.ambientColor, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.lightColor);
            glcanvas.axisYMesh.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.ambientColor, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.lightColor);
            glcanvas.axisZMesh.render(glcanvas.gl, colorShader, pMatrix, mvMatrix, glcanvas.ambientColor, glcanvas.light1Pos, glcanvas.light2Pos, glcanvas.lightColor);
        }



        let c = Math.cos(glcanvas.yawAngle);
        c = Math.round(c*100)/100;
        let s = Math.sin(glcanvas.yawAngle);
        s = Math.round(s*100)/100;
        calpha1.innerHTML = c;
        calpha2.innerHTML = c;
        salphapos.innerHTML = s;
        salphaneg.innerHTML = -s;


        c = Math.cos(glcanvas.pitchAngle);
        c = Math.round(c*100)/100;
        s = Math.sin(glcanvas.pitchAngle);
        s = Math.round(s*100)/100;
        cbeta1.innerHTML = c;
        cbeta2.innerHTML = c;
        sbetapos.innerHTML = s;
        sbetaneg.innerHTML = -s;
        
        c = Math.cos(glcanvas.rollAngle);
        c = Math.round(c*100)/100;
        s = Math.sin(glcanvas.rollAngle);
        s = Math.round(s*100)/100;
        cgamma1.innerHTML = c;
        cgamma2.innerHTML = c;
        sgammapos.innerHTML = s;
        sgammaneg.innerHTML = -s;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rEntries[i][j].innerHTML = Math.round(100*R[j*4+i])/100;
            }
        }
	}
	
}
