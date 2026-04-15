import type { Product } from "../types";

export const DELIVERY_FEE = 40;

export const categories = [
  "All",
  "Grocery",
  "Dairy",
  "Snacks",
  "Beverages",
  "Household",
  "Electronics",
  "Male Fashion",
  "Female Fashion",
] as const;

export const fallbackProducts: Product[] = [
  { id: "p1", name: "Basmati Rice 5kg", price: 399, category: "Grocery", emoji: "🍚", description: "Premium long-grain basmati rice for daily meals." },
  { id: "p2", name: "Whole Wheat Flour 10kg", price: 499, category: "Grocery", emoji: "🌾", description: "Stone-ground atta for soft rotis and chapatis." },
  { id: "p3", name: "Toor Dal 1kg", price: 149, category: "Grocery", emoji: "🫘", description: "Fresh and protein-rich toor dal." },
  { id: "p4", name: "Fresh Milk 1L", price: 62, category: "Dairy", emoji: "🥛", description: "Farm fresh full cream milk." },
  { id: "p5", name: "Paneer 200g", price: 95, category: "Dairy", emoji: "🧀", description: "Soft and fresh cottage cheese for curries." },
  { id: "p6", name: "Greek Yogurt", price: 85, category: "Dairy", emoji: "🥣", description: "Creamy yogurt, rich in protein." },
  { id: "p7", name: "Potato Chips", price: 30, category: "Snacks", emoji: "🥔", description: "Crispy salted potato chips." },
  { id: "p8", name: "Nacho Chips", price: 55, category: "Snacks", emoji: "🫓", description: "Corn nachos with masala seasoning." },
  { id: "p9", name: "Trail Mix", price: 120, category: "Snacks", emoji: "🥜", description: "Healthy mix of nuts and dried fruits." },
  { id: "p10", name: "Orange Juice 1L", price: 110, category: "Beverages", emoji: "🍊", description: "Refreshing no-added-sugar orange juice." },
  { id: "p11", name: "Cold Coffee", price: 75, category: "Beverages", emoji: "☕", description: "Chilled creamy cold coffee bottle." },
  { id: "p12", name: "Green Tea Bags", price: 160, category: "Beverages", emoji: "🍵", description: "Antioxidant-rich green tea infusion." },
  { id: "p13", name: "Dishwash Liquid", price: 135, category: "Household", emoji: "🧴", description: "Powerful grease removal for utensils." },
  { id: "p14", name: "Floor Cleaner", price: 190, category: "Household", emoji: "🫧", description: "Floral fragrance floor disinfectant." },
  { id: "p15", name: "Toilet Cleaner", price: 99, category: "Household", emoji: "🚽", description: "Removes tough stains and germs." },
  { id: "p16", name: "Eggs (12 pcs)", price: 88, category: "Dairy", emoji: "🥚", description: "Farm eggs, rich in protein." },
  { id: "p17", name: "Instant Noodles Pack", price: 72, category: "Snacks", emoji: "🍜", description: "Quick snack noodles pack of 4." },
  { id: "p18", name: "Mineral Water 2L", price: 45, category: "Beverages", emoji: "💧", description: "Safe and pure drinking water." },
  { id: "p19", name: "Wireless Earbuds", price: 1299, category: "Electronics", emoji: "🎧", description: "Bluetooth earbuds with noise isolation." },
  { id: "p20", name: "Smart Watch", price: 2499, category: "Electronics", emoji: "⌚", description: "Fitness tracking smartwatch with AMOLED display." },
  { id: "p21", name: "Men's Casual Shirt", price: 899, category: "Male Fashion", emoji: "👔", description: "Comfort-fit cotton casual shirt for daily wear." },
  { id: "p22", name: "Men's Sneakers", price: 1699, category: "Male Fashion", emoji: "👟", description: "Lightweight sneakers for walking and travel." },
  { id: "p23", name: "Women's Kurti", price: 1099, category: "Female Fashion", emoji: "👗", description: "Printed rayon kurti for all-day comfort." },
  { id: "p24", name: "Women's Handbag", price: 1499, category: "Female Fashion", emoji: "👜", description: "Spacious and stylish handbag for everyday use." },
];
