"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import uniqid from "uniqid";
import { ChevronLeft, Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@/providers/SupabaseProvider";
import type { AlbumWithArtists } from "../../types/album-with-artists";
import type { Artist } from "../../types/artist";
import { mapAlbumWithArtistsRow } from "@/lib/mappers";
import { ALBUM_WITH_ARTISTS_SELECT } from "@/actions/_selects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ─── Types ───────────────────────────────────────────────────────────

type ArtistChoice =
  | { kind: "existing"; artist: Artist }
  | { kind: "new"; name: string, image?: File };

type AlbumChoice =
  | { kind: "existing"; album: AlbumWithArtists }
  | { kind: "new"; title: string };

// ─── Combobox helper ─────────────────────────────────────────────────

interface ComboboxProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  onSelect: (item: T) => void;
  onCreate: (query: string) => void;
  createLabel: string;
  placeholder: string;
  disabled?: boolean;
}

/**
 * A searchable dropdown component for selecting or creating items.
 * 
 * @param props - Component properties.
 * @param props.items - List of available items.
 * @param props.getLabel - Function to get the display label for an item.
 * @param props.getId - Function to get the unique identifier for an item.
 * @param props.onSelect - Callback when an item is selected.
 * @param props.onCreate - Callback when a new item is created from the search query.
 * @param props.createLabel - Label for the creation button.
 * @param props.placeholder - Input placeholder text.
 * @param props.disabled - Whether the combobox is interaction-disabled.
 */
function Combobox<T>({
  items,
  getLabel,
  getId,
  onSelect,
  onCreate,
  createLabel,
  placeholder,
  disabled,
}: ComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    getLabel(item).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
      />
      <div className="border rounded-md max-h-52 overflow-y-auto">
        {filtered.map((item) => (
          <button
            key={getId(item)}
            type="button"
            className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => onSelect(item)}
            disabled={disabled}
          >
            {getLabel(item)}
          </button>
        ))}
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-accent transition-colors flex items-center gap-x-1"
          onClick={() => onCreate(query)}
          disabled={disabled}
        >
          <Plus className="h-3 w-3" />
          {createLabel}
          {query && ` "${query}"`}
        </button>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────

const STEPS = ["Artist", "Album", "Song"] as const;

/**
 * Component that renders a step-by-step indicator for the upload process.
 * 
 * @param props - Component properties.
 * @param props.current - The current step index.
 */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-x-2 mb-6">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <div key={label} className="flex items-center gap-x-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stepNum}
            </div>
            <span
              className={`text-sm font-medium ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 ${done ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────

/**
 * Multi-step song upload page.
 * Guides the user through selecting or creating an artist, an album, and finally uploading the song track and metadata.
 */
const UploadPage = () => {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useUser();
  const { supabaseClient } = useSessionContext();

  // Auth guard
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.replace("/");
    }
  }, [isLoadingUser, user, router]);

  // Step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Artists
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistChoice, setArtistChoice] = useState<ArtistChoice | null>(null);

  // Albums
  const [albums, setAlbums] = useState<AlbumWithArtists[]>([]);
  const [albumChoice, setAlbumChoice] = useState<AlbumChoice | null>(null);

  // Song details
  const [songTitle, setSongTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState(1);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load all artists on mount
  useEffect(() => {
    supabaseClient
      .from("artists")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setArtists(
            data.map((a) => ({ id: a.id, name: a.name, imageUrl: a.image_url, uploaderId: a.uploader_id }))
          );
        }
      });
  }, [supabaseClient]);

  // Load albums when artist is chosen (existing artist only)
  const loadAlbumsForArtist = useCallback(
    async (artistId: string) => {
      const { data } = await supabaseClient
        .from("album_artists")
        .select(`albums(${ALBUM_WITH_ARTISTS_SELECT})`)
        .eq("artist_id", artistId);

      if (data) {
        const mapped = data
          .map((row) => row.albums)
          .filter(Boolean)
          .map((album) =>
            mapAlbumWithArtistsRow(
              album as Parameters<typeof mapAlbumWithArtistsRow>[0]
            )
          );
        setAlbums(mapped);
      }
    },
    [supabaseClient]
  );

  const handleArtistSelect = (artist: Artist) => {
    setArtistChoice({ kind: "existing", artist });
    loadAlbumsForArtist(artist.id);
  };

  const handleArtistCreate = (name: string) => {
    const trimmed = name.trim() || "New Artist";
    setArtistChoice({ kind: "new", name: trimmed });
    setAlbums([]);
  };

  const handleAlbumSelect = (album: AlbumWithArtists) => {
    setAlbumChoice({ kind: "existing", album });
  };

  const handleAlbumCreate = (title: string) => {
    const trimmed = title.trim() || "New Album";
    setAlbumChoice({ kind: "new", title: trimmed });
  };

  const goNext = () => {
    if (step === 1 && artistChoice) setStep(2);
    if (step === 2 && albumChoice) setStep(3);
  };

  const goBack = () => {
    if (step === 2) { setStep(1); setAlbumChoice(null); }
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !artistChoice || !albumChoice || !songFile) return;

    try {
      setIsSubmitting(true);
      const uniqueId = uniqid();

      // 1. Upload audio
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${songTitle.trim()}-${uniqueId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        toast.error("Failed to upload audio file");
        return;
      }

      // 2. Upload cover image if creating new album and image provided
      let coverImagePath: string | null = null;
      if (albumChoice.kind === "new" && imageFile) {
        const albumTitle =
          albumChoice.kind === "new" ? albumChoice.title : "";
        const { data: imgData, error: imgError } = await supabaseClient.storage
          .from("images")
          .upload(`image-${albumTitle}-${uniqueId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imgError) {
          toast.error("Failed to upload cover image");
          return;
        }
        coverImagePath = imgData.path;
      }

      // 3. Resolve or create artist
      let artistId: string;

      if (artistChoice.kind === "existing") {
        artistId = artistChoice.artist.id;
      } else {
        let artistImagePath: string | null = null;
        if (artistChoice.image) {
          // Validation
          if (artistChoice.image.size > 2 * 1024 * 1024) {
            toast.error("Artist image must be less than 2MB");
            return;
          }
          if (!artistChoice.image.type.startsWith("image/")) {
            toast.error("Only image files are allowed for artist profile");
            return;
          }

          const { data: artistImgData, error: artistImgError } = await supabaseClient.storage
            .from("images")
            .upload(`artist-${artistChoice.name}-${uniqueId}`, artistChoice.image, {
              cacheControl: "3600",
              upsert: false,
            });

          if (artistImgError) {
            toast.error("Failed to upload artist image");
            return;
          }
          artistImagePath = artistImgData.path;
        }

        const { data: newArtist, error: artistError } = await supabaseClient
          .from("artists")
          .insert({
            name: artistChoice.name,
            image_url: artistImagePath,
            uploader_id: user?.id ?? null
          })
          .select("id")
          .single();

        if (artistError || !newArtist) {
          toast.error("Failed to create artist");
          return;
        }
        artistId = newArtist.id;
      }

      // 4. Resolve or create album
      let albumId: string;

      if (albumChoice.kind === "existing") {
        albumId = albumChoice.album.id;
      } else {
        const { data: newAlbum, error: albumError } = await supabaseClient
          .from("albums")
          .insert({
            title: albumChoice.title,
            uploader_id: user.id,
            cover_image_path: coverImagePath,
          })
          .select("id")
          .single();

        if (albumError || !newAlbum) {
          toast.error("Failed to create album");
          return;
        }

        const { error: linkError } = await supabaseClient
          .from("album_artists")
          .insert({ album_id: newAlbum.id, artist_id: artistId });

        if (linkError) {
          toast.error("Failed to link artist to album");
          return;
        }

        albumId = newAlbum.id;
      }

      // 5. Insert song record
      const { error: insertError } = await supabaseClient.from("songs").insert({
        title: songTitle.trim(),
        album_id: albumId,
        track_number: trackNumber,
        song_path: songData.path,
        uploader_id: user.id,
      });

      if (insertError) {
        toast.error(insertError.message);
        return;
      }

      toast.success("Song uploaded successfully!");
      router.refresh();
      router.push("/songs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) return null;
  if (!user) return null;

  return (
    <div className="bg-background rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-x-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Upload Song</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Add a song to the Drumroll Music library.
        </p>

        <StepIndicator current={step} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          {/* ── Step 1: Artist ── */}
          {step === 1 && (
            <div className="flex flex-col gap-y-3">
              <h2 className="text-base font-semibold">Select an Artist</h2>
              {artistChoice ? (
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-sm font-medium">
                    {artistChoice.kind === "existing"
                      ? artistChoice.artist.name
                      : `Create new: "${artistChoice.name}"`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setArtistChoice(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Combobox<Artist>
                  items={artists}
                  getLabel={(a) => a.name}
                  getId={(a) => a.id}
                  onSelect={handleArtistSelect}
                  onCreate={handleArtistCreate}
                  createLabel="Create new artist"
                  placeholder="Search artists…"
                />
              )}
              {artistChoice?.kind === "new" && (
                <div className="flex flex-col gap-y-1 mt-2">
                  <Label htmlFor="artist-image">Artist Image (Optional)</Label>
                  <Input
                    id="artist-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setArtistChoice({ ...artistChoice, image: file });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a profile picture for the new artist.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Album ── */}
          {step === 2 && (
            <div className="flex flex-col gap-y-3">
              <h2 className="text-base font-semibold">Select an Album</h2>
              <p className="text-xs text-muted-foreground">
                Artist:{" "}
                <span className="font-medium">
                  {artistChoice?.kind === "existing"
                    ? artistChoice.artist.name
                    : artistChoice?.name}
                </span>
              </p>
              {albumChoice ? (
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <span className="text-sm font-medium">
                    {albumChoice.kind === "existing"
                      ? albumChoice.album.title
                      : `Create new: "${albumChoice.title}"`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAlbumChoice(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Combobox<AlbumWithArtists>
                  items={albums}
                  getLabel={(a) => a.title}
                  getId={(a) => a.id}
                  onSelect={handleAlbumSelect}
                  onCreate={handleAlbumCreate}
                  createLabel="Create new album"
                  placeholder="Search albums…"
                />
              )}
            </div>
          )}

          {/* ── Step 3: Song ── */}
          {step === 3 && (
            <div className="flex flex-col gap-y-4">
              <h2 className="text-base font-semibold">Song Details</h2>
              <p className="text-xs text-muted-foreground">
                Artist:{" "}
                <span className="font-medium">
                  {artistChoice?.kind === "existing"
                    ? artistChoice.artist.name
                    : artistChoice?.name}
                </span>
                {" · "}
                Album:{" "}
                <span className="font-medium">
                  {albumChoice?.kind === "existing"
                    ? albumChoice.album.title
                    : albumChoice?.title}
                </span>
              </p>

              <div className="flex flex-col gap-y-1">
                <Label htmlFor="song-title">Song Title</Label>
                <Input
                  id="song-title"
                  placeholder="Enter song title"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label htmlFor="track-number">Track Number</Label>
                <Input
                  id="track-number"
                  type="number"
                  min={1}
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(Number(e.target.value))}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label htmlFor="song-file">Audio File (.mp3)</Label>
                <Input
                  id="song-file"
                  type="file"
                  accept=".mp3,audio/*"
                  disabled={isSubmitting}
                  onChange={(e) => setSongFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>

              {albumChoice?.kind === "new" && (
                <div className="flex flex-col gap-y-1">
                  <Label htmlFor="cover-image">
                    Cover Image{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting}
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex justify-between pt-2">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={
                  (step === 1 && !artistChoice) ||
                  (step === 2 && !albumChoice)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !songTitle.trim() || !songFile}
              >
                {isSubmitting ? "Uploading…" : "Upload Song"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
