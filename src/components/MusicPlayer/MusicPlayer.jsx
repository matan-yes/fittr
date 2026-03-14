import { useState } from "react";
import styled from "styled-components";
import SpotifyPlayer from "./SpotifyPlayer";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PlayerContainer = styled.div`
  background: ${(props) => props.theme.background};
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.text};
  margin: 0;
  font-size: 1.8rem;
`;

const CloseButton = styled.button`
  background: #d34444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #b33636;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.$active ? "#d34444" : props.theme.text + "22")};
  color: ${(props) => (props.$active ? "white" : props.theme.text)};
  font-size: 1.1rem;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#b33636" : props.theme.text + "33")};
  }
`;

const PlayerContent = styled.div`
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: ${(props) => props.theme.text};
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${(props) => props.theme.text}33;
  border-radius: 8px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #d34444;
  }

  &::placeholder {
    color: ${(props) => props.theme.text}66;
  }
`;

const Button = styled.button`
  background: #d34444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: #b33636;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const IframeContainer = styled.div`
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: ${(props) => props.$height || "400px"};
  border: none;
`;

const InfoText = styled.p`
  color: ${(props) => props.theme.text}99;
  font-size: 0.85rem;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const MusicPlayer = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("spotify");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEmbed, setYoutubeEmbed] = useState("");

  const handleYoutubeSubmit = () => {
    if (!youtubeUrl) return;

    let videoId = "";

    if (youtubeUrl.includes("youtube.com/watch?v=")) {
      videoId = youtubeUrl.split("v=")[1]?.split("&")[0];
    } else if (youtubeUrl.includes("youtu.be/")) {
      videoId = youtubeUrl.split("youtu.be/")[1]?.split("?")[0];
    } else if (youtubeUrl.includes("youtube.com/playlist?list=")) {
      const playlistId = youtubeUrl.split("list=")[1]?.split("&")[0];
      setYoutubeEmbed(`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0`);
      return;
    }

    if (videoId) {
      setYoutubeEmbed(`https://www.youtube.com/embed/${videoId}?autoplay=0`);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <PlayerContainer>
        <Header>
          <Title>Music Player</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <TabContainer>
          <Tab $active={activeTab === "spotify"} onClick={() => setActiveTab("spotify")}>
            🎵 Spotify
          </Tab>
          <Tab $active={activeTab === "youtube"} onClick={() => setActiveTab("youtube")}>
            ▶️ YouTube
          </Tab>
        </TabContainer>

        {/* Spotify Player - Always mounted, visibility controlled */}
        <PlayerContent $visible={activeTab === "spotify"}>
          <SpotifyPlayer />
        </PlayerContent>

        {/* YouTube Player - Always mounted, visibility controlled */}
        <PlayerContent $visible={activeTab === "youtube"}>
          <InputGroup>
            <Label>YouTube Video/Playlist</Label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleYoutubeSubmit()}
            />
            <InfoText>
              Paste a YouTube video or playlist URL to play your workout music
            </InfoText>
          </InputGroup>
          <Button onClick={handleYoutubeSubmit}>Load YouTube Player</Button>

          {youtubeEmbed && (
            <IframeContainer>
              <StyledIframe
                src={youtubeEmbed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                $height="380px"
              />
            </IframeContainer>
          )}
        </PlayerContent>
      </PlayerContainer>
    </Overlay>
  );
};

export default MusicPlayer;
