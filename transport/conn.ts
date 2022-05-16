export interface Conn {
    encryption: boolean
    sharedKey: Uint8Array

    write(data: Uint8Array): void
    read(): Uint8Array
    close(): void
}