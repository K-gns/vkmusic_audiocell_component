import {Cell, Div, Tappable, Image, Headline, Subhead} from "@vkontakte/vkui";
import styles from './AudioCell.module.css'
import coverImage from '../../assets/audiocell_cover.png';
import {Icon16MoreVertical} from "@vkontakte/icons";
import {useEffect, useRef, useState} from "react";
import MusicGraph from "../icons_animated/MusicGraph/MusicGraph.tsx";
import AudioStore from "../../stores/AudioStore/AudioStore.ts";

interface AudioCellProps {
    audioID: number;
    id?: string;
    className?: string;
}

export const AudioCell = (AudioCellProps: AudioCellProps) => {

    const songId = AudioCellProps.audioID

    // const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const [audioSrc, setAudioSrc] = useState("");

    const togglePlayPause = () => {
        if (isPlaying && isReady) {
            audioRef.current?.pause();
            setIsPlaying(false);
            console.log(isPlaying)
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
            console.log(isPlaying)
        }
    };

    useEffect(() => {
        AudioStore.loadSong(songId)
            .then(module => {
                if (module) {
                    setAudioSrc(module.default)
                }
                console.log(typeof module.default)

            })
            .catch(error => {
                console.log("Error during loading song:", error)
            });
    }, [])


    return (
        <Cell>
            <audio ref={audioRef} style={{display: `none`}}
                   src={audioSrc}
                   onCanPlay={() => {
                       setIsReady(true);
                   }}
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
                        3:23
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