import {Cell, Div, Tappable, Image, Headline, Subhead} from "@vkontakte/vkui";
import styles from './AudioCell.module.css'
import coverImage from '../../assets/audiocell_cover.png';
import {Icon16MoreVertical} from "@vkontakte/icons";
import {useEffect, useRef, useState} from "react";
import MusicGraph from "../icons_animated/MusicGraph/MusicGraph.tsx";
import AudioStore from "../../stores/AudioStore/AudioStore.ts";
import audioTrack from '../../assets/mock_data/NEFFEX-Grateful.mp3'

interface AudioCellProps {
    audioID: number;
    id?: string;
    className?: string;
}

export const AudioCell = (AudioCellProps: AudioCellProps) => {

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const  [timeDisplay, setTimeDisplay] = useState('00:00')

    const [_, setAudioSrc] = useState("");

    const togglePlayPause = () => {
        if (isPlaying && isReady) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const timeUpdate = (event: React.SyntheticEvent) => {
        const currentTimeInSeconds = (event.target as HTMLAudioElement).currentTime;
        setTimeDisplay(
            formatTime(currentTimeInSeconds)
        );
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }


    useEffect(() => {
        AudioStore.loadSong(AudioCellProps.audioID)
            .then(module => {
                if (module) {
                    setAudioSrc(module.default)
                }

            })
            .catch(error => {
                console.log("Error during loading song:", error)
            });
    }, [])

    const onCanPlay = () => {
        setIsReady(true);
        if (audioRef.current) {
            setTimeDisplay(formatTime(audioRef.current.duration));
        }
    };


    return (
        <Cell>
            <audio ref={audioRef} style={{display: `none`}}
                   src={audioTrack}
                   onCanPlay={() => onCanPlay()}
                   onTimeUpdate={(event) => timeUpdate(event)}
            />

            <Tappable onClick={() => togglePlayPause()} className={styles.song_cell}>
                <Div className={styles.song_cell_left}>
                    <Div className={styles.image_container}>
                        <Image className={`${styles.cover_image} ${isPlaying ? styles.playing : ""}`} src={coverImage} size={40} alt="cover"></Image>
                        <MusicGraph className={`${styles.extra_icon} ${isPlaying ? "" : styles.hidden}`} animated={true}/>
                    </Div>
                </Div>
                <Div className={styles['song_cell-middle']}>
                    <Headline weight="2" className={styles.song_cell_track_name}>Трек</Headline>
                    <Subhead className={styles.song_cell_track_artist}>Исполнитель</Subhead>
                </Div>
                <Div className={styles.song_cell_right}>
                    <Div className={styles.detail_container}>
                        {timeDisplay}
                    </Div>
                    <Div className={styles.more_container}>
                        <Div className={styles.more_button}>
                            <Icon16MoreVertical color="var(--vkui--color_icon_accent)"/>
                        </Div>
                    </Div>
                </Div>
            </Tappable>
        </Cell>
    );
};