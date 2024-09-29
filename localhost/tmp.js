            // it is our job to create or get the cavas
            let o_canvas = document.createElement('canvas'); // or document.querySelector("#my_canvas");
            // just for the demo 
            // o_canvas.style.position = 'fixed';
            // o_canvas.style.width = '100vw';
            // o_canvas.style.height = '100vh';
            let o_webgl_program = f_o_webgl_program(
                o_canvas,
                `#version 300 es
                in vec4 a_o_vec_position_vertex;
                void main() {
                    gl_Position = a_o_vec_position_vertex;
                }`, 
                `#version 300 es
                precision mediump float;
                out vec4 fragColor;
                uniform vec2 o_scl_canvas; // is here by default
                void main() {
                    // gl_FragCoord is the current pixel coordinate and available by default
                    vec2 o_trn_pix_nor = (gl_FragCoord.xy - o_scl_canvas.xy*.5) / vec2(min(o_scl_canvas.x, o_scl_canvas.y));
                    float n = (o_trn_pix_nor.x*o_trn_pix_nor.y);
                    fragColor = vec4(
                        sin(n*33.+0.1), 
                        sin(n*33.+0.0), 
                        sin(n*33.-0.1), 
                        1.
                    );
                }`
            )
            document.body.appendChild(o_canvas);
            window.addEventListener('resize', ()=>{
                // this will resize the canvas and also update 'o_scl_canvas'
                f_resize_canvas_from_o_webgl_program(
                    o_webgl_program,
                    window.innerWidth, 
                    window.innerHeight
                )
                f_render_from_o_webgl_program(o_webgl_program);

            });

            // this will render the webgl program once
            f_render_from_o_webgl_program(o_webgl_program);

            // when finished or if we want to reinitialize a new programm with different GPU code
            // we have to first delete the program
            f_delete_o_webgl_program(o_webgl_program)

            // now an example of passing data to a webgl programm will follow
            // for arrays we have to know the length of them before we compile the shader
            
            let a_n = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
            // arrays with vectors are always one dimensional and have to be interpreted multidimensional by
            // a 'scale dimension'
            // the arrays are then automatically converted to vec2, vec3, or vec4 inside the GLSL shader code

            // here the dimension would be (2,3) 2 per x axis, 3 per y axis
            let a_o_vec2 = new Float32Array([ 
                0.1, 0.2, // vec2(0.1, 0.2) / a_o_vec2[0]
                0.3, 0.4, // vec2(0.3, 0.4) / a_o_vec2[1]
                0.5, 0.6  // vec2(0.5, 0.6) / a_o_vec2[2]
            ]);
            // (3,5) 
            let a_o_vec3 = new Float32Array([
                0.1, 0.2, 0.4, // vec2(0.1, 0.2, 0.4) / a_o_vec3[0]
                0.3, 0.4, 0.4, // vec2(0.3, 0.4, 0.4) / a_o_vec3[1]
                0.3, 0.4, 0.4, // vec2(0.3, 0.4, 0.4) / a_o_vec3[2]
                0.3, 0.4, 0.4, // vec2(0.3, 0.4, 0.4) / a_o_vec3[3]
                0.3, 0.4, 0.4, // vec2(0.3, 0.4, 0.4) / a_o_vec3[4]
            ]);
            // (4,2)
            let a_o_vec4 = new Float32Array([
                0.1, 0.2, 0.2, 0.1, // vec2(0.1, 0.2, 0.2, 0.1) / a_o_vec4[0]
                0.3, 0.4, 0.2, 0.1, // vec2(0.3, 0.4, 0.2, 0.1) / a_o_vec4[1]
            ]);
            

            o_webgl_program = f_o_webgl_program(
                o_canvas,
                `#version 300 es
                in vec4 a_o_vec_position_vertex;
                void main() {
                    gl_Position = a_o_vec_position_vertex;
                }`, 
                `#version 300 es
                precision mediump float;
                out vec4 fragColor;
                uniform vec2 o_scl_canvas;
                uniform float n_ms_time; // we expect the float variable here in the shader
                uniform vec2 o_vec2;
                uniform vec3 o_vec3;
                uniform vec4 o_vec4;
                uniform float a_n[${a_n.length}];
                uniform vec2 a_o_vec2[${a_o_vec2.length/2}];
                uniform vec2 a_o_vec3[${a_o_vec3.length/3}];
                uniform vec2 a_o_vec4[${a_o_vec4.length/4}];

                uniform sampler2D o_texture_0;
                uniform sampler2D o_texture_1;

                void main() {
                    // gl_FragCoord is the current pixel coordinate and available by default
                    vec2 o_trn_pix_nor = (gl_FragCoord.xy - o_scl_canvas.xy*.5) / vec2(min(o_scl_canvas.x, o_scl_canvas.y));
                    vec2 o_trn_pix_nor2 = (o_trn_pix_nor+.5);
                    o_trn_pix_nor2.y = 1.-o_trn_pix_nor2.y;
                    float n1 = (o_trn_pix_nor.x*o_trn_pix_nor.y);
                    float n2 = sin(length(o_trn_pix_nor)*3.);
                    float n_t = n_ms_time *0.005;
                    float n = sin(n_t*0.2)*n1 + 1.-cos(n_t*0.2)*n2; 

                    vec4 o_pixel_from_image_0 = texture(o_texture_0, o_trn_pix_nor2+vec2(0.009, -0.08));
                    vec4 o_pixel_from_image_1 = texture(o_texture_1, o_trn_pix_nor2+vec2(0.009, -0.08));

                    fragColor = (clamp(vec4(
                        sin(n*33.+0.1+n_t), 
                        sin(n*33.+0.0+n_t), 
                        sin(n*33.-0.1+n_t), 
                        1.
                    ), 0., 1.)
                    +(1.-o_pixel_from_image_0))
                    *(1.-o_pixel_from_image_1);
                }`
            )
            // passing variables
            
            let o_ufloc__n_ms_time = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'n_ms_time');
            o_webgl_program?.o_ctx.uniform1f(o_ufloc__n_ms_time, 0.5);

            let o_ufloc__o_vec2 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'o_vec2');
            o_webgl_program?.o_ctx.uniform2f(o_ufloc__o_vec2, 0.5, 0.5);

            let o_ufloc__o_vec3 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'o_vec3');
            o_webgl_program?.o_ctx.uniform3f(o_ufloc__o_vec3, 0.5, 0.5, 0.5);

            let o_ufloc__o_vec4 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'o_vec4');
            o_webgl_program?.o_ctx.uniform4f(o_ufloc__o_vec4, 0.5, 0.5, 0.5, 0.5);

            let o_ufloc__a_n = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'a_n');
            o_webgl_program?.o_ctx.uniform1fv(o_ufloc__a_n, a_n);

            let o_ufloc__a_o_vec2 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'a_o_vec2');
            o_webgl_program?.o_ctx.uniform2fv(o_ufloc__a_o_vec2, a_o_vec2);

            let o_ufloc__a_o_vec3 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'a_o_vec3');
            o_webgl_program?.o_ctx.uniform3fv(o_ufloc__a_o_vec3, a_o_vec3);

            let o_ufloc__a_o_vec4 = o_webgl_program?.o_ctx.getUniformLocation(o_webgl_program?.o_shader__program, 'a_o_vec4');
            o_webgl_program?.o_ctx.uniform4fv(o_ufloc__a_o_vec4, a_o_vec4);

            // passing a texture 
            let f_o_img = async function(s_url){
                return new Promise((f_res, f_rej)=>{
                    let o = new Image();
                    o.onload = function(){
                        return f_res(o)
                    }
                    o.onerror = (o_err)=>{return f_rej(o_err)}
                    o.src = s_url;
                })
            }
            let o_img_0 = await f_o_img('./deno_logo.jpg')
            let o_gl = o_webgl_program?.o_ctx;
            const o_texture_0 = o_gl.createTexture();
            o_gl.bindTexture(o_gl.TEXTURE_2D, o_texture_0);
            o_gl.texImage2D(o_gl.TEXTURE_2D, 0, o_gl.RGBA, o_gl.RGBA, o_gl.UNSIGNED_BYTE, o_img_0);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_WRAP_S, o_gl.CLAMP_TO_EDGE);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_WRAP_T, o_gl.CLAMP_TO_EDGE);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_MIN_FILTER, o_gl.LINEAR);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_MAG_FILTER, o_gl.LINEAR);
    
            o_gl.bindTexture(o_gl.TEXTURE_2D, null);  // Unbind the texture

            let o_img_1 = await f_o_img('./module_banner.png')
            const o_texture_1 = o_gl.createTexture();
            o_gl.bindTexture(o_gl.TEXTURE_2D, o_texture_1);
            o_gl.texImage2D(o_gl.TEXTURE_2D, 0, o_gl.RGBA, o_gl.RGBA, o_gl.UNSIGNED_BYTE, o_img_1);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_WRAP_S, o_gl.CLAMP_TO_EDGE);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_WRAP_T, o_gl.CLAMP_TO_EDGE);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_MIN_FILTER, o_gl.LINEAR);
            o_gl.texParameteri(o_gl.TEXTURE_2D, o_gl.TEXTURE_MAG_FILTER, o_gl.LINEAR);
            o_gl.bindTexture(o_gl.TEXTURE_2D, null);  // Unbind the texture

            document.body.appendChild(o_canvas);

            // this will render the webgl program once
            f_render_from_o_webgl_program(o_webgl_program);

            // to create an animation we have to render multiple frames 
            // with a short delay this will create the impression of moving things
            let n_id_raf = 0;
            let n_ms_last = 0;
            let n_ms_sum = 0;
            let n_ms_count = 0;
            let f_raf = function(n_ms){

                // ------------- performance measuring: start
                let n_ms_delta = n_ms-n_ms_last;
                n_ms_last = n_ms
                n_ms_sum = parseFloat(n_ms_sum) + parseFloat(n_ms_delta);
                n_ms_count+=1;
                if(n_ms_sum > 1000){
                    console.log(`n_fps ${1000/(n_ms_sum/n_ms_count)}`)
                    n_ms_sum= 0;
                    n_ms_count= 0;
                }
                // ------------- performance measuring: end

                o_webgl_program?.o_ctx.uniform1f(o_ufloc__n_ms_time, window.performance.now());

                // it is important to update each texture binding on each render call
                let n_idx_texture = 0;
                o_gl.activeTexture(o_gl.TEXTURE0+n_idx_texture);
                o_gl.bindTexture(o_gl.TEXTURE_2D, o_texture_0);
                const o_uloc_o_texture = o_gl.getUniformLocation(o_webgl_program?.o_shader__program, 'o_texture_0');
                o_gl.uniform1i(o_uloc_o_texture, n_idx_texture);  


                n_idx_texture = 1;
                o_gl.activeTexture(o_gl.TEXTURE0+n_idx_texture);
                o_gl.bindTexture(o_gl.TEXTURE_2D, o_texture_1);
                const o_uloc_o_texture_1 = o_gl.getUniformLocation(o_webgl_program?.o_shader__program, 'o_texture_1');
                o_gl.uniform1i(o_uloc_o_texture_1, n_idx_texture);  

                
                f_render_from_o_webgl_program(o_webgl_program);

                n_id_raf = requestAnimationFrame(f_raf)
                

            }
            n_id_raf = requestAnimationFrame(f_raf)

            // when finished or if we want to reinitialize a new programm with different GPU code
            // we have to first delete the program
            f_delete_o_webgl_program(o_webgl_program)