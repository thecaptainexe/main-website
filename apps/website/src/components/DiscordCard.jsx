import { useEffect, useState } from "react";

const DISCORD_USER_ID = import.meta.env.VITE_DISCORD_USER_ID || "";
const DEFAULT_AVATAR_URL = "/assets/logo.svg";
const DEFAULT_BANNER_URL = "/assets/banner.gif";
const fallbackProfile = { id: "captain", username: "thecaptainexe", global_name: "Captain", avatar: null };
const badges = [
  { src: "/assets/developer-badge.gif", label: "Active Developer" },
  { src: "/assets/moderator-badge.gif", label: "Moderator" },
];

export default function DiscordCard() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [presence, setPresence] = useState(null);
  const [avatarFallback, setAvatarFallback] = useState("");
  const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER_URL);

  useEffect(() => {
    if (!DISCORD_USER_ID) return undefined;
    const controller = new AbortController();
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Lanyard unavailable");
        return response.json();
      })
      .then((result) => {
        if (result?.data?.discord_user) setProfile(result.data.discord_user);
        if (result?.data?.discord_status) setPresence(result.data.discord_status);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const banner = new Image();
    banner.onerror = () => setBannerUrl("/default-banner.svg");
    banner.src = DEFAULT_BANNER_URL;
  }, []);

  const avatarUrl = avatarFallback || (profile.avatar && profile.id !== "captain"
    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
    : DEFAULT_AVATAR_URL);
  const statusLabel = presence === "dnd" ? "Do not disturb" : presence;

  return (
    <article className="discord-card">
      <div className="discord-banner" role="img" aria-label="Captain Discord profile banner" style={{ backgroundImage: `url("${bannerUrl}")` }} />
      <div className="discord-card-body">
        <div className="discord-header">
          <div className="avatar-wrapper">
            <img className="discord-avatar" src={avatarUrl} onError={() => setAvatarFallback(DEFAULT_AVATAR_URL)} alt="Captain avatar" width="92" height="92" />
            {presence && <span className={`status-dot status-${presence}`} aria-label={`Discord status: ${statusLabel}`} />}
          </div>
        </div>
        <div className="profile-details">
          <h3>
            Captain
            <img className="verified-badge" src="/assets/verified.gif" alt="Verified" width="18" height="18" />
          </h3>
          <p className="discord-username">@{profile.username || "thecaptainexe"}</p>
          <div className="discord-badges" aria-label="Discord profile badges">
            {badges.map((badge) => (
              <span className="discord-badge" title={badge.label} key={badge.src}>
                <img src={badge.src} alt="" width="22" height="22" />
                <span className="sr-only">{badge.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
