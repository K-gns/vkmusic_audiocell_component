import {
    Cell,
    Div,
    Tappable,
    Image,
    Headline,
    Subhead,
} from "@vkontakte/vkui";
import styles from './AudioCell.module.css'
import coverImage from '../../assets/audiocell_cover.png';
import {useEffect, useRef, useState} from "react";
import MusicGraph from "../icons_animated/MusicGraph/MusicGraph.tsx";
import AudioStore, {AudioData} from "../../stores/AudioStore/AudioStore.ts";
import {MorePopover} from "../SettingModal/MorePopover.tsx";

//Mock-data импорты
import audioTrack from '../../assets/mock_data/NEFFEX-Grateful.mp3'
import songsData from '../../assets/mock_data/songs.json';


interface AudioCellProps {
    audioID: number;
    id?: string;
    className?: string;
}

export const AudioCell = (AudioCellProps: AudioCellProps) => {
    const {audioID} = AudioCellProps;

    //Mock-объект - данные песни
    const songData = songsData[audioID - 1];

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioSrc, setAudioSrc] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeDisplay, setTimeDisplay] = useState(songData.duration)


    const handleClick = async () => {
        //Загрузка трека с сервера при первом клике
        if (audioSrc === "") {
            await fetchSong(audioID)
        }

        togglePlayPause()
    }

    const fetchSong = async (id: number) => {
        // В реальном проекте я бы делал тут fetch аудио-файла с сервера по id,
        // сейчас сделано с помощью mock-объекта.
        // Аудиофайл запрашиваю только после клика, чтобы не грузить песню заранее,
        // иначе если у нас на странице будет 20 таких AudioCell - будет неоптимально по ресурсам
        const fetchedSong = audioTrack;
        if (fetchedSong) {
            setAudioSrc(fetchedSong);
            const audioData: AudioData = {
                currentAudioID: songData.id,
                title: songData.title,
                artist: songData.artist,
                duration: songData.duration,
                currentTime: '0:00'
            };
            AudioStore.setAudioData(audioData);
        } else {
            console.error(`Song with ID ${id} not found.`);
        }
    }

    const togglePlayPause = () => {
        if (isPlaying && isReady) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const timeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
        const currentTimeInSeconds = (event.target as HTMLAudioElement).currentTime;
        const formattedTime = formatTime(currentTimeInSeconds)
        setTimeDisplay(formattedTime);
        AudioStore.updateCurrentTime(formattedTime);
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
    }


    useEffect(() => {

    }, [])

    const onCanPlay = () => {
        setIsReady(true);
        if (audioRef.current) {
            setTimeDisplay(formatTime(audioRef.current.duration));
            // Затычка чтобы не оглохнуть от 100% громкости:
            audioRef.current.volume = 0.3;
        }
    };


    return (
        <Cell>
            <audio ref={audioRef} style={{display: `none`}}
                   src={audioSrc}
                   onCanPlay={() => onCanPlay()}
                   onTimeUpdate={(event) => timeUpdate(event)}
            />

            <Tappable onClick={() => handleClick()} className={styles.song_cell}>
                <Div className={styles.song_cell_left}>
                    <Div className={styles.image_container}>
                        <Image className={`${styles.cover_image} ${isPlaying ? styles.playing : ""}`} src={coverImage}
                               size={40} alt="cover"></Image>
                        <MusicGraph className={`${styles.extra_icon} ${isPlaying ? "" : styles.hidden}`}
                                    animated={true}/>
                    </Div>
                </Div>
                <Div className={styles['song_cell-middle']}>
                    <Headline weight="2" className={styles.song_cell_track_name}>{songData.title}</Headline>
                    <Subhead className={styles.song_cell_track_artist}>{songData.artist}</Subhead>
                </Div>
                <Div className={styles.song_cell_right}>
                    <Div className={styles.detail_container}>
                        {timeDisplay}
                    </Div>
                    <Div className={styles.more_container}>
                        <Div className={styles.more_button}>
                            <MorePopover/>
                        </Div>
                    </Div>
                </Div>
            </Tappable>
        </Cell>
    );
};