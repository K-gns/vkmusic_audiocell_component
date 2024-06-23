import { makeObservable, observable, action } from 'mobx';

export interface AudioData {
    currentAudioID: number;
    title: string;
    artist: string;
    duration: string;
}

export class AudioStore {
    audioData: AudioData | null = null;

    constructor() {
        // Initialize observables and actions
        makeObservable(this, {
            audioData: observable,
            setAudioData: action,
        });
    }

    setAudioData(data: AudioData) {
        this.audioData = data;
    }
}

export default new AudioStore();
