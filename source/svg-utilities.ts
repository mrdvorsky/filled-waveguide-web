
export type SvgAndHtml = HTMLElement & SVGElement;

export function svg_clear(svg: SvgAndHtml): void {
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
}

export function svg_create_circle(): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "circle");
}

export function svg_create_rectangle(): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "rect");
}

export function svg_create_polygon(): SVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "polygon");
}

export function svg_create_diagonal_hatch(): SVGElement {
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "4");
    pattern.setAttribute("height", "4");

    const hatch = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hatch.setAttribute("stroke-width", "1");
    hatch.setAttribute("stroke", "black");
    hatch.setAttribute("style", "stroke:black; stroke-width:1");
    hatch.setAttribute("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2");

    pattern.setAttribute("id", "hatch_pattern");
    pattern.append(hatch);
    return pattern;
}



