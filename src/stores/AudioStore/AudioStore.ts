import { makeObservable, observable, action } from 'mobx';

export interface AudioData {
    currentAudioID: number;
    title: string;
    artist: string;
    duration: string;
    currentTime: string;
}

export class AudioStore {
    audioData: AudioData | null = null;

    constructor() {
        makeObservable(this, {
            audioData: observable,
            setAudioData: action,
            updateCurrentTime: action,
        });
    }

    setAudioData(data: AudioData) {
        this.audioData = data;
    }

    updateCurrentTime(time: string) {
        if (this.audioData) {
            this.audioData.currentTime = time;
        }
    }
}

export default new AudioStore();
