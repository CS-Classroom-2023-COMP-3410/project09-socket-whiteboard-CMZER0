import io from "socket.io-client";
import { setupCanvas } from "./canvas.js";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server.");
});

setupCanvas(socket);

// Handle board clear
document.getElementById("clearButton").addEventListener("click", () => {
    console.log("Clear board clicked");
    socket.emit("clearBoard");
});