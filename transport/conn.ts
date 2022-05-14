export interface Conn {
    write(data: string | Buffer): void
    read(): string | Buffer
}