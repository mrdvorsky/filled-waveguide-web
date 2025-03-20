
import { drawPolygon2D } from "./drawTools3D";

const canvas = document.getElementById('scene') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function resize_canvas() {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
}

window.addEventListener('load', () => {
    resize_canvas();
    window.addEventListener('resize', resize_canvas);

    window.requestAnimationFrame(render_frame_start);
});


let startTime: DOMHighResTimeStamp;
function render_frame_start(timestamp: DOMHighResTimeStamp) {
    startTime = timestamp;
    window.requestAnimationFrame(render_frame);
}

function render_frame(timestamp: DOMHighResTimeStamp) {
    const xOff = 0.1 * Math.cos(0.002*Math.PI * (timestamp - startTime) / 2);
    const yOff = 0.1 * Math.sin(0.002*Math.PI * (timestamp - startTime) / 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    drawPolygon2D(ctx, [
        { x: 0.0 + xOff, y: 0.1 + yOff }, 
        { x: 0.1, y: -0.5 }, 
        { x: -0.4, y: 0.1 }
    ]);

    window.requestAnimationFrame(render_frame);
}


