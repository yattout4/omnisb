import { VoiceUdp } from "../voice/VoiceUdp";
import { BaseMediaPacketizer } from "./BaseMediaPacketizer";

const time_inc = (48000 / 100) * 2;

export class AudioPacketizer extends BaseMediaPacketizer {
    constructor(connection: VoiceUdp) {
        super(connection, 0x78);
    }

    public override createPacket(chunk: any): Buffer {
        const header = this.makeRtpHeader(this.connection.voiceConnection.ssrc);

        const nonceBuffer = this.connection.getNewNonceBuffer();
        return Buffer.concat([header, this.encryptData(chunk, nonceBuffer), nonceBuffer.subarray(0, 4)]);
    }

    public override onFrameSent(): void {
        this.incrementTimestamp(time_inc);
    }
}