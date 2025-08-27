// src/app/about/page.tsx

export const metadata = {
  title: "About",
  description: "Assignment details and demo video",
};

// >>> Edit these as needed
const STUDENT_NAME = "Vayun";
const STUDENT_NUMBER = "92444685";

// If you upload your demo to YouTube, paste the *embed* URL below
// e.g. "https://www.youtube.com/embed/VIDEO_ID"
const YOUTUBE_EMBED = ""; // leave empty to use the local MP4 instead

// Put your MP4 at /public/assignment-demo.mp4 if not using YouTube
const LOCAL_MP4_PATH = "/assignment-demo.mp4";

export default function AboutPage() {
  const useYouTube = YOUTUBE_EMBED.trim().length > 0;

  return (
    <div>
      {/* Identity */}
      <section
        style={{
          marginBottom: 16,
          padding: "8px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Name: {STUDENT_NAME}
        </h1>

        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginTop: 4,
            // Use theme foreground color so it's white in Dark/Sepia, dark in Light
            color: "var(--fg, #111827)",
          }}
        >
          Student ID: {STUDENT_NUMBER}
        </div>
      </section>

      {/* Blurb */}
      <p style={{ marginTop: 0, marginBottom: 12 }}>
        This project implements the required UI (header, navigation bar, footer), Light/Dark/Sepia
        themes, a hamburger menu with CSS transform, a Tabs builder that saves to localStorage,
        and an Output button that generates inline-CSS HTML.
      </p>

      {/* Video */}
      <h2 style={{ marginTop: 20, marginBottom: 10, fontSize: 22 }}>Assignment Demo Video</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 720, // smaller frame
          aspectRatio: "16 / 9",
          background: "#000",
          border: "1px solid #d1d5db",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {useYouTube ? (
          <iframe
            title="Assignment demo"
            src={YOUTUBE_EMBED}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <video
            controls
            preload="metadata"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <source src={LOCAL_MP4_PATH} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
