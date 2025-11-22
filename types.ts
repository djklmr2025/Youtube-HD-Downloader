export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  resourceId?: {
    kind: string;
    videoId: string;
  };
}

export interface YouTubeContentDetails {
  itemCount: number;
}

export interface YouTubePlaylist {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
  contentDetails: YouTubeContentDetails;
}

export interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
