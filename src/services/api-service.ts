import appApi from "@/api/axios-client";
import { ApiResponse } from "@/types/api";
import type { Store, UpdateStorePayload } from "@/types/store";
import type { CreateCustomerPayload } from "@/types/customer";
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

  updateStore: async (
    storeID: string,
    payload: UpdateStorePayload,
  ): Promise<boolean> => {
    try {
      await appApi.put(`stores/${storeID}`, payload);
      return true;
    } catch (error) {
      LoggerService.logError(error);
      return false;
    }
  },

  createCustomer: async (payload: CreateCustomerPayload): Promise<boolean> => {
    try {
      await appApi.post("customers", payload);
      return true;
    } catch (error) {
      LoggerService.logError(error);
      return false;
    }
  },
};

export default APIService;
