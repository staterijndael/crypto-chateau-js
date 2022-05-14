import {Conn} from "../conn"
import TcpSocket from 'react-native-tcp-socket';

class ConnMobile implements Conn{
    client: TcpSocket.Socket;
    data: string | Buffer;
    dataReady: boolean

    constructor(ip: string, port: number) {
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

            this.data = data
            this.dataReady = true
        })

        this.data = '';
        this.dataReady = false
    }
    write(data: string | Buffer): void{
        this.client.write(data)
    }

    read(): string | Buffer{
        for (;!this.dataReady;){
            continue
        }

        const currentData = this.data
        this.dataReady = false
        
        return currentData
    }
}