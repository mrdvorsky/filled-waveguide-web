
import Complex from "complex";
import { FilledWaveguideController } from "./filledWaveguideController";
import { nLayerPlanewave } from "./nLayerFilled";
import { SvgAndHtml } from "./svgUtilities";
import { WebglRenderer } from "./webglRenderer";


let controller: FilledWaveguideController;
let renderer: WebglRenderer;
let svg: SvgAndHtml;
let canvas: HTMLCanvasElement;
window.addEventListener('load', () => {
    svg = document.getElementById("wg_controller") as SvgAndHtml;
    canvas = document.getElementById("wg_display_canvas") as HTMLCanvasElement;
    
    controller = new FilledWaveguideController(1);
    renderer = new WebglRenderer(canvas);

    controller.initialize(svg, updateDrawings);
    window.addEventListener("resize", resizeHandler);
    updateDrawings();

    requestAnimationFrame(animate);
});



function updateDrawings() {
    controller.draw(svg);
}



function animate(timeStamp: number) {
    const phase = (timeStamp/1000) * Math.PI;

    const layerBoundaries = [0, ...controller.layerBoundaries, controller.wgWidth];
    renderer.render(
        layerBoundaries.map((x) => x - 0.5*controller.wgWidth), 
        controller.wgHeight, 
        controller.svgWidth, 
        phase
    );

    requestAnimationFrame(animate);

    console.log(nLayerPlanewave(10, new Complex("1 + 1i"), new Complex("1 - 1i")));
}


function resizeHandler() {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    updateDrawings();
}













