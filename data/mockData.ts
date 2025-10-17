import { User, DateIdea, Match, DateCategory, Message } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Chloe',
    age: 28,
    email: 'chloe@email.com',
    password: 'password123',
    phone: '111-222-3333',
    bio: 'Lover of art, adventure, and artisanal coffee. Looking for someone to explore new galleries and hiking trails with. Bonus points if you can make me laugh.',
    images: [
        'https://picsum.photos/seed/user1a/800/1200', 
        'https://picsum.photos/seed/user1b/800/1200',
        'https://picsum.photos/seed/user1c/800/1200',
        'https://picsum.photos/seed/user1d/800/1200',
        'https://picsum.photos/seed/user1e/800/1200',
        'https://picsum.photos/seed/user1f/800/1200',
    ],
    interests: ['Hiking', 'Painting', 'Indie Music', 'Travel'],
    isPremium: true,
    prompts: ['What\'s your idea of a perfect weekend?', 'If you could have dinner with any historical figure, who would it be?'],
    isVerified: true,
  },
  {
    id: '2',
    name: 'Marcus',
    age: 31,
    email: 'marcus@email.com',
    password: 'password123',
    phone: '222-333-4444',
    bio: 'Software engineer by day, musician by night. I find joy in coding elegant solutions and composing heartfelt melodies. Searching for a partner in crime for spontaneous road trips and late-night jam sessions.',
    images: [
        'https://picsum.photos/seed/user2a/800/1200', 
        'https://picsum.photos/seed/user2b/800/1200'
    ],
    interests: ['Guitar', 'Cooking', 'Sci-Fi Movies', 'Craft Beer'],
    isPremium: false,
    prompts: ['What\'s the most spontaneous thing you\'ve ever done?', 'What\'s your favorite way to unwind after a long day?'],
    isVerified: false,
  },
  {
    id: '3',
    name: 'Sophia',
    age: 26,
    email: 'sophia@email.com',
    password: 'password123',
    bio: 'Fitness enthusiast and foodie. My perfect weekend involves a morning run followed by brunch. Let\'s challenge each other at the gym and then reward ourselves with tacos.',
    images: [
        'https://picsum.photos/seed/user3a/800/1200',
        'https://picsum.photos/seed/user3b/800/1200',
        'https://picsum.photos/seed/user3c/800/1200',
    ],
    interests: ['Yoga', 'Weightlifting', 'Brunch', 'Dogs'],
    isPremium: false,
    prompts: ['What\'s your go-to workout playlist?', 'If you could teleport anywhere right now, where would you go?'],
    isVerified: true,
  },
  {
    id: '4',
    name: 'Leo',
    age: 29,
    email: 'demo@user.com',
    password: 'password',
    phone: '555-555-5555',
    bio: 'Just a guy who loves dogs, dad jokes, and deep conversations. I can usually be found at a dog park or trying to learn a new recipe. Tell me your best worst joke.',
    images: [
        'https://picsum.photos/seed/user4a/800/1200',
        'https://picsum.photos/seed/user4b/800/1200',
    ],
    interests: ['Dogs', 'Comedy', 'Cooking', 'Podcasts'],
    isPremium: false,
    prompts: ['What\'s the best dad joke you know?', 'What\'s your favorite podcast and why?'],
    isVerified: false,
  }
];

export const MOCK_DATE_IDEAS: DateIdea[] = [
  {
    id: '1',
    title: 'Stargazing Picnic with Hot Cocoa',
    description: 'Let\'s escape the city lights for a night. We can pack a blanket, a thermos of delicious hot cocoa, and some snacks. We\'ll find a quiet spot, lay back, and watch the stars while sharing stories. It\'s simple, romantic, and a great way to connect.',
    category: DateCategory.OutdoorsAndAdventure,
    authorId: '2',
    authorName: 'Marcus',
    authorImage: 'https://picsum.photos/seed/user2/100/100',
    location: 'Griffith Observatory, Los Angeles',
    coordinates: { latitude: 34.1184, longitude: -118.3004 },
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    budget: '$',
    dressCode: 'Casual',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '2',
    title: 'Competitive Pottery Throwing Class',
    description: 'Ready to get our hands dirty? We\'ll take a beginner\'s pottery class and see who can make the least wobbly bowl. Loser buys the victory drinks afterward. A fun way to be creative and a little competitive.',
    category: DateCategory.ArtsAndCulture,
    authorId: '1',
    authorName: 'Chloe',
    authorImage: 'https://picsum.photos/seed/user1/100/100',
    location: 'Local Pottery Studio, San Francisco',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    budget: '$$',
    dressCode: 'Casual',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '3',
    title: 'Explore a Hidden Speakeasy in NYC',
    description: 'I\'ll be in New York for a weekend and have a password to a hidden jazz bar. Let\'s dress up, sip on some classic cocktails, and enjoy the live music. It feels like stepping back in time.',
    category: DateCategory.Nightlife,
    authorId: '4',
    authorName: 'Leo',
    authorImage: 'https://picsum.photos/seed/user4/100/100',
    location: 'The Back Room, New York, NY',
    isOutOfTown: true,
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    budget: '$$$',
    dressCode: 'Smart Casual',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '4',
    title: 'Sunrise Hike and Brewery Tour',
    description: 'An early start for a rewarding view. We\'ll hike up to a scenic overlook to watch the sunrise, then head back down and celebrate our accomplishment with a tour and tasting at a local craft brewery. The best of both worlds!',
    category: DateCategory.ActiveAndFitness,
    authorId: '3',
    authorName: 'Sophia',
    authorImage: 'https://picsum.photos/seed/user3/100/100',
    location: 'Runyon Canyon Park, Los Angeles',
    coordinates: { latitude: 34.1125, longitude: -118.3151 },
    budget: '$$',
    dressCode: 'Activewear',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: '5',
    title: 'Beach Volleyball and Sunset Picnic',
    description: 'Let\'s hit the beach for some friendly volleyball competition, then unwind with a picnic as the sun sets. Bring your A-game and your appetite for fun and relaxation.',
    category: DateCategory.OutdoorsAndAdventure,
    authorId: '1',
    authorName: 'Chloe',
    authorImage: 'https://picsum.photos/seed/user1/100/100',
    location: 'Santa Monica Beach, CA',
    coordinates: { latitude: 34.0194, longitude: -118.4912 },
    budget: '$',
    dressCode: 'Casual',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  }
];

const match1_messages: Message[] = [
  { id: '1', senderId: '1', text: "Hey! I loved your date idea about the pottery class, I'm terrible at art but it sounds fun!", timestamp: "10:30 AM" },
  { id: '2', senderId: '0', text: "Haha thanks! Being terrible is half the fun. You're a musician, right? You must have some creative bones.", timestamp: "10:32 AM" },
];

const match2_messages: Message[] = [
  { id: '1', senderId: '3', text: "A sunrise hike followed by a brewery sounds like my perfect day.", timestamp: "Yesterday" },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    user: MOCK_USERS[0],
    messages: match1_messages,
    // FIX: Added missing interestType property to conform to Match type.
    interestType: 'swipe',
  },
  {
    id: '2',
    user: MOCK_USERS[2],
    messages: match2_messages,
    // FIX: Added missing interestType property to conform to Match type.
    interestType: 'swipe',
  }
];