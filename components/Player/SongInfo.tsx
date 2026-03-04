interface SongInfoProps {
  title: string | null;
  artist: string | null;
  size?: "sm" | "lg";
}

const SongInfo: React.FC<SongInfoProps> = ({ title, artist, size = "sm" }) => {
  if (size === "lg") {
    return (
      <div className="flex flex-col items-center text-center space-y-1 w-full">
        <p className="text-xl font-bold truncate w-full text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground truncate w-full">{artist}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <p className="text-sm font-semibold truncate text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{artist}</p>
    </div>
  );
};

export default SongInfo;
