
export const THEMES = [
  { id: 'theme-default', name: 'Standard', color: 'hsl(25, 82%, 50%)', bg: 'hsl(30 65% 94%)' },
  { id: 'theme-birthday', name: 'Happy Birthday', color: 'hsl(330, 80%, 50%)', bg: 'hsl(330 60% 95%)' },
  { id: 'theme-thankyou', name: 'Thank You', color: 'hsl(210, 80%, 50%)', bg: 'hsl(210 60% 95%)' },
  { id: 'theme-holiday', name: 'Happy Holidays', color: 'hsl(160, 80%, 40%)', bg: 'hsl(160 60% 95%)' },
];

export const DELIVERY_OPTIONS = [
  { id: 'email', label: 'Email', fields: ['firstName', 'lastName', 'email'] },
  { id: 'sms', label: 'SMS', fields: ['firstName', 'lastName', 'phone'] },
  { id: 'email-sms', label: 'Email & SMS', fields: ['firstName', 'lastName', 'email', 'phone'] },
  { id: 'card-on-file', label: 'Card(s) on File', fields: ['firstName', 'lastName', 'email'] },
];

export const DEFAULT_TERMS = [
  "This eGift card is valid for 12 months from the date of issue.",
  "It cannot be exchanged for cash or credit.",
  "Lost or stolen cards will not be replaced or refunded.",
  "Subject to standard terms and conditions of the issuer."
];

export const DEFAULT_RECIPIENT = {
  firstName: 'Maya',
  lastName: 'Chen',
  email: 'maya.chen@northstarlabs.com',
  phone: '+1 555 019 2834'
};

export const CATEGORIES = ['All vouchers', 'Food & drink', 'Retail', 'Travel', 'Wellbeing'];

export const USER = {
  name: 'Maya Chen',
  company: 'Northstar Labs',
  userId: 'maya.chen',
  email: 'maya.chen@northstarlabs.com',
  mobile: '+1 (555) 019-2834',
  accountNumber: 'XXXX-XXXX-XXXX-4921',
  cardDetails: 'XXXX-XXXX-XXXX-4242',
  balance: 1840.5,
  currency: 'USD',
  corporate: {
    legalName: 'Northstar Labs LLC',
    address: '100 Northstar Way, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    contactName: 'Finance Department',
    contactEmail: 'billing@northstarlabs.com',
    contactPhone: '+1 (555) 019-2000'
  }
};

export const PRODUCTS = [
  {
    id: 'target-50',
    brand: 'Target',
    name: 'Target eGift Card',
    category: 'Retail',
    denomination: 50,
    price: 50,
    originalValue: 50,
    logoText: 'T',
    logoTone: 'coral',
    imageUrl: '/images/target.jpg',
    offerText: 'A flexible retail reward for every occasion',
    description: 'A flexible thank-you for the things they actually want. Redeem online or at any Target location.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: true,
  },
  {
    id: 'whole-foods-75',
    brand: 'Whole Foods Market',
    name: 'Whole Foods Market eGift Card',
    category: 'Food & drink',
    denomination: 75,
    price: 75,
    originalValue: 75,
    logoText: 'W',
    logoTone: 'sage',
    imageUrl: '/images/whole-foods.jpg',
    offerText: 'Fresh choices for everyday essentials',
    description: 'Give a little more good. Redeem for groceries, prepared meals, and everyday essentials.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: true,
  },
  {
    id: 'airbnb-250',
    brand: 'Airbnb',
    name: 'Airbnb Gift Card',
    category: 'Travel',
    denomination: 250,
    price: 250,
    originalValue: 250,
    logoText: 'A',
    logoTone: 'peach',
    imageUrl: '/images/airbnb.jpg',
    offerText: 'Give memorable stays and experiences',
    description: 'A change of scenery, whenever they need it. Good for stays and experiences around the world.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: true,
  },
  {
    id: 'doordash-100',
    brand: 'DoorDash',
    name: 'DoorDash eGift Card',
    category: 'Food & drink',
    denomination: 100,
    price: 100,
    originalValue: 100,
    logoText: 'D',
    logoTone: 'sky',
    imageUrl: '/images/doordash.jpg',
    offerText: 'Meals and essentials delivered on demand',
    description: 'Dinner, sorted. Let recipients choose from the restaurants and stores they already love.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: false,
  },
  {
    id: 'amazon-500',
    brand: 'Amazon',
    name: 'Amazon Business Gift Card',
    category: 'Retail',
    denomination: 500,
    price: 500,
    originalValue: 500,
    logoText: 'a',
    logoTone: 'amber',
    imageUrl: '/images/amazon.jpg',
    offerText: 'Millions of useful ways to say thank you',
    description: 'One gift, millions of useful directions. A reliable choice for teams and customer moments.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: true,
  },
  {
    id: 'delta-300',
    brand: 'Delta Air Lines',
    name: 'Delta Gift Card',
    category: 'Travel',
    denomination: 300,
    price: 300,
    originalValue: 300,
    logoText: 'Δ',
    logoTone: 'navy',
    imageUrl: '/images/delta.jpg',
    offerText: 'Put their next destination within reach',
    description: 'Put the next destination within reach with a gift card for flights across the globe.',
    delivery: 'Delivered by email within 24 hours',
    featured: false,
  },
  {
    id: 'reIax-150',
    brand: 'Calm',
    name: 'Calm Annual Membership',
    category: 'Wellbeing',
    denomination: 150,
    price: 150,
    originalValue: 180,
    logoText: 'c',
    logoTone: 'lavender',
    imageUrl: '/images/calm.jpg',
    offerText: 'A full year of calm and better sleep',
    description: 'A full year of guided meditations, sleep stories, and space to reset.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: true,
  },
  {
    id: 'nike-125',
    brand: 'Nike',
    name: 'Nike Digital Gift Card',
    category: 'Retail',
    denomination: 125,
    price: 125,
    originalValue: 125,
    logoText: '✓',
    logoTone: 'ink',
    imageUrl: '/images/nike.jpg',
    offerText: 'Inspire their next move',
    description: 'For the next run, the new kit, or whatever moves them forward.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: false,
  },
  {
    id: 'starbucks-25',
    brand: 'Starbucks',
    name: 'Starbucks eGift Card',
    category: 'Food & drink',
    denomination: 25,
    price: 25,
    originalValue: 25,
    logoText: 'S',
    logoTone: 'mint',
    imageUrl: '/images/starbucks.jpg',
    offerText: 'Send a coffee break in minutes',
    description: 'A small ritual with a big return. Send a coffee break to someone who earned it.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: false,
  },
  {
    id: 'marriott-400',
    brand: 'Marriott Bonvoy',
    name: 'Marriott Gift Card',
    category: 'Travel',
    denomination: 400,
    price: 400,
    originalValue: 400,
    logoText: 'M',
    logoTone: 'burgundy',
    imageUrl: '/images/marriott.jpg',
    offerText: 'Premium stays, dining, and more',
    description: 'A polished stay, a memorable meal, or a little more time away.',
    delivery: 'Delivered by email within 24 hours',
    featured: false,
  },
  {
    id: 'headspace-80',
    brand: 'Headspace',
    name: 'Headspace One-Year Gift',
    category: 'Wellbeing',
    denomination: 80,
    price: 80,
    originalValue: 96,
    logoText: 'H',
    logoTone: 'blue',
    imageUrl: '/images/headspace.jpg',
    offerText: 'Support better focus, sleep, and wellbeing',
    description: 'A year of guided support for better sleep, focus, and everyday calm.',
    delivery: 'Delivered by email in under 5 minutes',
    featured: false,
  },
];


PRODUCTS.forEach(p => {
  p.minAmount = p.price > 50 ? 50 : p.price;
  p.maxAmount = p.price < 500 ? 500 : p.price * 2;
  p.termsAndConditions = DEFAULT_TERMS;
});

export const INITIAL_ORDERS = [
  { id: 'VLY-10482', createdAt: '2024-10-18T14:32:00Z', itemCount: 12, total: 780, status: 'Delivered' },
  { id: 'VLY-10397', createdAt: '2024-09-05T09:18:00Z', itemCount: 8, total: 450, status: 'Delivered' },
  { id: 'VLY-10221', createdAt: '2024-07-22T16:44:00Z', itemCount: 20, total: 1290, status: 'Delivered' },
];

export function money(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
}

export function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

export function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}