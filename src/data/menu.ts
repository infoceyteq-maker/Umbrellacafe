import { Category, MenuItem } from "./types";

export const categories: Category[] = [
  "Soup",
  "Stews",
  "Omelette",
  "Main Dish",
  "Chopsey",
  "Boiled Vegetables",
  "Signature Roti",
  "Kottu Junction",
];

export const categoryIcons: Record<Category, string> = {
  Soup: "🍲",
  Stews: "🍛",
  Omelette: "🍳",
  "Main Dish": "🍽️",
  Chopsey: "🥡",
  "Boiled Vegetables": "🥦",
  "Signature Roti": "🌯",
  "Kottu Junction": "🔪",
};

export const menuItems: MenuItem[] = [
  {
    id: "chicken-corn-soup",
    name: "Umbrella Chicken Corn Soup",
    category: "Soup",
    price: 650,
    image: "/dishes/chicken-corn-soup.jpg",
    ingredients: ["Chicken", "Sweet corn", "Egg ribbons", "Spring onion", "Cracked pepper"],
    prepTime: "12 Mins",
    description:
      "A silky, slow-simmered chicken and sweet corn broth finished with delicate egg ribbons and fresh spring onion — the perfect warm start to your Ella evening.",
    spiceLevel: 1,
  },
  {
    id: "mushroom-cream-soup",
    name: "Wild Mushroom Cream Soup",
    category: "Soup",
    price: 700,
    image: "/dishes/mushroom-cream-soup.jpg",
    ingredients: ["Wild mushroom", "Fresh cream", "Garlic", "Thyme", "Butter"],
    prepTime: "15 Mins",
    description:
      "Velvety wild mushroom soup slow-cooked with garlic and cream, topped with crisp mushroom shavings and a whisper of thyme.",
    special: true,
    spiceLevel: 1,
  },
  {
    id: "beef-stew",
    name: "Ella Valley Beef Stew",
    category: "Stews",
    price: 1450,
    image: "/dishes/beef-stew.jpg",
    ingredients: ["Beef", "Carrot", "Potato", "Green chili", "Curry leaves", "House spice blend"],
    prepTime: "35 Mins",
    description:
      "Tender beef simmered for hours in a rich, aromatic gravy with garden vegetables and curry leaves — a hearty highland classic.",
    spiceLevel: 2,
  },
  {
    id: "spanish-omelette",
    name: "Umbrella Spanish Omelette",
    category: "Omelette",
    price: 850,
    image: "/dishes/spanish-omelette.jpg",
    ingredients: ["Farm eggs", "Bell pepper", "Onion", "Cheese", "Parsley", "Cherry tomato"],
    prepTime: "10 Mins",
    description:
      "Fluffy farm-egg omelette folded with sweet peppers, onion and melted cheese, finished with fresh parsley and cherry tomato.",
    spiceLevel: 1,
  },
  {
    id: "pepper-chicken-mash",
    name: "Ella Valley Pepper Chicken & Mash",
    category: "Main Dish",
    price: 1950,
    image: "/dishes/pepper-chicken-mash.jpg",
    ingredients: ["Chicken breast", "Black pepper", "Cream mash potato", "Grilled vegetables", "Rosemary"],
    prepTime: "25 Mins",
    description:
      "Pan-seared pepper chicken glazed in a bold black pepper sauce, served over silky mash and charred garden vegetables.",
    special: true,
    spiceLevel: 2,
  },
  {
    id: "grilled-fish-platter",
    name: "Umbrella Grilled Fish Platter",
    category: "Main Dish",
    price: 2100,
    image: "/dishes/grilled-fish-platter.jpg",
    ingredients: ["Fresh fish fillet", "Lemon", "Herb butter", "Mixed greens", "Dill"],
    prepTime: "22 Mins",
    description:
      "Chargrilled fresh fish fillet finished with herb butter, mixed greens and a bright citrus note — light, clean and satisfying.",
    spiceLevel: 1,
  },
  {
    id: "chicken-chopsey",
    name: "Umbrella Chicken Chopsey",
    category: "Chopsey",
    price: 1350,
    image: "/dishes/chicken-chopsey.jpg",
    ingredients: ["Chicken", "Cabbage", "Carrot", "Leeks", "Egg", "Soy glaze", "Spring onion"],
    prepTime: "18 Mins",
    description:
      "Wok-tossed noodles with chicken, garden vegetables and egg ribbons in a glossy soy glaze — a Cafe Umbrella crowd favourite.",
    spiceLevel: 1,
  },
  {
    id: "boiled-vegetables",
    name: "Ella Garden Herb Boiled Vegetables",
    category: "Boiled Vegetables",
    price: 750,
    image: "/dishes/boiled-vegetables.jpg",
    ingredients: ["Carrot", "Broccoli", "Beans", "Cauliflower", "Pumpkin", "Herb butter"],
    prepTime: "14 Mins",
    description:
      "A vibrant medley of Ella's freshest garden vegetables, lightly boiled and finished with fragrant herb butter.",
    spiceLevel: 1,
  },
  {
    id: "cheese-egg-roti",
    name: "Umbrella Cheese & Egg Roti",
    category: "Signature Roti",
    price: 950,
    image: "/dishes/cheese-egg-roti.jpg",
    ingredients: ["House roti", "Farm egg", "Cheese", "Chili flakes", "Coriander"],
    prepTime: "15 Mins",
    description:
      "Hand-folded roti stuffed with melted cheese and farm egg, griddle-crisped and finished with a touch of chili flake.",
    spiceLevel: 2,
  },
  {
    id: "coconut-sambol-roti",
    name: "Coconut Sambol Roti Wrap",
    category: "Signature Roti",
    price: 850,
    image: "/dishes/coconut-sambol-roti.jpg",
    ingredients: ["House roti", "Coconut sambol", "Curry leaves", "Dried chili", "Onion"],
    prepTime: "12 Mins",
    description:
      "Our signature roti generously filled with spicy coconut sambol and curry leaves — bold, traditional, unforgettable.",
    spiceLevel: 3,
  },
  {
    id: "legend-kottu",
    name: "Umbrella Ultimate Legend Kottu",
    category: "Kottu Junction",
    price: 1900,
    image: "/dishes/legend-kottu.jpg",
    ingredients: ["Godamba roti", "Chicken", "Cheese", "Egg", "Carrot", "Leeks", "Cabbage", "House spice blend"],
    prepTime: "20 Mins",
    description:
      "The legend of Ella Valley — hand-chopped godamba roti tossed on the flat-top with chicken, egg, melting cheese and garden vegetables in our signature spice blend.",
    special: true,
    spiceLevel: 2,
  },
  {
    id: "seafood-kottu",
    name: "Ella Cheese Seafood Kottu",
    category: "Kottu Junction",
    price: 2200,
    image: "/dishes/seafood-kottu.jpg",
    ingredients: ["Godamba roti", "Prawns", "Squid", "Cheese", "Leeks", "Egg", "House spice blend"],
    prepTime: "22 Mins",
    description:
      "Ocean-fresh prawns and squid folded into hand-chopped roti with a generous pull of melted cheese — Kottu Junction's showstopper.",
    special: true,
    spiceLevel: 2,
  },
];
