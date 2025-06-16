
export function parserGet(obj, path) {
    if (path.charAt(0) != '/') {
        path = '/' + path
    }
    let childs = path.split("/")
    //console.log(childs);
    let value = obj
    if (childs[1].trim() != '') {
        for (let i = 1; i < childs.length; i++) {
            if (childs[i] != '') {
                if (value[childs[i]]) {
                    value = value[childs[i]]
                } else {
                    value = null
                    break
                }
            }
        }
    }
    return value
}

export function parserSet(obj, path, elem) {
    if (path.charAt(0) != '/') {
        path = '/' + path
    }
    let childs = path.split("/")
    //console.log("childs",childs);
    let value = obj
    if (childs[1].trim() != '') {
        for (let i = 1; i < childs.length; i++) {
            let childKey = childs[i]
            if(childKey.indexOf(".") != -1) {
                childKey = childKey.replaceAll(".","/")
                //console.log("childKey",childKey);                
            }
            if (childKey != '') {
                if (i == childs.length - 1) {
                    if(elem === null) {
                        //console.log("deleting key...");
                        delete value[childKey] 
                    } else {
                        value[childKey] = elem
                    }
                } else {
                    if (value[childKey]) {
                        value = value[childKey]
                    } else {
                        value[childKey] = {}
                        value = value[childKey]
                    }
                }
            } else {
                console.error('Invalid path - / expected')                    
                return null
            }
        }
    }
    return elem
}