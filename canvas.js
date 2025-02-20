export function setupCanvas(socket) {
    const canvas = document.getElementById("whiteboard");
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let color = document.getElementById("colorPicker").value;
    let brushSize = document.getElementById("brushSize").value;

    // Resize canvas
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 150;

    // Function to draw on canvas
    function drawOnCanvas(x, y, color, size) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Update color when selected
    document.getElementById("colorPicker").addEventListener("change", (e) => {
        color = e.target.value;
    });

    // Update brush size when selected
    document.getElementById("brushSize").addEventListener("input", (e) => {
        brushSize = e.target.value;
    });

    canvas.addEventListener("mousedown", () => (drawing = true));
    canvas.addEventListener("mouseup", () => (drawing = false));

    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const data = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            color: color,
            size: brushSize
        };

        console.log("Sending draw event to server:", data);
        socket.emit("draw", data);  // Send data to the server (do not draw yet)
    });

    socket.on("draw", (data) => {
        console.log("Received draw event from server:", data);
        drawOnCanvas(data.x, data.y, data.color, data.size);
    });

    socket.on("clearBoard", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("boardState", (state) => {
        console.log("Loading board state:", state);
        state.forEach((data) => {
            drawOnCanvas(data.x, data.y, data.color, data.size);
        });
    });
}