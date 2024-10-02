
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@3.9/mod.js'

let o_mod_translatable_scalable_window = await import('https://deno.land/x/f_o_html_from_o_js@4.0.3/localhost/jsh_modules/translatable_scalable_window/mod.js');


import {
    f_o_webgl_program,
    f_delete_o_webgl_program,
    f_resize_canvas_from_o_webgl_program,
    f_render_from_o_webgl_program, 
    f_n_idx_ensured_inside_array
} from "https://deno.land/x/handyhelpers@4.0.7/mod.js"

import {
    f_s_hms__from_n_ts_ms_utc,
} from "https://deno.land/x/date_functions@1.4/mod.js"
import { f_o_image } from "./functions.module.js"

let o_folder__root = await ( await fetch('./f_o_folder', {method: "post", body: JSON.stringify({s_path: '/'})})).json();
let a_o_folder__path = [
    o_folder__root
];
let o_data__from_cache = await ( await fetch('./f_o_data_from_cache')).json();
console.log(o_data__from_cache)
let o_state = {
    n_scl_x_nor_imagegallery: 0.1,
    o_state__overlay_image_gallery: (o_data__from_cache?.o_state__overlay_image_gallery) ? o_data__from_cache.o_state__overlay_image_gallery : {
        o_scl: {n_x: 500, n_y: 500}, 
        o_trn: {n_x: 200, n_y: 200}, 
        b_render: false,
        s_style: "background: blue"
    },
    o_webgl_program: null,
    a_o_folder__path: (o_data__from_cache.a_o_folder__path) ? o_data__from_cache.a_o_folder__path : a_o_folder__path ,
    o_folder__root,
    a_o_image: [],
    s_filter: ".jpg .png",
    a_o_entry: [],
    o_entry: null,
    s_name_img: '', 
    n_idx_a_o_entry: 0,
    b_render_o_js__overlay_image_gallery: false,
}


window.o_state = o_state
o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
  );
f_add_css(
    `
    .a_o_entry{
        position:absolute;
        botton: 0;
        left : 0;
        width:100%;
        height: 100%;
        align-items:center;
        max-width:100%;
        overflow-x:scroll;
        overflow-y: hidden;
        display:flex;
        flex-wrap:wrap;
        flex-direction:row;
    }
    .o_entry_name{
        position:absolute; 
        bottom:0;
        left: 0;
        display:none;
    }
    .o_entry_name:hover{
        display:block;
    }
    .o_entry{
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        object-fit:cover;
    }
    .s_o_img_s_name{
        z-index: 1;
        position: absolute;
        background: rgba(12,12,12,0.2);
        padding: 1rem;
        top: 1rem;
        left: 1rem;
    }
    .o_img{
        position:absolute;
        left:0;
        top:0;
        width: 100vw;
        height: 100vh;
        object-fit:cover;
        z-index:-2;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    }
    .inputs{
        z-index:1;
        position:absolute;
    }
    .leftright{
        width: 50vw; 
        height: 100vh;
        position:absolute;
        top:0;
        z-index:0;
    }
    .leftright:hover{
        background: rgba(0.1, 0.1, 0.1, 0.5);
    }
    img{
        width: 100%;
        height: auto;
    }
    body{
        overflow:hidden;
        min-height: 100vh;
        min-width: 100vw;
        /* background: rgba(0,0,0,0.84);*/
        display:flex;
        justify-content:center;
        align-items:flex-start;
    }
    canvas{
        width: 100%;
        height: 100%;
        position:fixed;
        z-index:-1;
    }
    #o_el_time{
        margin:1rem;
        background: rgba(0, 0, 0, 0.4);
        padding: 1rem;
    }
    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
);
let f_o_image_from_s_src = async function(s_src){
    return new Promise(
        (f_res, f_rej)=>{
            let o_img = new Image();
            o_img.onload = ()=>{
                return f_res(o_img); 
            }
            o_img.onerror = (o_err)=>{
                return f_rej(o_err)
            }
            o_img.src = s_src
        }
    )
}

let f_o_image_from_s_path = async function(s_path){

    return new Promise(
        async (f_res, f_rej)=>{

            let o_image = o_state.a_o_image.find(o=>o.s_path == s_path);
            if(!o_image){

                let o_js_image_element = await f_o_image_from_s_src(`./f_o_img?s_path=${s_path}&b_thumbnail_only=true`);
                let o_canvas = document.createElement('canvas');
                o_canvas.width = o_js_image_element.width;
                o_canvas.height = o_js_image_element.height;
                let o_ctx = o_canvas.getContext('2d');
                o_ctx.drawImage(o_js_image_element, 0, 0);
                o_canvas.toBlob(function(o_blob) {
                  let o_object_url = URL.createObjectURL(o_blob);
                  o_image = f_o_image(s_path, o_js_image_element, o_object_url);
                  o_state.a_o_image.push(o_image) 
                  return f_res(o_image)
                }); 

            } 
            if(o_image){
                return f_res(o_image)
            }

        }
    )


}
let f_o_assigned = function(f, s, o){
    let o2 = {
        f_o_jsh:f
    }
    if(f?.f_o_jsh){
        o2 = f
    }
    return Object.assign(
        o, 
        {
            [s]: o2
        } 
    )[s]
}
window.addEventListener('resize', ()=>{
    if(o_state.o_webgl_program){

        // this will resize the canvas and also update 'o_scl_canvas'
        f_resize_canvas_from_o_webgl_program(
            o_state.o_webgl_program,
            o_state.o_webgl_program.o_canvas.parentElement.clientWidth, 
            o_state.o_webgl_program.o_canvas.parentElement.clientHeight, 
        )
        f_render_from_o_webgl_program(o_state.o_webgl_program);
    }

});
let o = await f_o_html__and_make_renderable(
    {
        a_o: [
            {
                class: "inputs", 
                a_o: [
                    {
                        s_tag: "button", 
                        onclick: async ()=>{
                            o_state.o_state__overlay_image_gallery.b_render = !o_state.o_state__overlay_image_gallery.b_render;
                            await o_state.o_state__overlay_image_gallery.o_js._f_render();
                        },
                        a_o: [
                            {
                                class:`fa-solid fa-images`, 
                                style: 'padding-right: 1rem'
                            },
                        ]
                    },
                    f_o_assigned(
                        ()=>{
  
                            return {
                                style: "display:flex; align-items: row;", 
                                a_o: [
                                    {
                                        a_o: [
                                            o_mod_translatable_scalable_window.f_o_js( // this will add the variables to the state
                                                [
                                                    f_o_assigned(
                                                        {
                                                            f_after_f_o_html__and_make_renderable: (o_e)=>{                        
                                                                o_e.scrollTo(
                                                                    o_state.n_scroll_left, 
                                                                    0
                                                                )
                                                            },
                                                            f_o_jsh: ()=>{
                                                                return {
                                                                    class: "a_o_entry",
                                                                    onscroll: (o_e)=>{
                                                                        o_state.n_scroll_left = o_e.target.scrollLeft
                                                                    },
                                                                    a_o: o_state.a_o_entry.map(o_entry=>{
                                                                        return {
                                                                            class: "o_entry clickable", 
                                                                            style: [
                                                                                `padding: 0`,       
                                                                                `flex-basis: ${o_state.n_scl_x_nor_imagegallery*100}%`,
                                                                            ].join(`;`),
                                                                            onpointerdown: async ()=>{
                                                                                let n_idx = o_state.a_o_entry.indexOf(o_entry);
                                                                                await f_update_from_n_idx_a_o_entry(n_idx)
                                                                            },
                                                                            a_o: [
                                                                                {   
                                                                                    class: "o_entry_name",
                                                                                    innerText: o_entry.name
                                                                                }, 
                                                                                ...[
                                                                                    (o_entry?.o_image)
                                                                                    ? {
                                                                                        s_tag: 'img', 
                                                                                        src: o_entry.o_image.o_object_url
                                                                                    }
                                                                                    : 
                                                                                    false
                                                                                ].filter(v=>v)
                                                                            ]
                                                                        }
                                                                    })
                                                                }
                                                            }, 
                                                        },
                                                        'o_js__image_gallery', 
                                                        o_state
                                                    ),
                                                    {
                                                    style: "position:absolute; bottom:0;right:0",
                                                    a_o: [
                                                        {
                                                            s_tag: 'button', 
                                                            onclick: async ()=>{
                                                                o_state.n_scl_x_nor_imagegallery = Math.min(
                                                                    o_state.n_scl_x_nor_imagegallery+0.025,
                                                                    1.0 
                                                                );
                                                                await o_state.o_js__image_gallery._f_render();

                                                            },
                                                            a_o: [{class: "fa-solid fa-magnifying-glass-plus"}]
                                                        },
                                                        {
                                                            s_tag: 'button', 
                                                            onclick: async ()=>{
                                                                o_state.n_scl_x_nor_imagegallery = Math.max(
                                                                    o_state.n_scl_x_nor_imagegallery-0.025,
                                                                    0.025
                                                                );
                                                                await o_state.o_js__image_gallery._f_render();
                                                            },
                                                            a_o: [{class: "fa-solid fa-magnifying-glass-minus"}]
                                                        },
                                                        {
                                                            class: "clickable",
                                                            onpointerdown: (o_e)=>{o_mod_translatable_scalable_window.f_update_pointerdown_trn(
                                                                o_state.o_state__overlay_image_gallery, 
                                                                o_e
                                                            )},
                                                            a_o:[
                                                                {
                                                                    s_tag: "i", 
                                                                    class: "fa-solid fa-maximize"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            class: "clickable",
                                                            onpointerdown: (o_e)=>{o_mod_translatable_scalable_window.f_update_pointerdown_scl(
                                                                o_state.o_state__overlay_image_gallery, 
                                                                o_e
                                                            )},
                                                            a_o:[
                                                                {
                                                                    s_tag: "i", 
                                                                    class: "fa-solid fa-up-right-and-down-left-from-center"
                                                                }
                                                            ]
                                                        }, 
                                                    ]
                                                    }, 
                                                ], 
                                                o_state.o_state__overlay_image_gallery
                                            )
                                        ]
                                    },
                                    {
                                        innerText: "<",
                                        s_tag: "button", 
                                        onpointerdown: async ()=>{
                                            if(o_state.a_o_folder__path.length > 1){
                                                o_state.a_o_folder__path.pop();
                                                await o_state.o_js__path._f_render();  
                                            }
                                        }
                                    },
                                    ...o_state.a_o_folder__path.map(o_folder=>{
                                        return [
                                            {
                                                class: "clickable", 
                                                a_o: [
                                                    {
                                                        class:`fa-solid fa-folder`, 
                                                        style: 'padding-right: 1rem'
                                                    },
                                                    {
                                                        innerText: o_folder.o_entry.name,
                                                    },
                                                ]
                                            },
                                            {
                                                innerText: "/"
                                            }
                                        ]
                                    }).flat().slice(0, -1), 
                                    f_o_assigned(
                                        {
                                            f_before_f_o_html__and_make_renderable: ()=>{
                                                o_state.b_render_select = false
                                            },
                                            f_o_jsh: async()=>{
                                                let a_o_entry__folder_child = o_state.a_o_folder__path.at(-1).a_o_entry.filter(o=>{return o.isDirectory})
                                                
                                                return {
                                                    a_o: [
                                                        {
                                                            a_o: [
                                                                {
                                                                    b_render: a_o_entry__folder_child.length > 0,
                                                                    innerText: 'select',
                                                                },
                                                                f_o_assigned(
                                                                    ()=>{
                                                                        return {
                                                                            style: 'position: absolute;top:0;left:0',
                                                                            b_render: o_state.b_render_select == true,
                                                                            a_o: [
                                                                                ...o_state.a_o_folder__path.at(-1).a_o_entry
                                                                                .sort(
                                                                                    (o1, o2)=>{
                                                                                        for (let s of ['isDirectory', 'isFile', 'isSymlink']) {
                                                                                            if (o1[s] < o2[s]) return 1;
                                                                                            if (o1[s] > o2[s]) return -1;
                                                                                        }
                                                                                        return 0;
        
                                                                                    }
                                                                                )
                                                                                .map(o_entry=>{
                                                                                    return {
                                                                                        class: `${(o_entry.isDirectory) ? 'clickable': ''}`, 
                                                                                        style: 'display:flex;flex-direction:row',
                                                                                        onpointerdown: async ()=>{
                                                                                            if(o_entry.isDirectory){
                                                                                                let s_path = `${o_state.a_o_folder__path.map(o=>o.o_entry.name).join('/')}/${o_entry.name}`;
                                                                                                let o_folder = await ( await fetch('./f_o_folder', {method: "post", body: JSON.stringify({s_path: s_path})})).json();
                                                                                                o_state.a_o_folder__path.push(
                                                                                                    o_folder
                                                                                                );
                                                                                                await o_state.o_js__path._f_render();  
                                                                                            }
                                                                                        },
                                                                                        a_o: [
                                                                                            {
                                                                                                class:`fa-solid fa-${(o_entry.isFile) ? 'file' : (o_entry.isDirectory) ? 'folder' : 'link' }`, 
                                                                                                style: 'padding-right: 1rem'
                                                                                            },
                                                                                            {
                                                                                                innerText: o_entry.name,
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                })
                                                                            ]
                                                                        }
                                                                    }, 
                                                                    'o_js__select_a_v', 
                                                                    o_state
                                                                )
                                                            ],
                                                            class: "clickable",
                                                            style: 'position:relative',
                                                            onpointerdown: async ()=>{
                                                                o_state.b_render_select = true
                                                                await o_state.o_js__select_a_v._f_render();
                                                            }
                                                        },    
                                                    ]
                                                }
                                                
                                            }
                                        },
 
                                        'o_js__select', 
                                        o_state, 
                                    ),
                                ]
                            }
                        }, 
                        'o_js__path', 
                        o_state
                    ),
                    {
                        s_tag: "button", 
                        onclick: async  ()=>{
                            o_state.s_path = `${o_state.a_o_folder__path.map(o=>o.o_entry.name).join('/')}`;

                            let a_s = o_state.s_filter.split(' ');
                            o_state.a_o_entry = o_state.a_o_folder__path.at(-1).a_o_entry.filter(o=>{
                                let s = a_s.find(s=>{
                                    return o.name.includes(s)
                                });
                                // console.log(s)
                                return o.isFile && s
                            });
                            for(let o_entry of o_state.a_o_entry){
                                f_o_image_from_s_path(`${o_state.a_o_folder__path.map(o=>o.o_entry.name).join('/')}/${o_entry?.name}`).then(o_image =>{
                                    o_entry.o_image = o_image
                                    o_state.a_o_image.push(
                                        o_image
                                    )
                                })
                            }
                            await o_state?.o_js__img?._f_render();
                            o_state.n_idx_a_o_entry = 0;
                            await f_update_from_n_idx_a_o_entry(o_state.n_idx_a_o_entry);
                        }, 
                        innerText: "load images"
                    },
                    {
                        innerText: "filter",
                    },
                    {
                        s_tag: "input", 
                        value: o_state.s_filter,
                        oninput: (o_e)=>{
                            o_state.s_filter = o_e.target.value
                        }
                    },
                    {
                        s_tag: "select",
                        onchange: async(o_e)=>{
                            let s = o_e.target.value;
                            // { isFile: true, isDirectory: false, isSymlink: false, size: 17755, mtime: "2024-03-22T16:15:44.107Z",
                            // atime: "2024-09-16T20:56:08.014Z"
                            // birthtime: "2024-03-22T16:15:42.058Z"
                            // blksize: 4096
                            // blocks: 40
                            // dev: 66311
                            // gid: 1000
                            // ino: 21251688
                            // isBlockDevice: false
                            // isCharDevice: false
                            // isDirectory: false
                            // isFifo: false
                            // isFile: true
                            // isSocket: false
                            // isSymlink: false
                            // mode: 33204
                            // mtime: "2024-03-22T16:15:44.107Z"
                            // nlink: 1
                            // rdev: 0
                            // size: 17755
                            // uid: 1000
                            if(s == 'name'){
                                o_state.a_o_entry = o_state.a_o_entry.sort(
                                    (o1, o2)=>{
                                        o1.name.localeCompare(o2.name)
                                    }
                                )
                            }
                            if(s == 'created'){
                                o_state.a_o_entry = o_state.a_o_entry.sort(
                                    (o1, o2)=>{
                                        let ot1 = new Date(o1.o_stat.birthtime);
                                        let ot2 = new Date(o2.o_stat.birthtime);
                                        return ot1.getTime()-ot2.getTime();
                                    }
                                )
                            }
                            if(s == 'modified'){
                                o_state.a_o_entry = o_state.a_o_entry.sort(
                                    (o1, o2)=>{
                                        let ot1 = new Date(o1.o_stat.mtime);
                                        let ot2 = new Date(o2.o_stat.mtime);
                                        return ot1.getTime()-ot2.getTime();
                                    }
                                )
                            }
        
                            console.log(o_state.a_o_entry.map(o=>o.name))
                        },
                        a_o: [
                            {
                                s_tag: "option", 
                                value: "name", 
                                innerText: "sort by name"
                            }, 
                            {
                                s_tag: "option", 
                                value: "modified", 
                                innerText: "sort by modified"
                            }, 
                            {
                                s_tag: "option", 
                                value: "created", 
                                innerText: "sort by created"
                            }
                        ]
                    },

                ]
            },

            f_o_assigned(
                {
                    f_after_f_o_html__and_make_renderable: (o)=>{

                        let o_canvas = o.querySelector('canvas')
                        if(!o_canvas){return }
                        o_state.o_webgl_program = f_o_webgl_program(
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
                        );
                        f_render_from_o_webgl_program(o_state.o_webgl_program);
                        f_resize_canvas_from_o_webgl_program(
                            o_state.o_webgl_program,
                            o_state.o_webgl_program.o_canvas.parentElement.clientWidth, 
                            o_state.o_webgl_program.o_canvas.parentElement.clientHeight, 
                        )
                    },
                    f_o_jsh:async  ()=>{
                        if(!o_state.o_image){
                            return {}
                        }
                        return {
                            class: 'o_img',
                            a_o: [
                                {
                                    class: 's_o_img_s_name',
                                    innerText: o_state.o_entry.name
                                },
                                {
                                    s_tag: "img", 
                                    src: o_state.o_image.o_object_url
                                }, 
                                {
                                    s_tag: "canvas", 
                                }
                            ]
                        }
                    }
                },
                'o_js__img',
                o_state, 
            ),
            {
                class: "leftright", 
                style: 'left:0', 
                onpointerdown: async ()=>{
                    await f_update_from_n_idx_a_o_entry(o_state.n_idx_a_o_entry+1)
                }
            }, 
            {
                class: "leftright", 
                style: 'right:0', 
                onpointerdown: async ()=>{
                    await f_update_from_n_idx_a_o_entry(o_state.n_idx_a_o_entry-1)
                }
            }, 

        ]
    }
);

let f_s_json_stringified_without_circular = function(o){
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    let s = JSON.stringify(o, (key, value) => {
    if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
    }
        return value;
    });
    cache = null; // Enable garbage collection
    return s
}
window.setInterval(async ()=>{
    // autosave

    let o_update = await ( await fetch('./f_update_settings', {method: "post", body: f_s_json_stringified_without_circular({
        a_o_folder__path: o_state.a_o_folder__path, 
        o_state__overlay_image_gallery: Object.assign({},o_state.o_state__overlay_image_gallery)
    })})).json();

}, 1000)

let f_update_from_n_idx_a_o_entry = async function(n_idx){
    if(o_state.a_o_entry.length == 0){return}
    o_state.n_idx_a_o_entry = f_n_idx_ensured_inside_array(n_idx, o_state.a_o_entry.length);

    o_state.o_entry = o_state.a_o_entry[o_state.n_idx_a_o_entry];
    o_state.o_image = await f_o_image_from_s_path(`${o_state.a_o_folder__path.map(o=>o.o_entry.name).join('/')}/${o_state.o_entry?.name}`);
    o_state.o_entry.o_image = o_state.o_image;

    await o_state.o_js__img._f_render();
    await o_state.o_js__image_gallery._f_render();

}

window.onkeydown = async function(o_e){
    if(o_e.key == 'ArrowLeft'){
        await f_update_from_n_idx_a_o_entry(o_state.n_idx_a_o_entry-1)
    }
    if(o_e.key == 'ArrowRight'){
        await f_update_from_n_idx_a_o_entry(o_state.n_idx_a_o_entry+1)
    }    
}
document.body.appendChild(o)