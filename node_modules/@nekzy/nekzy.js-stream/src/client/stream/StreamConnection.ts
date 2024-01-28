import { VoiceConnection } from "../voice/VoiceConnection";
import { VoiceOpCodes } from "../voice/VoiceOpCodes";

export class StreamConnection extends VoiceConnection
{
    private _streamKey: string;
    private _serverId: string;

    public override setSpeaking(speaking: boolean): void {
        this.sendOpcode(VoiceOpCodes.speaking, {
            delay: 0,
            speaking: speaking ? 2 : 0,
            ssrc: this.ssrc
        });
    }

    public override get serverId(): string {
        return this._serverId;
    }

    public set serverId(id: string) {
        this._serverId = id;
    }

    public get streamKey(): string {
        return this._streamKey;
    }
    public set streamKey(value: string) {
        this._streamKey = value;
    }
}