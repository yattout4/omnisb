import { streamOpts } from "../StreamOpts";
import { VoiceUdp } from "../voice/VoiceUdp";
import { BaseMediaPacketizer, max_int16bit } from "./BaseMediaPacketizer";

/**
 * VP8 payload format
 * 
 */
export class VideoPacketizer extends BaseMediaPacketizer {
    private _pictureId: number;

    constructor(connection: VoiceUdp) {
        super(connection, 0x67, true);
        this._pictureId = 0;
    }

    private incrementPictureId(): void {
        this._pictureId++;
        if(this._pictureId > max_int16bit) this._pictureId = 0;
    }

    public override createPacket(chunk: any, isLastPacket = true, isFirstPacket = true): Buffer {
        if(chunk.length > this.mtu) throw Error('error packetizing video frame: frame is larger than mtu');

        const packetHeader = this.makeRtpHeader(this.connection.voiceConnection.videoSsrc, isLastPacket);

        const packetData = this.makeFrame(chunk, isFirstPacket);
    
        // nonce buffer used for encryption. 4 bytes are appended to end of packet
        const nonceBuffer = this.connection.getNewNonceBuffer();
        return Buffer.concat([packetHeader, this.encryptData(packetData, nonceBuffer), nonceBuffer.subarray(0, 4)]);
    }

    public override onFrameSent(): void {
        // video RTP packet timestamp incremental value = 90,000Hz / fps
        this.incrementTimestamp(90000 / streamOpts.fps);
        this.incrementPictureId();
    }

    private makeFrame(frameData:any, isFirstPacket: boolean): Buffer {
        const headerExtensionBuf = this.createHeaderExtension();
    
        // vp8 payload descriptor
        const payloadDescriptorBuf = Buffer.alloc(2);
    
        payloadDescriptorBuf[0] = 0x80;
        payloadDescriptorBuf[1] = 0x80;
        if (isFirstPacket) {
            payloadDescriptorBuf[0] |= 0b00010000; // mark S bit, indicates start of frame
        }
    
        // vp8 pictureid payload extension
        const pictureIdBuf = Buffer.alloc(2);
    
        pictureIdBuf.writeUIntBE(this._pictureId, 0, 2);
        pictureIdBuf[0] |= 0b10000000;
    
        return Buffer.concat([headerExtensionBuf, payloadDescriptorBuf, pictureIdBuf, frameData]);
    }
}