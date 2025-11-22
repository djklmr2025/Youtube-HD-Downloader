import { YouTubePlaylist, YouTubePlaylistItem, UserProfile } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

export const fetchPlaylists = async (accessToken: string): Promise<YouTubePlaylist[]> => {
  let playlists: YouTubePlaylist[] = [];
  let nextPageToken = '';

  // Fetch all pages
  do {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      mine: 'true',
      maxResults: '50',
      pageToken: nextPageToken,
    });

    const response = await fetch(`${BASE_URL}/playlists?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlists');

    const data = await response.json();
    playlists = [...playlists, ...data.items];
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  return playlists;
};

export const fetchPlaylistItems = async (accessToken: string, playlistId: string): Promise<YouTubePlaylistItem[]> => {
  let items: YouTubePlaylistItem[] = [];
  let nextPageToken = '';

  do {
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: '50',
      pageToken: nextPageToken,
    });

    const response = await fetch(`${BASE_URL}/playlistItems?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch playlist items');

    const data = await response.json();
    items = [...items, ...data.items];
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  return items;
};
