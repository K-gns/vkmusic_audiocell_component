import {CellButton, Popover} from "@vkontakte/vkui";
import {Icon16MoreVertical} from "@vkontakte/icons";

export const MorePopover = () => {

    return (
        <Popover
            noStyling
            trigger="hover"
            id="morepopup"
            role="menu"
            aria-labelledby="menubutton"
            content={({ onClose }) => (
                <div
                    style={{
                        backgroundColor: 'var(--vkui--color_background_modal)',
                        borderRadius: 8,
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <CellButton role="menuitem"  onClick={onClose}>
                        Опция1
                    </CellButton>
                    <CellButton role="menuitem"  onClick={onClose}>
                        Опция2
                    </CellButton>
                </div>
            )}
        >
            <Icon16MoreVertical color="var(--vkui--color_icon_accent)"/>
        </Popover>
    );
};