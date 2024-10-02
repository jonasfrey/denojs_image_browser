
import {
    f_websersocket_serve,
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@1.0.3/mod.js"
import {
    decode as f_o_image_decoded, 
    Image
}from "https://deno.land/x/imagescript@1.3.0/mod.ts"
import {
    O_ws_client
} from "./classes.module.js"
import { ensureDir, ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";

import { f_o_config } from "./functions.module.js";
import {
    f_a_o_entry__from_s_path
} from "https://deno.land/x/handyhelpers@4.0.7/mod.js"
import { f_o_data, f_o_entry, f_o_folder, f_o_image } from "./localhost/functions.module.js";

import { Base64 } from "https://deno.land/x/bb64/mod.ts";

let s_path_abs_file_current = new URL(import.meta.url).pathname;
let s_path_abs_folder_current = s_path_abs_file_current.split('/').slice(0, -1).join('/');
const b_deno_deploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

let a_o_ws_client = []


// let o_config = await f_o_config();
// console.log({o_config});

let s_api_key = `rtrjRM`
let s_path_abs_folder_cached_shaders = './localhost/cached_shaders';
if(!b_deno_deploy){

    await ensureDir(s_path_abs_folder_cached_shaders)// deno deploy is read only...
}
let s_path_o_data_json = './gitignored_o_data.json';


function f_a_n_u8_from_s_b64(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

let f_o_data__from_cache = async function(){
    await ensureFile(s_path_o_data_json);
    let o_data = f_o_data([]);
    try {
        o_data = JSON.parse(
            await Deno.readTextFile(s_path_o_data_json)
        )
    } catch (error) {
        console.log(error)
    }
    return o_data;
}
let f_update_o_data__in_cache = async function(o_data){
    await Deno.writeTextFile(s_path_o_data_json, JSON.stringify(o_data))
}
let f_handler = async function(o_request){

    // websocket 'request' handling here
    if(o_request.headers.get('Upgrade') == 'websocket'){

        const {
            socket: o_socket,
            response: o_response
        } = Deno.upgradeWebSocket(o_request);
        let o_ws_client = new O_ws_client(
            crypto.randomUUID(),
            o_socket
        )
        a_o_ws_client.push(o_ws_client);

        o_socket.addEventListener("open", (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.open called'
            })
        });

        o_socket.addEventListener("message", async (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.message called'
            })
            let v_data = o_e.data;
            a_o_ws_client
                .filter(o=>o!=o_ws_client)  // send to all other clients, comment out to send to all clients
                .forEach(o=>{
                    o.o_socket.send('message was received from a client')

                })
        });
        o_socket.addEventListener("close", async (o_e) => {
            a_o_ws_client.splice(a_o_ws_client.indexOf(o_ws_client), 1);
            console.log({
                o_e, 
                s: 'o_socket.close called'
            })
        });

        return o_response;
    }
    // normal http request handling here
    let o_url = new URL(o_request.url);
    if(o_url.pathname == '/'){
        return new Response(
            await Deno.readTextFile(
                `${s_path_abs_folder_current}/localhost/client.html`
            ),
            { 
                headers: {
                    'Content-type': "text/html"
                }
            }
        );
    }
    if(o_url.pathname == '/f_o_data_from_cache'){
        let o_data = await f_o_data__from_cache();
        return new Response(
            JSON.stringify(o_data),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }
    if(o_url.pathname == '/f_update_settings'){
        let o_param = await o_request.json();
        let o_data = await f_o_data__from_cache();
        Object.assign(o_data, o_param);
        await f_update_o_data__in_cache(o_data);
        return new Response(
            JSON.stringify('success'),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }
    if(o_url.pathname == '/f_o_folder'){
        let o_param = await o_request.json();
        console.log(o_param)
        let a_o_entry = await f_a_o_entry__from_s_path(o_param.s_path)
        a_o_entry = (await Promise.all(a_o_entry.map(async o=>{
            if(o.isFile || o.isDirectory){
                o.o_stat = await Deno.stat(o_param.s_path+'/'+o.name);
                return o
            }
            return false
        }))).filter(v=>v);

        let o_folder = f_o_folder(
            f_o_entry(
                o_param.s_path.split('/').pop(), 
                await Deno.stat(o_param.s_path),
            ),
            a_o_entry
        )
        
        return new Response(
            JSON.stringify(o_folder),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }

    if(o_url.pathname.startsWith('/f_o_img')){
        // console.log(o_url);
        // let o_param = await o_request.json();
        // console.log(o_param)
        let a_s = o_url.search.substring(1).split('&');
        let o_param = Object.assign({},...a_s.map(s=>{
            let a_s = s.split('=');
            return {
                [a_s.shift()]: a_s.join('=')
            }
        }))
        let s_path = decodeURI(o_param.s_path)
        console.log(o_param)
        let o_image_existing = undefined;
        let o_data = await f_o_data__from_cache();
        if(o_param.b_thumbnail_only){
            o_image_existing = o_data.a_o_image.find(o=>{
                return o.s_path == s_path
            })
            console.log({a:o_data.a_o_image})

            if(o_image_existing){   
                console.log(`cached ${new Date()}`)
                let s_dataurl = o_image_existing.s_data_url_jpg_thumb;
                // let a_n_u8_jpeg_thumb = await Base64.fromFile(s_path_tmp).toStringWithMime();
                let s_b64 = o_image_existing.s_data_url_jpg_thumb.split(',').slice(1).join(',');
                let a_n_u8_jpeg_thumb = f_a_n_u8_from_s_b64(s_b64);
                console.log(a_n_u8_jpeg_thumb)
                return new Response(
                    a_n_u8_jpeg_thumb,
                );
                // return o_image_existing.s_
            }

        }
        let a_n_u8 = await Deno.readFile(s_path);
        if(o_image_existing == undefined && o_param.b_thumbnail_only){
            let o_image = await f_o_image_decoded(a_n_u8);
            console.log(o_image)
            // o_image = o_image.fit(200);
            o_image.resize(200, Image.RESIZE_AUTO);
            let a_n_u8_jpeg_thumb = await o_image.encodeJPEG(0.7*100);
            // let s_b64 = btoa(
            //     new TextEncoder().encode(a_n_u8_jpeg_thumb)
            // );
            // Base64.fromUint8Array
            let s_path_tmp = '/tmp/tmpimgb64.jpg'
            await Deno.writeFile(s_path_tmp, a_n_u8_jpeg_thumb)
            let s_data_url = await Base64.fromFile(s_path_tmp).toStringWithMime();
            console.log(s_data_url)
            // await Deno.remove(s_path_tmp)
            console.log(new Date().getTime())
            o_data.a_o_image.push(
                f_o_image(
                    s_path, 
                    null, 
                    null, 
                    s_data_url
                )
            )
            await f_update_o_data__in_cache(o_data);
            return new Response(
                a_n_u8_jpeg_thumb,
                // s_data_url
                // `data:image/jpg;base64,${s_b64}`
                // a_n_u8_jpeg_thumb,
            );
            console.log(o_image);
            Deno.exit();
        }
        console.log('image loaded from file system')
        return new Response(
            a_n_u8,
        );
    }

    return f_v_before_return_response__fileserver(
        o_request,
        `${s_path_abs_folder_current}/localhost/`
    )

}

let s_name_host = Deno.hostname(); // or maybe some ip adress 112.35.8.13
let b_development = s_name_host != 'the_server_name_here';
let s_name_host2 = (b_development) ? 'localhost': s_name_host;
// let o_info_certificates = {
//     s_path_certificate_file: './self_signed_cert_d40897fd-adae-434b-b72c-5c477abb561b.crt',
//     s_path_key_file: './self_signed_key_d40897fd-adae-434b-b72c-5c477abb561b.key'
// }
await f_websersocket_serve(
    [
        {
            n_port: 8080,
            b_https: false,
            s_hostname: s_name_host,
            f_v_before_return_response: f_handler
        },
        ...[
            (!b_deno_deploy) ? {
                // ...o_info_certificates,
                n_port: 8443,
                b_https: true,
                s_hostname: s_name_host,
                f_v_before_return_response: f_handler
            } : false
        ].filter(v=>v)   
    ]
);