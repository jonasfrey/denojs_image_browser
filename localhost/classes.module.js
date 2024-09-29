// here only struct/object/class/model definitions should be mentioned

// for example
class O_folder{
    constructor(
        o_entry, 
        a_o_entry,
    ){
        this.o_entry = o_entry
        this.a_o_entry = a_o_entry
    }
}
class O_image{
    constructor(
        s_path, 
        o_js_image_element,
        o_object_url, 
    ){
        this.s_path = s_path
        this.o_js_image_element = o_js_image_element
        this.o_object_url = o_object_url
    }
}

export {
    O_image, 
    O_folder
}