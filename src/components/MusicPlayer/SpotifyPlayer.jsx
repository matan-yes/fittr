import { useState, useEffect } from "react";
import styled from "styled-components";

const PlayerContainer = styled.div`
  width: 100%;
`;

const AuthButton = styled.button`
  background: #1db954;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #1ed760;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PlayerStatus = styled.div`
  color: ${(props) => props.theme.text};
  padding: 12px;
  background: ${(props) => props.theme.text}11;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 0.9rem;
`;

const TrackInfo = styled.div`
  padding: 16px;
  background: ${(props) => props.theme.text}11;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const TrackName = styled.div`
  color: ${(props) => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const TrackArtist = styled.div`
  color: ${(props) => props.theme.text}99;
  font-size: 0.9rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
`;

const ControlButton = styled.button`
  background: ${(props) => props.theme.text}22;
  color: ${(props) => props.theme.text};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.text}33;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PlayButton = styled(ControlButton)`
  background: #1db954;
  color: white;
  width: 56px;
  height: 56px;
  font-size: 1.5rem;

  &:hover {
    background: #1ed760;
  }
`;

const InputGroup = styled.div`
  margin-top: 16px;
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
    border-color: #1db954;
  }

  &::placeholder {
    color: ${(props) => props.theme.text}66;
  }
`;

const InfoText = styled.p`
  color: ${(props) => props.theme.text}99;
  font-size: 0.85rem;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const ErrorText = styled.div`
  color: #ff4444;
  padding: 12px;
  background: #ff444422;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 0.9rem;
`;

// Spotify configuration - user needs to provide their own client ID
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
const REDIRECT_URI = window.location.origin + "/fittr";
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state"
].join(" ");

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [token, setToken] = useState(null);
  const [spotifyUri, setSpotifyUri] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for token in URL hash (after OAuth redirect)
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        if (item) {
          const parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    if (hash.access_token) {
      setToken(hash.access_token);
      window.location.hash = ""; // Clean up URL
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // Load Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Fittr Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsActive(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsActive(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const handleLogin = () => {
    if (!SPOTIFY_CLIENT_ID) {
      setError("Spotify Client ID not configured. Please add VITE_SPOTIFY_CLIENT_ID to your .env file.");
      return;
    }

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES)}`;

    window.location.href = authUrl;
  };

  const handlePlayUri = async () => {
    if (!deviceId || !spotifyUri) return;

    try {
      setError("");
      // Extract URI from Spotify URL if needed
      let uri = spotifyUri;
      if (spotifyUri.includes("open.spotify.com")) {
        const parts = spotifyUri.split("/");
        const id = parts[parts.length - 1].split("?")[0];
        const type = parts[parts.length - 2];
        uri = `spotify:${type}:${id}`;
      }

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: uri.includes("track") ? undefined : uri,
          uris: uri.includes("track") ? [uri] : undefined
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      setError("Failed to play track. Make sure the URL is valid.");
      console.error(err);
    }
  };

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const skipNext = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const skipPrevious = () => {
    if (player) {
      player.previousTrack();
    }
  };

  if (!token) {
    return (
      <PlayerContainer>
        <PlayerStatus>
          Connect to Spotify to play your workout music
        </PlayerStatus>
        <AuthButton onClick={handleLogin}>
          <span>🎵</span>
          <span>Connect with Spotify</span>
        </AuthButton>
        {error && <ErrorText>{error}</ErrorText>}
        {!SPOTIFY_CLIENT_ID && (
          <InfoText style={{ marginTop: "12px" }}>
            <strong>Setup Required:</strong><br />
            1. Go to <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: "#1db954" }}>Spotify Developer Dashboard</a><br />
            2. Create an app and get your Client ID<br />
            3. Add <code>{REDIRECT_URI}</code> as a Redirect URI<br />
            4. Create a <code>.env</code> file with:<br />
            <code>VITE_SPOTIFY_CLIENT_ID=your_client_id</code>
          </InfoText>
        )}
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      {isActive ? (
        <PlayerStatus>✅ Spotify Player Connected</PlayerStatus>
      ) : (
        <PlayerStatus>⏳ Connecting to Spotify...</PlayerStatus>
      )}

      {currentTrack && (
        <TrackInfo>
          <TrackName>{currentTrack.name}</TrackName>
          <TrackArtist>
            {currentTrack.artists.map((artist) => artist.name).join(", ")}
          </TrackArtist>
        </TrackInfo>
      )}

      <Controls>
        <ControlButton onClick={skipPrevious} disabled={!isActive}>
          ⏮️
        </ControlButton>
        <PlayButton onClick={togglePlay} disabled={!isActive}>
          {isPaused ? "▶️" : "⏸️"}
        </PlayButton>
        <ControlButton onClick={skipNext} disabled={!isActive}>
          ⏭️
        </ControlButton>
      </Controls>

      <InputGroup>
        <Label>Spotify URI or URL</Label>
        <Input
          type="text"
          placeholder="spotify:playlist:... or https://open.spotify.com/..."
          value={spotifyUri}
          onChange={(e) => setSpotifyUri(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handlePlayUri()}
        />
        <InfoText>
          Paste a Spotify playlist, album, or track link and press Enter
        </InfoText>
      </InputGroup>

      {error && <ErrorText>{error}</ErrorText>}
    </PlayerContainer>
  );
};

export default SpotifyPlayer;
