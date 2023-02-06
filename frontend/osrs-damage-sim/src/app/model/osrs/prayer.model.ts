export interface Prayer {
  name: string;
  isActive: boolean;
  replacesPrayer: Prayer[];
}
