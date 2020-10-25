/* globals AFRAME, THREE */

AFRAME.registerComponent("model-opacity", {
  schema: { default: 1.0 },
  init: function() {
    this.el.addEventListener("model-loaded", this.update.bind(this));
  },
  update: function() {
    var mesh = this.el.getObject3D("mesh");
    var data = this.data;
    if (!mesh) {
      return;
    }
    mesh.traverse(function(node) {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});

AFRAME.registerComponent("hide-in-ar-mode", {
  // Set this object invisible while in AR mode.
  init: function() {
    this.el.sceneEl.addEventListener("enter-vr", ev => {
      this.wasVisible = this.el.getAttribute("visible");
      if (this.el.sceneEl.is("ar-mode")) {
        this.el.setAttribute("visible", false);
      }
    });
    this.el.sceneEl.addEventListener("exit-vr", ev => {
      if (this.wasVisible) this.el.setAttribute("visible", true);
    });
  }
});
/* global AFRAME, THREE */

// shader-grid-glitch.js

AFRAME.registerShader('grid-glitch', {
  schema: {
    color: {type: 'color', is: 'uniform'},
    timeMsec: {type: 'time', is: 'uniform'}
  },

  vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform vec3 color;
uniform float timeMsec; // A-Frame time in milliseconds.

void main() {
  float time = timeMsec / 1000.0; // Convert from A-Frame milliseconds to typical time in seconds.
  // Use sin(time), which curves between 0 and 1 over time,
  // to determine the mix of two colors:
  //    (a) Dynamic color where 'R' and 'B' channels come
  //        from a modulus of the UV coordinates.
  //    (b) Base color.
  //
  // The color itself is a vec4 containing RGBA values 0-1.
  gl_FragColor = mix(
    vec4(mod(vUv , 0.05) * 20.0, 1.0, 1.0),
    vec4(color, 1.0),
    sin(time)
  );
}
`
});


AFRAME.registerComponent("ar-shadows", {
  schema: {
    opacity: { default: 0.3 }
  },
  init: function() {
    this.el.sceneEl.addEventListener("enter-vr", ev => {
      this.wasVisible = this.el.getAttribute("visible");
      if (this.el.sceneEl.is("ar-mode")) {
        this.savedMaterial = this.el.object3D.children[0].material;
        this.el.object3D.children[0].material = new THREE.ShadowMaterial();
        this.el.object3D.children[0].material.opacity = this.data.opacity;
        this.el.setAttribute("visible", true);
      }
    });
    this.el.sceneEl.addEventListener("exit-vr", ev => {
      if (this.savedMaterial) {
        this.el.object3D.children[0].material = this.savedMaterial;
        this.savedMaterial = null;
      }
      if (!this.wasVisible) this.el.setAttribute("visible", false);
    });
  }
});
document.addEventListener("DOMContentLoaded", function() {
  //example:
  //document.querySelector("#moon").addEventListener("click", function(e) {
  //  document.querySelector("#dawnsit").emit("disappear");
  //  document.querySelector("#dawnfloat").setAttribute("visible", "true");
  //  document.querySelector("#sound2").components.sound.playSound();
  //});

  //load the mountain
  //load the car
  //load the character

  //show the start button when ready
});

//when the user presses the start button, start the timeline
// (How much should we handle in the timeline?)

//when the timeline finishes, enable the replay button
