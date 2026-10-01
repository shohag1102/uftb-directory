export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsListResponse = {
  success: boolean;
  data: NewsItem[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
};

export type NewsDetailResponse = {
  success: boolean;
  data: NewsItem;
};
