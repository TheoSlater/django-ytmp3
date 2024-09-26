import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=|^v=|\/v\/|\/embed\/|v%3D)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = async () => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setError(null);

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        if (response.link) {
          setDownloadLink(response.link);
        } else {
          setError("Failed to fetch download link.");
        }
        setLoading(false);
      }
    });

    xhr.open("GET", `https://yt-api.p.rapidapi.com/dl?id=${videoId}`);
    xhr.setRequestHeader(
      "x-rapidapi-key",
      "dbe6b9f760mshb3a415a3d1f3e1dp160e6cjsn444fbfc07187"
    );
    xhr.setRequestHeader("x-rapidapi-host", "yt-api.p.rapidapi.com");
    xhr.send(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube to MP4 Downloader</h1>

        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input-field"
        />

        <button
          onClick={handleDownload}
          className="download-button"
          disabled={loading}
        >
          {loading ? "Loading..." : "Download MP4"}
        </button>

        {error && <p className="error">{error}</p>}
        {downloadLink && (
          <a
            href={downloadLink}
            className="download-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to download your video
          </a>
        )}
      </header>
    </div>
  );
};

export default App;
