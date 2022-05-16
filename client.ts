import { isMobile } from "./dh/global";
import {Conn} from "./transport/conn"
import {ConnMobile} from "./transport/mobile/conn"
import {InsertUserRequest, InsertUserResponse} from "./types"
import {ServerHandshake} from "./transport/handshake"
import { stringToUInt8, appendData } from "./utils/utils";

class Client {
    conn: Conn;

    constructor(ip: string, port: number){
        if (isMobile){
            const conn = new ConnMobile(ip, port);

            this.conn = ServerHandshake(conn)
        }else{
            const conn = new ConnMobile(ip, port);

            this.conn = ServerHandshake(conn)
        }
    }

    InsertUser(request: InsertUserRequest): InsertUserResponse{
        let params: Map<string, Uint8Array> = new Map([
            ["UserID", new Uint8Array([request.UserID])]
        ]);

        const msg = generateMsg("InsertUser", params)

        this.conn.write(msg)
        const response = this.conn.read()


    }
}

function generateMsg(handler: string, params: Map<string, Uint8Array>): Uint8Array{
    let result = stringToUInt8(handler + "# ")

    let lastIndex: number = 0

    for (let [param, value] of params){
        const colonBytes = stringToUInt8(":")
        const commaBytes = stringToUInt8(",")
        const paramBytes = stringToUInt8(param)

        let newData: Uint8Array = new Uint8Array(paramBytes.length + colonBytes.length + value.length + commaBytes.length)
        newData.set(paramBytes)
        newData.set(colonBytes)
        newData.set(value)
        newData.set(commaBytes)

        let [res, inx] = appendData(result, newData, lastIndex, 1024)
        result = res
        lastIndex = inx
    }

    result = result.slice(0, result.length - 1)
}

function getParams(p: Uint8Array): Map<string, Uint8Array> {
	let params: Map<string, Uint8Array> = new Map()
	let paramBuf: Uint8Array = new Uint8Array();
	let valueBuf: Uint8Array = new Uint8Array();

    let paramBufLastIndex: number = 0
    let valueBufLastIndex: number = 0

    const colonByte = stringToUInt8(":")[0]
    const commaByte = stringToUInt8(",")[0]
    const spaceByte = stringToUInt8(" ")[0]

	var paramFilled: boolean = false
	for (var i = 0; i < p.length; i++) {
		if (p[i] == commaByte || i == p.length-1) {
			if ((i != p.length-1) && (p[i+1] == commaByte)) {
				continue
			}

			if (i == p.length-1) {
				[valueBuf, valueBufLastIndex] = appendData(valueBuf, p[i], valueBufLastIndex, 1024)
			}

			if (paramBuf.length != 0 && valueBuf.length != 0) {
				tmpBufParam := make([]byte, len(paramBuf))
				tmpBufValue := make([]byte, len(valueBuf))
				copy(tmpBufParam, paramBuf)
				copy(tmpBufValue, valueBuf)

				params[string(tmpBufParam)] = tmpBufValue
				valueBuf = valueBuf[:0]
				paramBuf = paramBuf[:0]

				paramFilled = false
			}
		} else if b == ':' {
			paramFilled = true
		} else if b == ' ' {
			continue
		} else {
			if !paramFilled {
				paramBuf = append(paramBuf, b)
			} else {
				valueBuf = append(valueBuf, b)
			}
		}
	}

	if len(paramBuf) != 0 || len(valueBuf) != 0 {
		return nil, errors.New("incorrect message format")
	}

	return params, nil
}

function GetHandlerName(p: Uint8Array): [Uint8Array, number] {
    const delimSymb: number = stringToUInt8('#')[0]
	let buf: Uint8Array = new Uint8Array(p.length)
    let currentBufIndex: number = 0
	for (var i = 0; i < p.length; i++) {
		if (p[i] == delimSymb) {
			return [buf, i + 1]
		}

        buf[currentBufIndex] = p[i]
        currentBufIndex++
	}

	throw "incorrect message format: handler name not found"
}
