export interface CreateCustomerPayload {
  storeID: string;
  customerName: string;
  invoice: string;
  phone: string;
  score?: number;
  result?: string;
  playDuration?: number;
}

export interface CustomerRecord {
  customerID: string;
  storeID: string;
  customerName: string;
  invoice: string;
  phone: string;
}

export interface UpdateCustomerResultPayload {
  result: string;
  score: number;
}
