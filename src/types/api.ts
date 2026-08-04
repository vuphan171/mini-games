interface ApiResponse<T> {
  success: boolean;
  total: number;
  data: T;
}

export type { ApiResponse };
