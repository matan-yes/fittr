import styled, { useTheme as useStyledTheme } from "styled-components";
import React, { useState } from "react";
import { useTheme } from "../../theme/theme";
import darkIcon from "../../assets/dark_mode.svg"
import { useNavigate } from "react-router";
import MusicPlayer from "../MusicPlayer/MusicPlayer";

const logos = {
    spotify: { url: '../../assets/icons8-spotify.svg' },
    themeMode: { onClick: '' }
}

const Icon = styled.div((props) => ({
    backgroundImage: `url(${props.$url})`,
    minWidth: '100%',
    minHeight: '100%',
    zIndex: '1',
    cursor: 'pointer',
    pointerEvents: 'none'
}));

// SVG Icon Components
const SpotifyIcon = ({ color = "white", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M8 10C10 9 14 9 16 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.5 13C10 12 14 12 15.5 13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 16C10.5 15 13.5 15 15 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const YoutubeIcon = ({ color = "white", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M10 9L15 12L10 15V9Z" fill={color}/>
    </svg>
);

const TabataIcon = ({ color = "white", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M12 12 L12 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 12 L16 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1.5" fill={color}/>
    </svg>
);

const AmrapIcon = ({ color = "white", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 8C17 5.24 14.76 3 12 3C9.24 3 7 5.24 7 8C7 10.76 9.24 13 12 13C14.76 13 17 10.76 17 8Z" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M7 16C7 18.76 9.24 21 12 21C14.76 21 17 18.76 17 16C17 13.24 14.76 11 12 11C9.24 11 7 13.24 7 16Z" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M15 9L17 7M7 17L9 15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const ForTimeIcon = ({ color = "white", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" fill="none"/>
        <path d="M12 9 L12 13 L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="3" width="6" height="2" rx="1" fill={color}/>
    </svg>
);
const RoundMenuBtn = (props) => {
    const { toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);

    const navigateTo = (dest) => {
        navigate(dest);
    };

    const openMusicPlayer = () => {
        setShowMusicPlayer(true);
    };

    const { icon, tooltip } = { ...props };
    const buttons = [
        // TODO: Uncomment when ready to resume Spotify/YouTube integration
        // { iconType: 'spotify', tooltip: "Spotify", onClick: openMusicPlayer },
        // { iconType: 'youtube', tooltip: "Youtube", onClick: openMusicPlayer },
        { iconType: 'tabata', tooltip: "Tabata", onClick: () => navigateTo('/tabata') },
        { iconType: 'amrap', tooltip: "Amrap", onClick: () => navigateTo('/amrap') },
        { iconType: 'fortime', tooltip: "For-Time", onClick: () => navigateTo('/for-time') },
    ];

    return (
        <>
            <div
                style={{
                    top: "50%",
                    position: "fixed",
                    bottom: "40px",
                    left: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {buttons.map((btn, index) => (
                    <FloatingButton
                        key={index}
                        iconType={btn.iconType}
                        iconUrl={btn.iconUrl}
                        tooltip={btn.tooltip}
                        onClick={btn.onClick}
                    />
                ))}
            </div>

            {showMusicPlayer && <MusicPlayer onClose={() => setShowMusicPlayer(false)} />}
        </>
    );
};

const FloatingButton = ({ iconType, iconUrl, tooltip, onClick }) => {
    const [hover, setHover] = useState(false);
    const theme = useStyledTheme();
    const iconColor = theme.text;

    const renderIcon = () => {
        const iconSize = 50; // Much larger icon size
        switch(iconType) {
            case 'spotify':
                return <SpotifyIcon color={iconColor} size={iconSize} />;
            case 'youtube':
                return <YoutubeIcon color={iconColor} size={iconSize} />;
            case 'tabata':
                return <TabataIcon color={iconColor} size={iconSize} />;
            case 'amrap':
                return <AmrapIcon color={iconColor} size={iconSize} />;
            case 'fortime':
                return <ForTimeIcon color={iconColor} size={iconSize} />;
            case 'image':
                return <Icon $url={iconUrl} />;
            case 'none':
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
            }}
        >
            {/* Tooltip */}
            {hover && (
                <div
                    style={{
                        position: "absolute",
                        left: "70px",
                        background: "rgba(0, 0, 0, 0.75)",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        fontSize: "18px",
                        fontWeight: "500",
                        transition: "opacity 0.2s ease-in-out",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {tooltip}
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={onClick}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#d34444",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "rgba(0, 0, 0, 0.3) 4px -2px 6px 1px",
                    cursor: "pointer",
                    transition: "background 0.2s ease-in-out",
                }}
            >
                {renderIcon()}
            </button>
        </div>
    );
};

export default RoundMenuBtn;