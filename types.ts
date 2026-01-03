
export interface FoodItem {
  dishName: string;
  description: string;
}

export interface ReligiousPlace {
  name: string;
  significance: string;
}

export interface TouristAttraction {
  name: string;
  type: string;
  description: string;
}

export interface Market {
  name: string;
  description: string;
}

export interface Greeting {
  phrase: string;
  meaning: string;
  usage: string;
}

export interface TravelTips {
  bestTime: string;
  transport: string;
  etiquette: string[];
}

export interface PlaceIntelligence {
  placeName: string;
  district?: string;
  state?: string;
  alternateNames: string[];
  tagline: string;
  overview: string;
  localFood: FoodItem[];
  cultureAndLifestyle: {
    traditions: string;
    festivals: string;
    clothing: string;
    lifestyle: string;
  };
  religiousAndSpiritual: ReligiousPlace[];
  placesToVisit: TouristAttraction[];
  famousMarkets: Market[];
  greetingsAndEtiquette: Greeting[];
  travelTips: TravelTips;
  regionalContext?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
