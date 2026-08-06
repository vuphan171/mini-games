import appApi from "@/api/axios-client";
import { ApiResponse } from "@/types/api";
import type { Store, UpdateStorePayload } from "@/types/store";
import type {
  CreateCustomerPayload,
  UpdateCustomerResultPayload,
} from "@/types/customer";
import { LoggerService } from "./log-service";
import { Customer } from "@/features/game-plays/types";

const sortStoreOptions = (stores: Store[]): Store[] => {
  return [...stores].sort((a, b) => a.location.localeCompare(b.location));
};

const APIService = {
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await appApi.get<ApiResponse<Store[]>>("stores");

      return sortStoreOptions(response?.data?.data ?? []);
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

  createCustomer: async (
    payload: CreateCustomerPayload,
  ): Promise<Customer | null> => {
    try {
      const response = await appApi.post<ApiResponse<Customer>>(
        "customers",
        payload,
      );

      return response.data.data ?? null;
    } catch (error) {
      LoggerService.logError(error);
      return null;
    }
  },

  updateCustomerResult: async (
    customerID: number,
    payload: UpdateCustomerResultPayload,
  ): Promise<boolean> => {
    try {
      await appApi.patch(`customers/${customerID}/result`, payload);
      return true;
    } catch (error) {
      LoggerService.logError(error);
      return false;
    }
  },
};

export default APIService;
