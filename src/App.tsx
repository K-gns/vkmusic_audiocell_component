import {Provider} from 'mobx-react';
import AudioStore from "./stores/AudioStore/AudioStore.ts";
import '@vkontakte/vkui/dist/vkui.css';
import {AudioCell} from "./components/AudioCell/AudioCell.tsx";
import {Panel, View} from "@vkontakte/vkui";

interface MainProps {
    initialPanel: string;
}

export function App({}: MainProps) {

    return (
        <Provider audioStore={AudioStore}>
            <View activePanel="audioCell">
                <Panel id="audioCell">
                    <AudioCell id="AudioCell_1" audioID={1}/>
                </Panel>
            </View>
        </Provider>

    );
}
