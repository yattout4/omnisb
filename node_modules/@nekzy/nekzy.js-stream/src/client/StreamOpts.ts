export interface StreamOpts {
    width: number;
    height: number;
    fps: number;
    bitrateKbps: number;
    hardware_encoding: boolean;
}

export const streamOpts: StreamOpts = {
    width: 1080,
    height: 720,
    fps: 30,
    bitrateKbps: 1000,
    hardware_encoding: false
}

export const setStreamOpts = (
    width?: number, 
    height?: number, 
    fps? : number, 
    bitrateKbps?: number, 
    hardware_encoding?: boolean
) => {
    streamOpts.width = width ?? streamOpts.width;
    streamOpts.height = height ?? streamOpts.height;
    streamOpts.fps = fps ?? streamOpts.fps;
    streamOpts.bitrateKbps = bitrateKbps ?? streamOpts.bitrateKbps;
    streamOpts.hardware_encoding = hardware_encoding ?? streamOpts.hardware_encoding;
}