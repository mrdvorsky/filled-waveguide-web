

const DEFAULT_VERTEX_SHADER: string = `
    uniform mat3 u_matrix;
    attribute vec3 a_position;
    
    varying float offset;

    void main() {
        offset = a_position[2];

        vec3 pos = vec3(a_position.xy, 0);
        gl_Position = vec4(u_matrix * pos, 1.0);
    }
`;

const DEFAULT_FRAGMENT_SHADER: string = `
    precision mediump float;
    
    uniform float u_phase;
    varying float offset;

    void main() {
        gl_FragColor = vec4(cos(offset - u_phase), 0, 0, 1);
    }
`;


export class WebglRenderer {
    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    shader_vertex: WebGLShader;
    shader_fragment: WebGLShader;
    program: WebGLProgram;
    vertexBuffer: WebGLBuffer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

        this.compile_vertex_shader(DEFAULT_VERTEX_SHADER);
        this.compile_fragment_shader(DEFAULT_FRAGMENT_SHADER);

        this.create_program();
    }

    compile_vertex_shader(shaderSource: string): void {
        this.shader_vertex = compile_shader(this.gl.VERTEX_SHADER, this.gl, shaderSource);
    }

    compile_fragment_shader(shaderSource: string): void {
        this.shader_fragment = compile_shader(this.gl.FRAGMENT_SHADER, this.gl, shaderSource);
    }

    create_program(): void {
        this.program = this.gl.createProgram()!;

        this.gl.attachShader(this.program, this.shader_vertex);
        this.gl.attachShader(this.program, this.shader_fragment);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        this.vertexBuffer = this.gl.createBuffer();
    }

    render(layerBoundaries: number[], wgHeight: number, viewWidth: number, phase: number): void {
        const triVertices = create_triangles(layerBoundaries, wgHeight);

        

        // Set viewport size
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // Update MVP matrix
        const scale_x = 2 / viewWidth;
        const scale_y = scale_x * this.canvas.width / this.canvas.height;
        const mvp_matrix = [
            scale_x, 0, 0, 
            0, scale_y, 0,
            0, 0, 0
        ];
        const matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
        this.gl.uniformMatrix3fv(matrixLocation, false, new Float32Array(mvp_matrix));

        // Update phase
        const phaseLocation = this.gl.getUniformLocation(this.program, "u_phase");
        this.gl.uniform1f(phaseLocation, phase);

        // Write triangle vertices buffer
        const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triVertices), this.gl.DYNAMIC_DRAW);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        // Draw
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, triVertices.length/3);
    }
}



function compile_shader(type: number, gl: WebGL2RenderingContext, source: string): WebGLShader {
    const shader = gl.createShader(type)!;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) 
            ?? "Could not get shader compilation error log.");
    }

    return shader;
}



function create_triangles(boundaries: number[], wgHeight: number): number[] {
    const ret: number[] = [];
    for (let i = 1; i < boundaries.length; i++) {
        const x1 = boundaries[i - 1];
        const x2 = boundaries[i];
        const y1 = -0.5*wgHeight;
        const y2 = 0.5*wgHeight;
        ret.push(
            x1, y1, 0, 
            x2, y1, x2 - x1, 
            x1, y2, 0, 
            x2, y1, x2 - x1, 
            x2, y2, x2 - x1, 
            x1, y2, 0
        );
    }

    return ret;
}



