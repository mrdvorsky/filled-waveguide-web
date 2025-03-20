
type DragHandler = (deltaX: number, deltaY: number, event: MouseEvent | TouchEvent) => void;

export function makeDraggable(element: SVGElement, onDrag: DragHandler): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        onDrag(deltaX, deltaY, e);
    };

    const handleMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length === 0) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        onDrag(deltaX, deltaY, e);
    };

    const handleTouchEnd = () => {
        isDragging = false;
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
    };

    // Attach initial event listeners
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("touchstart", handleTouchStart);
}
