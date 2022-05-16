import {Conn} from "../conn"
import TcpSocket from 'react-native-tcp-socket';
import {Encrypt, Decrypt} from "../../aes-256/aes256"

export class ConnMobile implements Conn{
    client: TcpSocket.Socket;
    data: Uint8Array;
    dataReady: boolean

    encryption: boolean
    sharedKey: Uint8Array

    constructor(ip: string, port: number) {
        this.encryption = false
        this.sharedKey = new Uint8Array();

        this.client = new TcpSocket.Socket()
        this.client.connect({
            host: ip,
            port: port,
            tls: false,
        })

        this.client.on('data', (data) => {
            for (;this.dataReady;){
                continue
            }

            this.data = Buffer.from(data)
            this.dataReady = true
        })

        this.data = Buffer.from("");
        this.dataReady = false
    }
    write(data: Uint8Array): void{
        if (this.encryption){
            data = Encrypt(data.toString(), this.sharedKey)
        }
        this.client.write(data)
    }

    read(): Uint8Array{
        for (;!this.dataReady;){
            continue
        }

        const currentData = this.data
        this.dataReady = false

        if (this.encryption){
            const decryptedData = Decrypt(currentData, this.sharedKey)

            return decryptedData
        }else{
            return currentData
        }
    }

    close(): void{
        this.client.destroy()
    }
}