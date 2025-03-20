/**
 * Represents a 2D coordinate point with x and y values
 */
type Point2D = {
    x: number;
    y: number;
};

/**
 * Draws a closed polygon on a canvas context using provided vertices.
 * The path is automatically closed between the last and first points.
 * 
 * @param ctx - Initialized Canvas 2D rendering context to draw on
 * @param points - Array of vertices defining the polygon shape.
 *                 Requires at least 2 points to draw (returns early otherwise)
 */
export function drawPolygon2D(ctx: CanvasRenderingContext2D, points: Point2D[]): void {
    if (points.length < 2) return;

    const centerPointX = 0.5 * (ctx.canvas.width);
    const centerPointY = 0.5 * (ctx.canvas.height);
    const scaleXY = 0.5 * Math.min(ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < points.length; i++) {
        points[i].x = centerPointX + scaleXY*points[i].x;
        points[i].y = centerPointY - scaleXY*points[i].y;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.stroke();
}