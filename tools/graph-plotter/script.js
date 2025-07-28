document.addEventListener("DOMContentLoaded", () => {
    // --- Common Elements ---
    const messageBox = document.getElementById("messageBox");

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    // --- 2D Graph Plotter ---
    const function2DInput = document.getElementById("function2DInput");
    const xMin2DInput = document.getElementById("xMin2D");
    const xMax2DInput = document.getElementById("xMax2D");
    const plot2DBtn = document.getElementById("plot2DBtn");
    const reset2DBtn = document.getElementById("reset2DBtn");
    const graph1DCanvas = document.getElementById("graph1DCanvas");
    const ctx = graph1DCanvas.getContext("2d");

    const defaultFunction2D = "Math.sin(x)";
    const defaultXMin2D = -10;
    const defaultXMax2D = 10;

    // Set initial values for 2D inputs
    function2DInput.value = defaultFunction2D;
    xMin2DInput.value = defaultXMin2D;
    xMax2DInput.value = defaultXMax2D;

    /**
     * Plots the 2D function on the canvas.
     */
    function plot2DGraph() {
        const funcStr = function2DInput.value;
        const xMin = parseFloat(xMin2DInput.value);
        const xMax = parseFloat(xMax2DInput.value);

        if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax) {
            showMessage("Invalid X range for 2D graph. Please ensure X Max > X Min.", true);
            return;
        }

        ctx.clearRect(0, 0, graph1DCanvas.width, graph1DCanvas.height); // Clear canvas
        ctx.beginPath();
        ctx.strokeStyle = '#00fff7'; // Neon Cyan
        ctx.lineWidth = 2;

        const scaleX = graph1DCanvas.width / (xMax - xMin);
        const scaleY = graph1DCanvas.height / (xMax - xMin); // Assuming square aspect ratio for simplicity
        const centerX = graph1DCanvas.width / 2;
        const centerY = graph1DCanvas.height / 2;

        // Draw Axes
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.moveTo(0, centerY);
        ctx.lineTo(graph1DCanvas.width, centerY); // X-axis
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, graph1DCanvas.height); // Y-axis
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#ff00cc'; // Neon Pink for graph
        ctx.lineWidth = 2;

        let firstPoint = true;

        for (let i = 0; i < graph1DCanvas.width; i++) {
            const x = (i / scaleX) + xMin; // Convert canvas X to function X
            let y;
            try {
                // Use a safe wrapper for eval
                y = (function(x) { return eval(funcStr); }).call(window, x);
            } catch (e) {
                showMessage(`Error evaluating 2D function: ${e.message}. Please check your syntax.`, true);
                return;
            }

            // Convert function Y to canvas Y (invert Y axis for canvas)
            const canvasY = centerY - (y * scaleY);

            if (firstPoint) {
                ctx.moveTo(i, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(i, canvasY);
            }
        }
        ctx.stroke();
        showMessage("2D graph plotted successfully!");
        graph1DCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Resets 2D graph inputs and canvas.
     */
    function reset2DGraph() {
        function2DInput.value = defaultFunction2D;
        xMin2DInput.value = defaultXMin2D;
        xMax2DInput.value = defaultXMax2D;
        ctx.clearRect(0, 0, graph1DCanvas.width, graph1DCanvas.height);
        showMessage("2D graph inputs reset.");
    }

    // --- 3D Graph Plotter ---
    const function3DInput = document.getElementById("function3DInput");
    const xMin3DInput = document.getElementById("xMin3D");
    const xMax3DInput = document.getElementById("xMax3D");
    const yMin3DInput = document.getElementById("yMin3D");
    const yMax3DInput = document.getElementById("yMax3D");
    const plot3DBtn = document.getElementById("plot3DBtn");
    const reset3DBtn = document.getElementById("reset3DBtn");
    const graph3DCanvas = document.getElementById("graph3DCanvas");

    const defaultFunction3D = "Math.sin(x / 2) * Math.cos(y / 2) * 5";
    const defaultXMin3D = -10;
    const defaultXMax3D = 10;
    const defaultYMin3D = -10;
    const defaultYMax3D = 10;

    // Set initial values for 3D inputs
    function3DInput.value = defaultFunction3D;
    xMin3DInput.value = defaultXMin3D;
    xMax3DInput.value = defaultXMax3D;
    yMin3DInput.value = defaultYMin3D;
    yMax3DInput.value = defaultYMax3D;

    let scene, camera, renderer, controls, mesh;

    /**
     * Initializes the 3D scene.
     */
    function init3D() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d0d10); // Dark background

        // Camera
        camera = new THREE.PerspectiveCamera(75, graph3DCanvas.width / graph3DCanvas.height, 0.1, 1000);
        camera.position.set(0, 20, 20); // Initial camera position

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: graph3DCanvas, antialias: true });
        renderer.setSize(graph3DCanvas.width, graph3DCanvas.height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // an animation loop is required when damping is enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 100;
        controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the plane

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);
    }

    /**
     * Creates or updates the 3D surface mesh.
     */
    function createOrUpdate3DSurface() {
        const funcStr = function3DInput.value;
        const xMin = parseFloat(xMin3DInput.value);
        const xMax = parseFloat(xMax3DInput.value);
        const yMin = parseFloat(yMin3DInput.value);
        const yMax = parseFloat(yMax3DInput.value);

        if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax ||
            isNaN(yMin) || isNaN(yMax) || yMin >= yMax) {
            showMessage("Invalid X or Y range for 3D graph. Please ensure Max > Min for both.", true);
            return;
        }

        const segmentsX = 50; // Number of divisions along X
        const segmentsY = 50; // Number of divisions along Y

        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = []; // For gradient color based on Z
        const indices = [];

        const color1 = new THREE.Color(0x00fff7); // Cyan
        const color2 = new THREE.Color(0xff00cc); // Pink

        let minZ = Infinity;
        let maxZ = -Infinity;

        // Calculate Z values and find min/max for color scaling
        const zValues = [];
        for (let i = 0; i <= segmentsY; i++) {
            const y = yMin + (i / segmentsY) * (yMax - yMin);
            const rowZ = [];
            for (let j = 0; j <= segmentsX; j++) {
                const x = xMin + (j / segmentsX) * (xMax - xMin);
                let z;
                try {
                    // Use a safe wrapper for eval
                    z = (function(x, y) { return eval(funcStr); }).call(window, x, y);
                } catch (e) {
                    showMessage(`Error evaluating 3D function: ${e.message}. Please check your syntax.`, true);
                    return;
                }
                if (isNaN(z)) z = 0; // Handle cases like log(0)
                rowZ.push(z);
                minZ = Math.min(minZ, z);
                maxZ = Math.max(maxZ, z);
            }
            zValues.push(rowZ);
        }

        // Create vertices and faces
        for (let i = 0; i <= segmentsY; i++) {
            const y = yMin + (i / segmentsY) * (yMax - yMin);
            for (let j = 0; j <= segmentsX; j++) {
                const x = xMin + (j / segmentsX) * (xMax - xMin);
                const z = zValues[i][j];

                positions.push(x, y, z);

                // Interpolate color based on Z value
                const normalizedZ = (z - minZ) / (maxZ - minZ);
                const interpolatedColor = new THREE.Color().lerpColors(color1, color2, normalizedZ);
                colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);

                if (j < segmentsX && i < segmentsY) {
                    const a = i * (segmentsX + 1) + j;
                    const b = a + 1;
                    const c = (i + 1) * (segmentsX + 1) + j;
                    const d = c + 1;

                    // Two triangles per quad
                    indices.push(a, b, c);
                    indices.push(b, d, c);
                }
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals(); // For lighting

        const material = new THREE.MeshPhongMaterial({
            vertexColors: true, // Use vertex colors
            side: THREE.DoubleSide,
            shininess: 30 // For specular highlights
        });

        if (mesh) {
            scene.remove(mesh); // Remove old mesh if exists
            mesh.geometry.dispose();
            mesh.material.dispose();
        }
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Adjust camera to look at the center of the new mesh
        const bbox = new THREE.Box3().setFromObject(mesh);
        const center = bbox.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        camera.position.set(center.x, center.y + (maxZ - minZ) * 2, center.z + (xMax - xMin) * 1.5); // Adjust camera position
        camera.lookAt(center);
        controls.update(); // Update controls after changing target/position

        showMessage("3D graph plotted successfully! Drag to rotate.");
        graph3DCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Resets 3D graph inputs and scene.
     */
    function reset3DGraph() {
        function3DInput.value = defaultFunction3D;
        xMin3DInput.value = defaultXMin3D;
        xMax3DInput.value = defaultXMax3D;
        yMin3DInput.value = defaultYMin3D;
        yMax3DInput.value = defaultYMax3D;

        if (mesh) {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            mesh = null;
        }
        // Re-initialize for a clean slate, or just clear the canvas if possible
        // For Three.js, it's better to remove and re-add specific objects.
        // A full re-init might be overkill but ensures clean state.
        // For simplicity, just remove the mesh and let the user re-plot.
        showMessage("3D graph inputs reset. Re-plot to see default graph.");
    }


    /**
     * Animation loop for 3D rendering.
     */
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true
        renderer.render(scene, camera);
    }

    // --- Event Listeners ---
    plot2DBtn.addEventListener("click", plot2DGraph);
    reset2DBtn.addEventListener("click", reset2DGraph);
    plot3DBtn.addEventListener("click", createOrUpdate3DSurface);
    reset3DBtn.addEventListener("click", reset3DGraph);

    // --- Initial Setup ---
    init3D(); // Initialize 3D scene once
    animate(); // Start 3D animation loop

    // Plot initial graphs on load
    plot2DGraph();
    createOrUpdate3DSurface();
});
