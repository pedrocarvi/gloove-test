export interface PropertyData {
  name: string;
  location: string;
  description: string;
  textileInventory?: {
    bedLinen: string;
    towels: string;
  };
  contract?: {
    startDate: string;
    endDate: string;
  };
  inventory?: {
    items: { name: string; quantity: number }[];
  };
  budget?: {
    amount: number;
  };
  documents?: { name: string; url: string }[];
}
