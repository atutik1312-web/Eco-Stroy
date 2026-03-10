export interface ConfigRow {
  name: string;
  v1: boolean;
  v2: boolean;
}

export interface ConfigSection {
  title: string;
  rows: ConfigRow[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  images: string[];
}

export interface Project {
  id: string;
  title: string;
  price: number;
  priceWarm?: number;
  priceTurnkey?: number;
  area: string;
  floors: string;
  bedrooms: string;
  material: string;
  time: string;
  series: string;
  houseSize?: string;
  bathrooms?: string;
  image: string;
  badge: string | null;
  badgeColor: string;
  isPopular: boolean;
  description: string;
  features: string[];
  gallery?: string[];
  floorPlans?: string[];
  configurations?: ConfigSection[];
}
