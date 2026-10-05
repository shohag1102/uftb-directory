export type NoticeItem = {
  id: string;
  title: string;
  publishDate: string;
  pdf: string; // filename only, e.g. "17900720611859.pdf"
};

export type NoticeListResponse = {
  success: boolean;
  data: NoticeItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type NoticeDetailResponse = {
  success: boolean;
  data: NoticeItem;
};
