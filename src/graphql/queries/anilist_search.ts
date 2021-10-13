import { gql } from 'urql';

export interface IAniListAnime {
  id: number;
  title: {
    romaji: string;
  };
  startDate: {
    year: number;
  };
  coverImage: {
    extraLarge: string;
  };
  description: string;
}

export interface IIAniListSearchResponse {
  anime: {
    pageInfo: {
      total: number;
    };
    results: IAniListAnime[];
  };
}

export interface IAniListSearchVariabled {
  id?: number;
  search?: string;
}

export const ANILIST_SEARCH = gql`
  query AniListSearch($id: Int, $search: String) {
    anime: Page(perPage: 3) {
      pageInfo {
        total
      }
      results: media(type: ANIME, id: $id, search: $search) {
        id
        title {
          romaji
        }
        startDate {
          year
        }
        coverImage {
          extraLarge
        }
        description
      }
    }
  }
`;