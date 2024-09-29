
import {
    f_websersocket_serve,
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@1.0.3/mod.js"

import {
    O_ws_client
} from "./classes.module.js"
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";

import { f_o_config } from "./functions.module.js";
import {
    f_a_o_entry__from_s_path
} from "https://deno.land/x/handyhelpers@4.0.7/mod.js"
import { O_folder } from "./localhost/classes.module.js";

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

        let o_folder = new O_folder(
            {
                name: o_param.s_path.split('/').pop(), 
                o_stat: await Deno.stat(o_param.s_path)
            }, 
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
        let s_path = o_url.search.split('=').pop()
        console.log(s_path)
        let a_n_u8 = await Deno.readFile(decodeURI(s_path))
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