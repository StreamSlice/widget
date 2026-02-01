/**
 * StreamSlice API Client
 */

import type { PlaylistResponse } from '../types';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  /**
   * Get playlist URL for a page link
   */
  async getPlaylist(pageLink: string): Promise<PlaylistResponse> {
    const url = new URL(`${this.baseUrl}/api/event/getPlaylist`);
    url.searchParams.set('link', pageLink);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlaylistResponse = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        error: {
          code: 'FETCH_ERROR',
          error_message_message: errorMessage,
        },
      };
    }
  }
}
