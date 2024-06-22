import { makeAutoObservable } from "mobx";

type Audio = {
    id: number,
    title: string,
    artist: string,
    url: string
}

class AudioStore {
    currentSongId : null | number = null;

    songs: Audio[] = [
        { id: 1, title: 'Grateful', artist: 'Neffex', url: '../../assets/mock_data/NEFFEX-Grateful.mp3' },
        { id: 2, title: 'Song Two', artist: 'Artist B', url: '../../assets/mock_data/NEFFEX-Grateful.mp3'},
    ];

    constructor() {
        makeAutoObservable(this);
    }

    public setCurrentSongId(id: number) {
        this.currentSongId = id;
    }

    private getSong(id : number | null) {
        return this.songs.find(song => song.id === id);
    }

    async loadSong(id: number) {
        this.setCurrentSongId(id);
        const path = this.getSong(id)?.url
        if (path) {
            return await import(path);
        }
    }
}

export default new AudioStore();
