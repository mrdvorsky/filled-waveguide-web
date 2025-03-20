
import {
    SvgAndHtml, 
    svg_clear, 
    svg_create_circle, 
    svg_create_rectangle, 
    svg_create_polygon, 
    svg_create_diagonal_hatch
} from "./svgUtilities";

import { makeDraggable } from "./draggable";



const DOT_DIAM_PIXEL: number = 10;


export class FilledWaveguideController {
    numLayers: number;
    
    wgWidth: number = 70;
    wgHeight: number = 10;
    wgWallThickness: number = 2;
    wgFlangeHeight: number = 20;
    wgFlangeThickness: number = 3;
    wgHeadWidth: number = 8;
    wgConnectorDiam: number = 3;
    
    svgWidth: number = 100;
    
    layerRects: SVGElement[];
    wgDrawing: SVGElement[];
    layerDots: SVGElement[];

    layerBoundaries: number[];
    
    constructor(numLayers: number) {
        this.numLayers = numLayers;

        this.layerBoundaries = [];
        for (let i = 0; i < numLayers + 1; i++) {
            this.layerBoundaries.push((i + 1) * (this.wgWidth / (numLayers + 2)));
        }

        this.createSvgObjects();
    }

    initialize(svg: SvgAndHtml, moveHandler: () => void): void {
        svg_clear(svg);
        svg.append(svg_create_diagonal_hatch());
        svg.append(...this.layerRects);
        svg.append(...this.wgDrawing);
        svg.append(...this.layerDots);

        for (let i = 0; i < this.layerDots.length; i++) {
            const dragHandler = (dx: number, dy: number) => {
                const bound_min = this.layerBoundaries[i - 1] ?? 0;
                const bound_max = this.layerBoundaries[i + 1] ?? this.wgWidth;

                const dx_scaled = dx * (this.svgWidth / svg.getBoundingClientRect().width);

                this.layerBoundaries[i] = Math.min(Math.max(bound_min, this.layerBoundaries[i] + dx_scaled), bound_max);

                moveHandler();
            }
            makeDraggable(this.layerDots[i], dragHandler);
        }
    }

    draw(svg: SvgAndHtml, layerBoundaries?: number[]): void {
        if (layerBoundaries !== undefined) {
            this.layerBoundaries = layerBoundaries;
        }

        this.drawLayerDots(svg, this.layerBoundaries);
        this.drawLayers(svg, this.layerBoundaries);
        this.drawWaveguide(svg);
    }

    private createSvgObjects(): void {
        // Waveguide Drawing
        this.wgDrawing = [];
        for (let i = 0; i < 4; i++) {
            this.wgDrawing.push(svg_create_rectangle());
        }
        for (let i = 4; i < 6; i++) {
            this.wgDrawing.push(svg_create_polygon());
        }
        for (let i = 6; i < 8; i++) {
            this.wgDrawing.push(svg_create_circle());
        }
        
        // Layer Rectangles
        this.layerRects = [];
        for (let i = 0; i < this.numLayers; i++) {
            this.layerRects.push(svg_create_rectangle());
        }

        // Draggable Dots
        this.layerDots = [];
        for (let i = 0; i < this.numLayers + 1; i++) {
            this.layerDots.push(svg_create_circle());
        }
    }

    private drawLayers(svg: SvgAndHtml, layerBoundaries: number[]): void {
        const wgStart = 0.5 * (this.svgWidth - this.wgWidth);
        for (let i = 0; i < this.layerRects.length; i++) {
            this.layerRects[i].setAttribute("x", this.scaleXY(svg, wgStart + layerBoundaries[i]));
            this.layerRects[i].setAttribute("y", this.shiftY(svg, -0.5*this.wgHeight));
            this.layerRects[i].setAttribute("width", this.scaleXY(svg, layerBoundaries[i + 1] - layerBoundaries[i]));
            this.layerRects[i].setAttribute("height", this.scaleXY(svg, this.wgHeight));

            this.layerRects[i].setAttribute("fill", "green");
            this.layerRects[i].setAttribute("stroke-width", "1");
            this.layerRects[i].setAttribute("stroke", "black");
        }
    }

    private drawLayerDots(svg: SvgAndHtml, layerBoundaries: number[]): void {
        const wgStart = 0.5 * (this.svgWidth - this.wgWidth);
        for (let i = 0; i < this.layerDots.length; i++) {
            this.layerDots[i].setAttribute("cx", this.scaleXY(svg, wgStart + layerBoundaries[i]));
            this.layerDots[i].setAttribute("cy", this.shiftY(svg, 0.5*this.wgHeight));
            this.layerDots[i].setAttribute("r", (0.5*DOT_DIAM_PIXEL).toString());

            this.layerDots[i].setAttribute("fill", "black");
        }
    }

    // drawWaveguide(svg: SvgAndHtml): void {
    //     const wgDrawing_x: number[] = [
    //         -(0.5*this.wgWidth + 2*this.wgFlangeThickness + this.wgHeadWidth),
    //         -(0.5*this.wgWidth + 2*this.wgFlangeThickness),
    //         -(0.5*this.wgWidth + this.wgFlangeThickness),
    //         -(0.5*this.wgWidth),
    //         -(0.5*this.wgWidth),
    //         (0.5*this.wgWidth),
    //         (0.5*this.wgWidth + this.wgFlangeThickness),
    //         (0.5*this.wgWidth + 2*this.wgFlangeThickness),
    //     ];
    //     const wgDrawing_y: number[] = [
    //         -0.5*(this.wgHeight + 2*this.wgWallThickness),
    //         -0.5*this.wgFlangeHeight,
    //         -0.5*this.wgFlangeHeight,
    //         0.5*this.wgHeight,
    //         -0.5*this.wgHeight - this.wgWallThickness,
    //         -0.5*this.wgFlangeHeight,
    //         -0.5*this.wgFlangeHeight,
    //         -0.5*(this.wgHeight + 2*this.wgWallThickness)
    //     ];
    //     const wgDrawing_width: number[] = [
    //         this.wgHeadWidth,
    //         this.wgFlangeThickness,
    //         this.wgFlangeThickness,
    //         this.wgWidth,
    //         this.wgWidth,
    //         this.wgFlangeThickness,
    //         this.wgFlangeThickness,
    //         this.wgHeadWidth
    //     ];
    //     const wgDrawing_height: number[] = [
    //         this.wgHeight + 2*this.wgWallThickness,
    //         this.wgFlangeHeight,
    //         this.wgFlangeHeight,
    //         this.wgWallThickness,
    //         this.wgWallThickness,
    //         this.wgFlangeHeight,
    //         this.wgFlangeHeight,
    //         this.wgHeight + 2*this.wgWallThickness
    //     ];

    //     for (let i = 0; i < wgDrawing_x.length; i++) {
    //         this.wgDrawing[i].setAttribute("x", this.shiftX(svg, wgDrawing_x[i]));
    //         this.wgDrawing[i].setAttribute("y", this.shiftY(svg, wgDrawing_y[i]));
    //         this.wgDrawing[i].setAttribute("width", this.scaleXY(svg, wgDrawing_width[i]));
    //         this.wgDrawing[i].setAttribute("height", this.scaleXY(svg, wgDrawing_height[i]));

    //         this.wgDrawing[i].setAttribute("fill", "gray");
    //         this.wgDrawing[i].setAttribute("stroke-width", "1");
    //         this.wgDrawing[i].setAttribute("stroke", "black");
    //     }
    //     for (let i = 8; i < this.wgDrawing.length; i++) {
    //         this.wgDrawing[i].setAttribute("cy", this.shiftY(svg, 0));
    //         this.wgDrawing[i].setAttribute("r", this.scaleXY(svg, 0.5*this.wgConnectorDiam));

    //         this.wgDrawing[i].setAttribute("fill", "yellow");
    //         this.wgDrawing[i].setAttribute("stroke-width", "1");
    //         this.wgDrawing[i].setAttribute("stroke", "black");
    //     }
    //     this.wgDrawing[8].setAttribute("cx", this.shiftX(svg, 
    //         0.5*(this.wgWidth + 4*this.wgFlangeThickness + this.wgHeadWidth)));
    //     this.wgDrawing[9].setAttribute("cx", this.shiftX(svg, 
    //         -0.5*(this.wgWidth + 4*this.wgFlangeThickness + this.wgHeadWidth)));
    // }

    drawWaveguide(svg: SvgAndHtml): void {
        const rect_cx: number[] = [
            -0.5 * (this.wgWidth + 2*this.wgFlangeThickness + this.wgHeadWidth),
            0.5 * (this.wgWidth + 2*this.wgFlangeThickness + this.wgHeadWidth),
            -0.5 * (this.wgWidth + this.wgFlangeThickness),
            0.5 * (this.wgWidth + this.wgFlangeThickness)
        ];
        const rect_cy: number[] = [
            0, 0, 0, 0
        ];
        const rect_width: number[] = [
            this.wgHeadWidth,
            this.wgHeadWidth,
            this.wgFlangeThickness,
            this.wgFlangeThickness
        ];
        const rect_height: number[] = [
            this.wgHeight + 2*this.wgWallThickness,
            this.wgHeight + 2*this.wgWallThickness,
            this.wgFlangeHeight,
            this.wgFlangeHeight
        ];

        const poly_x: number[] = [
            -0.5 * (this.wgWidth),
            -0.5 * (this.wgWidth),
            0.5 * (this.wgWidth),
            0.5 * (this.wgWidth),
            0.5 * (this.wgWidth - 2*this.wgFlangeThickness),
            0.5 * (this.wgWidth - 2*this.wgFlangeThickness),
            -0.5 * (this.wgWidth - 2*this.wgFlangeThickness),
            -0.5 * (this.wgWidth - 2*this.wgFlangeThickness)
        ];
        const poly_y: number[] = [
            0.5 * (this.wgFlangeHeight),
            0.5 * (this.wgHeight),
            0.5 * (this.wgHeight),
            0.5 * (this.wgFlangeHeight),
            0.5 * (this.wgFlangeHeight),
            0.5 * (this.wgHeight + 2*this.wgWallThickness),
            0.5 * (this.wgHeight + 2*this.wgWallThickness),
            0.5 * (this.wgFlangeHeight)
        ];

        const circ_cx: number[] = [
            -0.5 * (this.wgWidth + 2*this.wgFlangeThickness + this.wgHeadWidth),
            0.5 * (this.wgWidth + 2*this.wgFlangeThickness + this.wgHeadWidth)
        ];
        const circ_cy: number[] = [
            0, 0
        ];
        const circ_r: number[] = [
            0.5 * this.wgConnectorDiam,
            0.5 * this.wgConnectorDiam
        ];

        

        // Draw Rectangles
        for (let i = 0; i < 4; i++) {
            this.wgDrawing[i].setAttribute("x", this.shiftX(svg, rect_cx[i] - 0.5*rect_width[i]));
            this.wgDrawing[i].setAttribute("y", this.shiftY(svg, rect_cy[i] - 0.5*rect_height[i]));
            this.wgDrawing[i].setAttribute("width", this.scaleXY(svg, rect_width[i]));
            this.wgDrawing[i].setAttribute("height", this.scaleXY(svg, rect_height[i]));

            this.wgDrawing[i].setAttribute("fill", "gray");
            this.wgDrawing[i].setAttribute("stroke-width", "1.5");
            this.wgDrawing[i].setAttribute("stroke", "black");
        }

        // Draw Polygons
        const points_top = poly_x.map((x, i) => `${this.shiftX(svg, x)},${this.shiftY(svg, poly_y[i])}`).join(" ");
        const points_bottom = poly_x.map((x, i) => `${this.shiftX(svg, x)},${this.shiftY(svg, -poly_y[i])}`).join(" ");
        this.wgDrawing[4].setAttribute("points", points_top);
        this.wgDrawing[5].setAttribute("points", points_bottom);
        for (let i = 4; i < 6; i++) {
            this.wgDrawing[i].setAttribute("fill", "url(#hatch_pattern)");
            // this.wgDrawing[i].setAttribute("fill", "gray");
            this.wgDrawing[i].setAttribute("stroke-width", "1.5");
            this.wgDrawing[i].setAttribute("stroke", "black");
        }

        // Draw Connectors
        for (let i = 6; i < 8; i++) {
            this.wgDrawing[i].setAttribute("cx", this.shiftX(svg, circ_cx[i - 6]));
            this.wgDrawing[i].setAttribute("cy", this.shiftY(svg, circ_cy[i - 6]));
            this.wgDrawing[i].setAttribute("r", this.scaleXY(svg, circ_r[i - 6]));

            this.wgDrawing[i].setAttribute("fill", "gold");
            this.wgDrawing[i].setAttribute("stroke-width", "1.5");
            this.wgDrawing[i].setAttribute("stroke", "black");
        }
    }
    
    private shiftX(svg: SvgAndHtml, x: number): string {
        const centerPixelX = 0.5 * svg.getBoundingClientRect().width;
        const scaleFactorXY = svg.getBoundingClientRect().width / this.svgWidth;

        return ((x * scaleFactorXY) + centerPixelX).toString();
    }

    private shiftY(svg: SvgAndHtml, y: number): string {
        const centerPixelY = 0.5 * svg.getBoundingClientRect().height;
        const scaleFactorXY = svg.getBoundingClientRect().width / this.svgWidth;

        return ((y * scaleFactorXY) + centerPixelY).toString();
    }

    private scaleXY(svg: SvgAndHtml, xy: number): string {
        const scaleFactorXY = svg.getBoundingClientRect().width / this.svgWidth;
        return (scaleFactorXY * xy).toString();
    }
};













