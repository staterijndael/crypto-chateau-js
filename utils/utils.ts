export function appendData(oldData: Uint8Array, newData: Uint8Array | number, lastIndex: number, capacity: number): [Uint8Array, number]{
    const freeSpace = oldData.length - lastIndex + 2
    if (typeof newData == "number"){
        newData = new Uint8Array([newData as number])
    }
    if (freeSpace >= newData.length){
        for (var i = 0; i < newData.length; i++){
            oldData[lastIndex + 1 + i] = newData[i]
        }

        return [oldData, lastIndex + newData.length]
    }else{
        let result: Uint8Array = new Uint8Array(oldData.length + newData.length + capacity)
        for (var i = lastIndex + 1; i < oldData.length; i++){
            oldData[i] = newData[lastIndex + 1 - i]
        }

        result.set(oldData)

        for (var i = oldData.length - lastIndex + 2; i < newData.length; i++){
            result[i] = newData[i]
        }

        return [result, oldData.length + newData.length - 1]
    }
}

export function stringToUInt8 (s: string): Uint8Array { 
    var util= require('util');
    return new util.TextEncoder("utf-8").encode(s)
}