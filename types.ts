export enum DateCategory {
  FoodAndDrink = 'Food & Drink',
  OutdoorsAndAdventure = 'Outdoors & Adventure',
  ArtsAndCulture = 'Arts & Culture',
  Nightlife = 'Nightlife',
  RelaxingAndCasual = 'Relaxing & Casual',
  ActiveAndFitness = 'Active & Fitness',
  Adult = 'Adult (18+)',
  Uncategorized = 'Uncategorized',
}

export type BudgetOption = 'Not Set' | 'Free' | '$' | '$$' | '$$$';
// FIX: Added 'Activewear' to the DressCodeOption type to allow for fitness-related date ideas.
export type DressCodeOption = 'Not Set' | 'Casual' | 'Smart Casual' | 'Formal' | 'Activewear';


export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  phone?: string;
  password?: string; // In a real app, this would be a hash
  bio: string;
  images: string[];
  interests: string[];
  background?: string; // Can be a data URL for uploaded/generated images
  isPremium: boolean;
  location?: string;
  maxDistance?: number; // in miles/kilometers
  prompts?: string[]; // Icebreaker prompts
  isVerified?: boolean; // Profile verification status
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: DateCategory;
  authorId: string;
  authorName: string;
  authorImage: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  date?: string; // ISO string for the date
  isOutOfTown?: boolean;
  budget?: BudgetOption;
  dressCode?: DressCodeOption;
  distance?: number; // in miles/kilometers from user's location
  created_at?: string; // ISO string for creation time
}

export interface Message {
  id: string;
  senderId: string; // User ID of the sender
  text: string;
  timestamp: string;
}

export interface Match {
  id: string;
  user: User; // The other user in the match
  messages: Message[];
  interestType: 'swipe' | 'date';
  interestExpiresAt?: string | null; // ISO string for expiry, or null if permanent
  dateIdeaId?: string;
  dateAuthorId?: string;
}

// This is how a match would be represented in a database
export interface MatchData {
    id: string;
    participants: string[]; // Array of two user IDs
    messages: Message[];
    interestType: 'swipe' | 'date';
    interestExpiresAt?: string | null;
    dateIdeaId?: string;
    dateAuthorId?: string;
}


export type ActiveView = 'swipe' | 'dates' | 'matches' | 'profile' | 'stories';

export type NotificationType = 'match' | 'interest' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  read?: boolean;
}

export interface LocalIdea {
    name: string;
    idea: string;
}

export interface LocalEvent {
    eventName:string;
    description: string;
}

export interface DateSuggestion {
    title: string;
    description: string;
}