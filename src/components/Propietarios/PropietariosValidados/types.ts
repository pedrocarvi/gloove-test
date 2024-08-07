export interface PropertyData {
  name: string;
  location: string;
  description: string;
  textileInventory?: TextileInventory;
  contract?: Contract;
  inventory?: Inventory;
}

export interface TextileInventory {
  bedLinen: string;
  towels: string;
}

export interface Contract {
  startDate: string;
  endDate: string;
}

export interface InventoryItem {
  name: string;
  quantity: number;
}

export interface Inventory {
  items: InventoryItem[];
}
