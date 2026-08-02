import appApi from "@/api/axios-client";
import { ApiResponse } from "@/types/api";
import type { Store } from "@/types/store";
import { LoggerService } from "./log-service";

const APIService = {
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await appApi.get<ApiResponse<Store>>("stores");

      return response.data.data;
    } catch (error) {
      LoggerService.logError(error);
      return [];
    }
  },
};

export default APIService;
