// here should be functions that really are only functions
// they take arguments do something and return something
// they should not depend on runtime data from the runtime scope
// for example
// do 
// let f_n_sum = function(n_1, n_2){
//     return n_1 + n_2
// }
// // don't 
// let n_base = 10
// let f_n_sum_dont = function(n_1){
//     return n_base + n_1
// }
// export {
//     f_n_sum
// }
let f_o_entry = function(
    name,
    o_stat
){
    return {
        name,
        o_stat,
    }
}
let f_o_folder = function(
    o_entry,
    a_o_entry
){
    return {
        o_entry, 
        a_o_entry,
    }
}


let f_o_image = function(
    s_path,
    o_js_image_element,
    o_object_url, 
    s_data_url_jpg_thumb
){
    return { 
        s_path,
        o_js_image_element,
        o_object_url, 
        s_data_url_jpg_thumb
    }
}
let f_o_data = function(a_o_image){
    return {
        a_o_image
    }
};
export {
    f_o_folder, 
    f_o_image,
    f_o_data, 
    f_o_entry,
}