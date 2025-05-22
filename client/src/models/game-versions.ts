export interface IVersionsQueries {
  page: number;
  pageSize: number;
  versionType: 'release' | 'snapshot' | 'old_alpha' | 'old_beta';
};

interface IListResponse<T> {
  meta: {
    total: number;
  };
  data: T[];
};

export interface IGameVersion {
  id: string;
  versionId: string;
  packageUrl: string;
  releasedAt: Date;
  createdAt: Date;
  tags: {
    tag: {
      id: string;
      name: string;
    }
  }[];
};

export type TGameVersionResponse = IListResponse<IGameVersion>;
