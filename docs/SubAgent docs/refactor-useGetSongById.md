# Refactor `useGetSongById.ts`

## Problem
The `useGetSongById.ts` hook has a dead ESLint suppression and `setIsLoading(true)` is called outside the async function in `useEffect`, which is less clean.

## Proposed Changes
1. Remove `// eslint-disable-next-line react-hooks/set-state-in-effect`.
2. Move `setIsLoading(true)` to be the first line inside the `fetchSong` async function.

## File to Edit
- `hooks/useGetSongById.ts`

## Implementation Details
### Target Code Block
```typescript
  useEffect(() => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
// ...
```

### New Code Block
```typescript
  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchSong = async () => {
      setIsLoading(true);

      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
// ...
```