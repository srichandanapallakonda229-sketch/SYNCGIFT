const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMock = false;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure local data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 120+ unique products covering all occasions between ₹1999 and ₹10000
const SEED_PRODUCTS = [

  // =============================================
  // BIRTHDAY GIFTS (20 ITEMS)
  // =============================================
  {
    id: "prod_bday_1",
    name: "Luxury Teddy Bear",
    category: "Birthday Gifts",
    subcategory: "Teddy Bears",
    price: 2499,
    quantity: 15,
    isBestSeller: true,
    isPersonalized: false,
    description: "An ultra-soft premium plush luxury teddy bear. Standing 4 feet tall with hypoallergenic premium filling, it makes a comforting, everlasting companion. Perfect for making birthdays warm and memorable.",
    imageUrl: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_bday_2",
    name: "Customized Name Mug",
    category: "Birthday Gifts",
    subcategory: "Mugs & Bottles",
    price: 1999,
    quantity: 30,
    isBestSeller: false,
    isPersonalized: true,
    description: "A premium ceramic mug with your loved one's name printed in elegant gold typography. Comes with a matching bamboo saucer coaster and a gift box.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_3",
    name: "Personalized Photo Lamp",
    category: "Birthday Gifts",
    subcategory: "LED Lamps",
    price: 2199,
    quantity: 25,
    isBestSeller: true,
    isPersonalized: true,
    description: "A customized 3D photo lamp glowing inside a beautiful crystal sphere on a solid wooden base. Light up custom pet, family, or friend photos. Adjustable LED brightness.",
    imageUrl: "/cat_lamp.png",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_bday_4",
    name: "Premium Perfume Set",
    category: "Birthday Gifts",
    subcategory: "Premium Gifts",
    price: 3999,
    quantity: 18,
    isBestSeller: true,
    isPersonalized: false,
    description: "A curated trio of long-lasting French fragrance blends. Includes rich woody, fresh aquatic, and classic citrus scents ideal for daily premium wear.",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_bday_5",
    name: "Smart Watch Gift Box",
    category: "Birthday Gifts",
    subcategory: "Tech Gifts",
    price: 4999,
    quantity: 10,
    isBestSeller: false,
    isPersonalized: false,
    description: "A luxury tech gift box containing a feature-rich smart watch with Bluetooth calling, heart rate tracker, premium metal straps, and matching silicone sports straps.",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: []
  },
  {
    id: "prod_bday_6",
    name: "LED Memory Frame",
    category: "Birthday Gifts",
    subcategory: "Photo Frames",
    price: 2299,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: true,
    description: "A gorgeous glowing wooden photo frame featuring warm backlight LED strips. Highlight your most treasured memories with custom prints that come to life in the dark.",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_7",
    name: "Chocolate Hamper Deluxe",
    category: "Birthday Gifts",
    subcategory: "Hampers",
    price: 2299,
    quantity: 30,
    isBestSeller: true,
    isPersonalized: false,
    description: "An elegant wicker basket filled with artisanal chocolates, dark truffles, almond brittles, and hot cocoa blends. Handcrafted for the ultimate sweet tooth.",
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92ca8a3bd0?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_bday_8",
    name: "Customized Name Lamp",
    category: "Birthday Gifts",
    subcategory: "LED Lamps",
    price: 2099,
    quantity: 22,
    isBestSeller: false,
    isPersonalized: true,
    description: "Modern acrylic letter cutout displaying the birthday person's name, backlit with warm gold LEDs on a sturdy wooden base. A unique night light and decor piece.",
    imageUrl: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_9",
    name: "Luxury Handbag",
    category: "Birthday Gifts",
    subcategory: "Fashion",
    price: 5999,
    quantity: 8,
    isBestSeller: false,
    isPersonalized: false,
    description: "Elegant vegan leather handbag with premium gold hardware and multiple organizing compartments. A stylish and functional luxury accessory for her.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_bday_10",
    name: "Gaming Accessories Pack",
    category: "Birthday Gifts",
    subcategory: "Tech Gifts",
    price: 6999,
    quantity: 11,
    isBestSeller: false,
    isPersonalized: false,
    description: "Ultimate gaming starter package including an RGB mechanical keyboard, ergonomic gaming mouse, and a large anti-fray mouse pad with ambient LED strips.",
    imageUrl: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_bday_11",
    name: "Wireless Earbuds Premium",
    category: "Birthday Gifts",
    subcategory: "Tech Gifts",
    price: 3499,
    quantity: 15,
    isBestSeller: true,
    isPersonalized: false,
    description: "High-end TWS earbuds featuring Active Noise Cancellation (ANC), ultra-low latency, and 30 hours of playback with a quick charging case.",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_12",
    name: "Birthday Explosion Box",
    category: "Birthday Gifts",
    subcategory: "Surprise Boxes",
    price: 2799,
    quantity: 14,
    isBestSeller: true,
    isPersonalized: true,
    description: "A nested surprise explosion box containing personalized notes, floating balloons, confetti, and chocolates, creating a magical birthday reveal experience.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: []
  },
  {
    id: "prod_bday_13",
    name: "Personalized Cushion",
    category: "Birthday Gifts",
    subcategory: "Pillows & Cushions",
    price: 1999,
    quantity: 25,
    isBestSeller: false,
    isPersonalized: true,
    description: "Soft velvet custom printed photo cushion with a personalized message. Ultra-comfortable filling, machine-washable cover. A cozy keepsake that lasts forever.",
    imageUrl: "https://images.unsplash.com/photo-1579656381254-a4fc6c8bd07f?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_bday_14",
    name: "Flower Bouquet Deluxe",
    category: "Birthday Gifts",
    subcategory: "Flowers",
    price: 1999,
    quantity: 40,
    isBestSeller: true,
    isPersonalized: false,
    description: "A gorgeous luxury arrangement of 20 fresh roses, carnations, and lilies, hand-tied in elegant Korean wrapping paper with a personalized card.",
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_15",
    name: "Customized Wall Clock",
    category: "Birthday Gifts",
    subcategory: "Clocks",
    price: 2599,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: true,
    description: "A personalized wooden wall clock with a photo frame border and engraved names. Silent sweep mechanism ensures no ticking noise. A timeless birthday gift.",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_bday_16",
    name: "Personalized T-Shirt",
    category: "Birthday Gifts",
    subcategory: "Clothing",
    price: 1999,
    quantity: 35,
    isBestSeller: false,
    isPersonalized: true,
    description: "Premium 100% cotton unisex T-shirt with custom photo print or text. Soft-touch fabric with vibrant, long-lasting dye-sublimation printing technology.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_bday_17",
    name: "Acrylic Blood Art Frame",
    category: "Birthday Gifts",
    subcategory: "Photo Frames",
    price: 3199,
    quantity: 10,
    isBestSeller: false,
    isPersonalized: true,
    description: "A unique artistic acrylic frame featuring a modern stylized blood art print with the recipient's name. Comes in a sleek metallic border with an easel stand.",
    imageUrl: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_bday_18",
    name: "Premium Gift Hamper",
    category: "Birthday Gifts",
    subcategory: "Hampers",
    price: 4499,
    quantity: 8,
    isBestSeller: true,
    isPersonalized: false,
    description: "A luxury curated gift basket with premium chocolates, scented candles, organic body lotion, and a handwritten greeting card. Wrapped beautifully in gold foil.",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_bday_19",
    name: "Customized Keychain",
    category: "Birthday Gifts",
    subcategory: "Accessories",
    price: 1999,
    quantity: 50,
    isBestSeller: false,
    isPersonalized: true,
    description: "A high-quality stainless steel keychain with laser-engraved name and date. Available in heart, moon, star and other shapes. Comes in a gift box.",
    imageUrl: "https://images.unsplash.com/photo-1593467672547-5fc6cbcfa04d?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: []
  },
  {
    id: "prod_bday_20",
    name: "Luxury Cake Combo",
    category: "Birthday Gifts",
    subcategory: "Food & Sweets",
    price: 2599,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: false,
    description: "1kg decadent Belgian chocolate truffle cake, paired with a musical birthday card, celebratory candles, and a mini rose bouquet.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },

  // =============================================
  // ANNIVERSARY GIFTS (12 ITEMS)
  // =============================================
  {
    id: "prod_ann_1",
    name: "Teddy Bear Couple Frame",
    category: "Anniversary Gifts",
    subcategory: "Photo Frames",
    price: 2199,
    quantity: 15,
    isBestSeller: true,
    isPersonalized: true,
    description: "A premium plush anniversary teddy bear holding an elegant wooden couple photo frame. Custom print your favorite memories. A warm and cuddly keepsake.",
    imageUrl: "/teddy_frame.png",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_ann_2",
    name: "Romantic Love Explosion Box",
    category: "Anniversary Gifts",
    subcategory: "Surprise Boxes",
    price: 2299,
    quantity: 18,
    isBestSeller: true,
    isPersonalized: true,
    description: "A large hexagonal paper box that unfolds into multi-layered sheets of custom couple photos, pop-up hearts, and a chocolate cache in the center.",
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_ann_3",
    name: "Couple Name LED Lamp",
    category: "Anniversary Gifts",
    subcategory: "LED Lamps",
    price: 2699,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: true,
    description: "A beautifully crafted eternal rose flower lamp set in a glass dome with ambient fairy LED lights, with the couple's names engraved on the base. Symbolizes eternal affection.",
    imageUrl: "https://images.unsplash.com/photo-1557171280-d2343d402c09?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_ann_4",
    name: "Luxury Watch Pair",
    category: "Anniversary Gifts",
    subcategory: "Watches",
    price: 8999,
    quantity: 5,
    isBestSeller: false,
    isPersonalized: false,
    description: "Matching premium analog watches for him and her, with gold dials, stainless steel casing, and real leather straps. Presented in a premium wooden display box.",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_ann_5",
    name: "Couple Perfume Set",
    category: "Anniversary Gifts",
    subcategory: "Fragrances",
    price: 4500,
    quantity: 10,
    isBestSeller: false,
    isPersonalized: false,
    description: "Exclusive fragrance set featuring premium perfume bottles for couples—incorporating fresh aquatic tones for him and sweet floral tones for her.",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_ann_6",
    name: "Couple Bracelet Set",
    category: "Anniversary Gifts",
    subcategory: "Jewellery",
    price: 2499,
    quantity: 20,
    isBestSeller: true,
    isPersonalized: true,
    description: "A beautiful pair of matching sterling silver bracelets with interlocking heart charm and optional name engraving. Comes in a premium velvet gift box.",
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_ann_7",
    name: "Couple Spa Kit",
    category: "Anniversary Gifts",
    subcategory: "Wellness",
    price: 3499,
    quantity: 8,
    isBestSeller: false,
    isPersonalized: false,
    description: "Scented bath essential basket containing essential massage oils, foot scrub, lavender bathing salts, and plush cotton robes for a relaxing spa-at-home experience.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_ann_8",
    name: "Gold Shield Trophy",
    category: "Anniversary Gifts",
    subcategory: "Trophies & Awards",
    price: 3299,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: true,
    description: "A premium laser-cut gold finish metal shield trophy with customized couple names and anniversary year engraved. Mounted on a polished wooden base.",
    imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_ann_9",
    name: "Memory Scrapbook",
    category: "Anniversary Gifts",
    subcategory: "Books & Albums",
    price: 2499,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: true,
    description: "A beautiful handmade leather-bound photo book with customizable layouts, stickers, and handwritten journaling prompts to map your years together.",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_ann_10",
    name: "Customized Marble Printing",
    category: "Anniversary Gifts",
    subcategory: "Unique Gifts",
    price: 3999,
    quantity: 7,
    isBestSeller: false,
    isPersonalized: true,
    description: "Couple's photo printed on genuine Italian white marble tile with UV-coating protection. Stands upright with a chrome easel for elegant display.",
    imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_ann_11",
    name: "Travel Gift Box Pair",
    category: "Anniversary Gifts",
    subcategory: "Travel",
    price: 5999,
    quantity: 9,
    isBestSeller: false,
    isPersonalized: false,
    description: "Curated adventure pair package containing two premium passport covers, customized luggage tags, matching sunglasses, and a joint travel journal for adventures ahead.",
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_ann_12",
    name: "Couple Matching Tees",
    category: "Anniversary Gifts",
    subcategory: "Clothing",
    price: 2999,
    quantity: 15,
    isBestSeller: true,
    isPersonalized: true,
    description: "Adorable matching couple T-shirt set with complementary custom text prints. Premium ringspun cotton. Available in multiple colour combinations.",
    imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },

  // =============================================
  // WEDDING GIFTS (10 ITEMS)
  // =============================================
  {
    id: "prod_wed_1",
    name: "Gold Finish Idol",
    category: "Wedding Gifts",
    subcategory: "Spiritual",
    price: 4999,
    quantity: 8,
    isBestSeller: true,
    isPersonalized: false,
    description: "An elegant, highly-detailed Radha Krishna idol plated in premium 24K gold finish. Ideal spiritual wedding gift symbolizing eternal love and bonding.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_wed_2",
    name: "Premium Dinner Set",
    category: "Wedding Gifts",
    subcategory: "Kitchen",
    price: 6999,
    quantity: 10,
    isBestSeller: false,
    isPersonalized: false,
    description: "A luxury 36-piece bone china dinner set with gold-line borders. An exquisite housewarming or wedding gift that adds sophistication to any newlywed's dining table.",
    imageUrl: "/dinner_set.png",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_wed_3",
    name: "Luxury Home Decor Set",
    category: "Wedding Gifts",
    subcategory: "Home Decor",
    price: 3499,
    quantity: 15,
    isBestSeller: false,
    isPersonalized: false,
    description: "A combination of metallic vase centerpieces and geometric tea-light holders. Adds a sleek contemporary accent to any new home layout.",
    imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_wed_4",
    name: "Designer Wall Clock",
    category: "Wedding Gifts",
    subcategory: "Clocks",
    price: 2799,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: false,
    description: "A silent sweep, handcrafted metal wall art clock with a luxury gold finish. Elevates living rooms and entries instantly. Battery powered, whisper-silent.",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_wed_5",
    name: "Silver Pooja Gift Set",
    category: "Wedding Gifts",
    subcategory: "Spiritual",
    price: 7999,
    quantity: 5,
    isBestSeller: false,
    isPersonalized: false,
    description: "A beautiful pure silver plated Pooja plate set containing two bowls, a bell, a diya, and an incense holder, packed in a premium velvet box.",
    imageUrl: "https://images.unsplash.com/photo-1609136118693-9481b07b1a93?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_wed_6",
    name: "Couple Portrait Frame",
    category: "Wedding Gifts",
    subcategory: "Photo Frames",
    price: 3999,
    quantity: 10,
    isBestSeller: true,
    isPersonalized: true,
    description: "A custom hand-sketched digital oil painting of the couple, printed on canvas with an elegant solid wood frame. A cherished art piece for their home.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_wed_7",
    name: "Luxury Bedding Set",
    category: "Wedding Gifts",
    subcategory: "Home Textiles",
    price: 5499,
    quantity: 8,
    isBestSeller: false,
    isPersonalized: false,
    description: "A premium 6-piece bed sheet set made from 100% Egyptian cotton (800 thread count). Includes one bedspread, two pillows, and matching cushions.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_wed_8",
    name: "Smart Kitchen Appliances",
    category: "Wedding Gifts",
    subcategory: "Kitchen",
    price: 8999,
    quantity: 6,
    isBestSeller: false,
    isPersonalized: false,
    description: "A high-performance smart multi-cooker and blender combo. Equips newlyweds with modern kitchen efficiency and customizable cooking presets.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_wed_9",
    name: "Premium Luggage Set",
    category: "Wedding Gifts",
    subcategory: "Travel",
    price: 8499,
    quantity: 7,
    isBestSeller: false,
    isPersonalized: false,
    description: "A matching pair of polycarbonate hard shell trolley bags with TSA locks, ideal for the honeymoon trip. Available in 4 premium colors.",
    imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_wed_10",
    name: "Wooden Name Board",
    category: "Wedding Gifts",
    subcategory: "Name Boards",
    price: 2999,
    quantity: 14,
    isBestSeller: false,
    isPersonalized: true,
    description: "An elegant teak wood name board for the couple's new home, with laser-engraved names in a calligraphic font and a floral border design.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },

  // =============================================
  // HOUSEWARMING (10 ITEMS)
  // =============================================
  {
    id: "prod_house_1",
    name: "Indoor Plants & Stand set",
    category: "Housewarming",
    subcategory: "Plants",
    price: 2199,
    quantity: 25,
    isBestSeller: true,
    isPersonalized: false,
    description: "A curated collection of air-purifying indoor plants with a beautiful multi-tier wooden ladder shelf and botanical framed canvas art. Perfect to green up a new home.",
    imageUrl: "/plants_decor.png",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_house_2",
    name: "Luxury Wall Art Set",
    category: "Housewarming",
    subcategory: "Wall Decor",
    price: 4499,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: false,
    description: "A stunning 3-piece abstract metallic wall decoration with golden accents, perfect for enhancing the living room focal wall. Museum-quality canvas prints.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_house_3",
    name: "Espresso Coffee Maker",
    category: "Housewarming",
    subcategory: "Appliances",
    price: 4999,
    quantity: 9,
    isBestSeller: false,
    isPersonalized: false,
    description: "A sleek espresso maker with automatic steam extraction for making professional-grade coffee at home. Perfect housewarming utility gift.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_house_4",
    name: "Digital Air Fryer",
    category: "Housewarming",
    subcategory: "Appliances",
    price: 6999,
    quantity: 10,
    isBestSeller: true,
    isPersonalized: false,
    description: "A 4.5L digital air fryer with touchscreen control and 8 pre-programmed presets. Healthy frying using 90% less oil.",
    imageUrl: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_house_5",
    name: "Home Decor Combo",
    category: "Housewarming",
    subcategory: "Decor",
    price: 3799,
    quantity: 15,
    isBestSeller: false,
    isPersonalized: false,
    description: "A matching luxury home pack featuring a ceramic aromatherapy diffuser, two scented candles, and an abstract metal sculpture for elegant table display.",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_house_6",
    name: "Kitchen Organizer Set",
    category: "Housewarming",
    subcategory: "Kitchen",
    price: 2299,
    quantity: 14,
    isBestSeller: false,
    isPersonalized: false,
    description: "A set of 6 sleek glass pantry storage jars with wooden airtight lids and customizable minimal spice labels. Perfect for a modern kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c72eb8ba8?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: []
  },
  {
    id: "prod_house_7",
    name: "LED Wall Lamp Modern",
    category: "Housewarming",
    subcategory: "Lighting",
    price: 2799,
    quantity: 11,
    isBestSeller: false,
    isPersonalized: false,
    description: "Contemporary linear LED wall lamp with warm ambient glow. Adds a premium architectural layer to halls and bedrooms.",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_house_8",
    name: "Designer Wall Mirror",
    category: "Housewarming",
    subcategory: "Mirrors",
    price: 3999,
    quantity: 7,
    isBestSeller: false,
    isPersonalized: false,
    description: "A large circular wall mirror with an ornate metal gold finish frame, creating a sense of depth and luxury in the foyer or living room.",
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_house_9",
    name: "Customized Name Plate",
    category: "Housewarming",
    subcategory: "Name Boards",
    price: 2499,
    quantity: 20,
    isBestSeller: true,
    isPersonalized: true,
    description: "Handcrafted premium MDF name board with laser-engraved family name and house number. Finished in premium teak wood veneer with golden accents.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_house_10",
    name: "Premium Dining Set",
    category: "Housewarming",
    subcategory: "Kitchen",
    price: 5999,
    quantity: 8,
    isBestSeller: false,
    isPersonalized: false,
    description: "A premium 24-piece luxury ceramic dinner set with matching gold serving spoons, elevating family feasts in the new kitchen. Microwave and dishwasher safe.",
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },

  // =============================================
  // BABY SHOWER (10 ITEMS)
  // =============================================
  {
    id: "prod_baby_1",
    name: "Baby Care Kit",
    category: "Baby Shower",
    subcategory: "Care Products",
    price: 2499,
    quantity: 12,
    isBestSeller: true,
    isPersonalized: false,
    description: "An all-in-one organic baby skin-care package. Includes gentle baby wash, nourishing lotion, diaper rash cream, and massage oil. Safe for sensitive newborn skin.",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_baby_2",
    name: "Baby Clothing Set",
    category: "Baby Shower",
    subcategory: "Clothing",
    price: 2199,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: false,
    description: "A set of 6 soft organic cotton baby rompers and onesies with matching bibs, mittens, and caps. Extremely gentle on newborn skin.",
    imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_baby_3",
    name: "Baby Toy Collection",
    category: "Baby Shower",
    subcategory: "Toys",
    price: 2799,
    quantity: 15,
    isBestSeller: false,
    isPersonalized: false,
    description: "A pack of 8 BPA-free developmental teethers, plush rattles, and soft textured squeeze toys for tactile stimulation and early brain development.",
    imageUrl: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_baby_4",
    name: "Baby Soft Blanket Set",
    category: "Baby Shower",
    subcategory: "Blankets",
    price: 1999,
    quantity: 22,
    isBestSeller: false,
    isPersonalized: false,
    description: "A pair of ultra-plush bamboo flannel swaddle blankets. Super breathable and cozy for deep baby sleep. Comes in a pastel gift box.",
    imageUrl: "https://images.unsplash.com/photo-1584290860587-c103b87a8e7e?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_baby_5",
    name: "Baby Cradle Premium",
    category: "Baby Shower",
    subcategory: "Furniture",
    price: 6499,
    quantity: 5,
    isBestSeller: false,
    isPersonalized: false,
    description: "An automatic swinging baby bassinet cradle with mosquito net enclosure, soothing lullabies player, and remote controller. Whisper-quiet motor.",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_baby_6",
    name: "Baby Gift Basket",
    category: "Baby Shower",
    subcategory: "Hampers",
    price: 3499,
    quantity: 10,
    isBestSeller: true,
    isPersonalized: false,
    description: "A premium wicker baby shower hamper containing soft organic rompers, blankets, plush sheep toy, baby booties, and nursery essentials.",
    imageUrl: "/baby_hamper.png",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_baby_7",
    name: "Baby Feeding Kit",
    category: "Baby Shower",
    subcategory: "Feeding",
    price: 2299,
    quantity: 16,
    isBestSeller: false,
    isPersonalized: false,
    description: "A complete baby feeding set made from food-grade silicone. Includes suction bowls, soft spoons, bibs, and spill-proof cups. Dishwasher safe.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_baby_8",
    name: "Baby Walker",
    category: "Baby Shower",
    subcategory: "Furniture",
    price: 3199,
    quantity: 8,
    isBestSeller: false,
    isPersonalized: false,
    description: "A comfortable baby walker with an adjustable height scale, a toy tray with musical buttons, and protective rubber bumpers. Foldable for easy storage.",
    imageUrl: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_baby_9",
    name: "Personalized Baby Frame",
    category: "Baby Shower",
    subcategory: "Photo Frames",
    price: 2199,
    quantity: 18,
    isBestSeller: false,
    isPersonalized: true,
    description: "A keepsake wooden photo frame with the baby's name, birth date, weight, and height engraved. Comes with a slot for first photo and a velvet easel.",
    imageUrl: "https://images.unsplash.com/photo-1617251135623-e3e4cf1f4c05?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_baby_10",
    name: "Baby Pillow Set",
    category: "Baby Shower",
    subcategory: "Bedding",
    price: 2499,
    quantity: 14,
    isBestSeller: false,
    isPersonalized: false,
    description: "A premium organic cotton pillow set with flat pillow, side support bolsters, and a breathable anti-flat-head positioning pillow for newborns.",
    imageUrl: "https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },

  // =============================================
  // SPIRITUAL GIFTS (8 ITEMS) — NEW CATEGORY
  // =============================================
  {
    id: "prod_spirit_1",
    name: "God Photo Frame Wooden",
    category: "Spiritual Gifts",
    subcategory: "Photo Frames",
    price: 2199,
    quantity: 20,
    isBestSeller: true,
    isPersonalized: false,
    description: "Premium teak wood frame with a high-definition god photo print under UV-protected glass. Comes with a hanging hook and table easel stand.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-9799292850a5?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_spirit_2",
    name: "Acrylic God Frame LED",
    category: "Spiritual Gifts",
    subcategory: "LED Frames",
    price: 2699,
    quantity: 15,
    isBestSeller: true,
    isPersonalized: false,
    description: "A transparent acrylic god photo frame with edge-lit warm LED glow. The light illuminates the sacred image beautifully for pooja rooms and altars.",
    imageUrl: "https://images.unsplash.com/photo-1532529867795-3c83442c1e5c?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_spirit_3",
    name: "Marble Printed God Frame",
    category: "Spiritual Gifts",
    subcategory: "Marble Prints",
    price: 3499,
    quantity: 10,
    isBestSeller: false,
    isPersonalized: false,
    description: "A sacred god image beautifully printed on genuine Italian white marble tile with UV coating and chrome easel for premium pooja room display.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_spirit_4",
    name: "Temple Pooja Set",
    category: "Spiritual Gifts",
    subcategory: "Pooja Sets",
    price: 3999,
    quantity: 12,
    isBestSeller: false,
    isPersonalized: false,
    description: "A complete brass pooja set including a kalash, incense holder, diya stand, bell, and coconut bowl. Presented in a premium wooden gift box.",
    imageUrl: "https://images.unsplash.com/photo-1609136118693-9481b07b1a93?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_spirit_5",
    name: "Ganesha Idol Premium",
    category: "Spiritual Gifts",
    subcategory: "Idols",
    price: 4999,
    quantity: 8,
    isBestSeller: true,
    isPersonalized: false,
    description: "A beautifully handcrafted Ganesha idol in a sitting pose, finished in antique gold finish. Made from eco-friendly resin with intricate detailing.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-9799292850a5?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_spirit_6",
    name: "MDF Spiritual Wall Frame",
    category: "Spiritual Gifts",
    subcategory: "Wall Decor",
    price: 2499,
    quantity: 18,
    isBestSeller: false,
    isPersonalized: false,
    description: "A laser-cut MDF 3D wall art with 'Om' mandala design, finished in gold and white with hanging hooks. Creates a serene spiritual ambiance.",
    imageUrl: "https://images.unsplash.com/photo-1587561507736-e52d2e33e02c?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_spirit_7",
    name: "Religious Gift Hamper",
    category: "Spiritual Gifts",
    subcategory: "Hampers",
    price: 2999,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: false,
    description: "A complete spiritual hamper with organic havan samagri, pure cow ghee diya, saffron roli, premium agarbatti, and a small brass idol.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_spirit_8",
    name: "Customized Temple Nameplate",
    category: "Spiritual Gifts",
    subcategory: "Name Boards",
    price: 2199,
    quantity: 16,
    isBestSeller: false,
    isPersonalized: true,
    description: "A premium brass nameplate with family name and 'Shree' embossed in Devanagari script, ideal for home temple entrances and prayer rooms.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },

  // =============================================
  // FESTIVALS (10 ITEMS)
  // =============================================
  {
    id: "prod_fest_1",
    name: "Diwali Hamper Premium",
    category: "Festivals",
    subcategory: "Diwali",
    price: 2999,
    quantity: 40,
    isBestSeller: true,
    isPersonalized: false,
    description: "A premium Diwali basket with 4 brass hand-crafted diyas, premium organic dry fruit jars, silver coin, and organic incense cones. Beautifully wrapped.",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_fest_2",
    name: "Christmas Decoration Box",
    category: "Festivals",
    subcategory: "Christmas",
    price: 2499,
    quantity: 25,
    isBestSeller: false,
    isPersonalized: false,
    description: "A complete set of Christmas tree ornaments containing 50 glass balls, tree topper star, warm copper wire fairy lights, and artificial snow sprays.",
    imageUrl: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_fest_3",
    name: "Rakhi Gift Box Deluxe",
    category: "Festivals",
    subcategory: "Rakhi",
    price: 1999,
    quantity: 50,
    isBestSeller: true,
    isPersonalized: false,
    description: "A luxury rakhi hamper containing two designer rudraksha rakhis, roli-chawal bowls, a box of premium kaju katli, and assorted dry fruits.",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_fest_4",
    name: "Sankranti Gift Basket",
    category: "Festivals",
    subcategory: "Sankranti",
    price: 2299,
    quantity: 30,
    isBestSeller: false,
    isPersonalized: false,
    description: "Traditional festival basket packed with handmade til-gud laddoos, premium dry fruits, organic jaggery block, and a decorative small kite.",
    imageUrl: "https://images.unsplash.com/photo-1603569283847-be4020c2162e?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_fest_5",
    name: "Ugadi Special Box",
    category: "Festivals",
    subcategory: "Ugadi",
    price: 2199,
    quantity: 35,
    isBestSeller: false,
    isPersonalized: false,
    description: "Handcrafted box featuring fresh mango leaves garland, organic ingredients for Ugadi Pacchadi, dry fruits pack, and a brass pooja diya.",
    imageUrl: "https://images.unsplash.com/photo-1583258292688-d0213df4a3a8?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_fest_6",
    name: "Eid Sweet Box Royal",
    category: "Festivals",
    subcategory: "Eid",
    price: 2599,
    quantity: 28,
    isBestSeller: false,
    isPersonalized: false,
    description: "A royal wooden box with partitioned sections of dates, baklava, premium almond stuffed dates, and dry fruit barfi. Wrapped in satin ribbon.",
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_fest_7",
    name: "Ganesh Festival Kit",
    category: "Festivals",
    subcategory: "Ganesh Chaturthi",
    price: 2799,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: false,
    description: "Eco-friendly clay Ganesha idol, packed with a decorative pooja sthal stand, modak mold, and incense pack. Perfect for Ganesh Chaturthi celebration.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-9799292850a5?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_fest_8",
    name: "New Year Celebration Box",
    category: "Festivals",
    subcategory: "New Year",
    price: 3499,
    quantity: 15,
    isBestSeller: false,
    isPersonalized: false,
    description: "Kick off the new year with a custom-printed planner, premium cookies box, sparklers, champagne glasses pair, and party caps.",
    imageUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_fest_9",
    name: "Holi Color Gift Box",
    category: "Festivals",
    subcategory: "Holi",
    price: 2199,
    quantity: 30,
    isBestSeller: false,
    isPersonalized: false,
    description: "A vibrant Holi hamper with 12 premium organic herbal gulal colors, a water gun, festive ladoos, and a greeting card. Safe for all skin types.",
    imageUrl: "https://images.unsplash.com/photo-1612538498456-e861df91d4d0?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_fest_10",
    name: "Diwali LED Lantern Set",
    category: "Festivals",
    subcategory: "Diwali",
    price: 2999,
    quantity: 22,
    isBestSeller: true,
    isPersonalized: false,
    description: "A set of 3 premium decorative hanging lanterns with warm fairy LED lights. Battery operated, perfect for Diwali decoration both indoors and outdoors.",
    imageUrl: "https://images.unsplash.com/photo-1604608672516-5b3c60d0bf7c?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },

  // =============================================
  // CORPORATE GIFTS (10 ITEMS)
  // =============================================
  {
    id: "prod_corp_1",
    name: "Premium Office Diary",
    category: "Corporate Gifts",
    subcategory: "Stationery",
    price: 1999,
    quantity: 50,
    isBestSeller: true,
    isPersonalized: true,
    description: "A luxury leather-bound planner diary with an 8000mAh built-in power bank, USB ports, and card slot pockets. Personalized with company logo.",
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_corp_2",
    name: "Premium Laptop Bag",
    category: "Corporate Gifts",
    subcategory: "Bags",
    price: 3499,
    quantity: 30,
    isBestSeller: false,
    isPersonalized: false,
    description: "A sleek vegan leather laptop messenger bag with shockproof compartments, padded shoulder strap, and USB charging slot. Fits 15.6\" laptops.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_corp_3",
    name: "Smart Water Bottle LED",
    category: "Corporate Gifts",
    subcategory: "Bottles",
    price: 2299,
    quantity: 45,
    isBestSeller: false,
    isPersonalized: true,
    description: "A double-walled vacuum insulated steel water bottle. Features a smart LED temperature touch lid screen. Customizable with name/logo engraving.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_corp_4",
    name: "Desk Organizer Deluxe",
    category: "Corporate Gifts",
    subcategory: "Desk Accessories",
    price: 2799,
    quantity: 20,
    isBestSeller: false,
    isPersonalized: false,
    description: "A premium solid wood desk stand organizing smartphones, business cards, sticky notes, and accessories. Adds a premium aesthetic to any workspace.",
    imageUrl: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_corp_5",
    name: "Premium Pen Set",
    category: "Corporate Gifts",
    subcategory: "Stationery",
    price: 2199,
    quantity: 40,
    isBestSeller: true,
    isPersonalized: true,
    description: "A luxury matte-black heavy ballpoint and rollerball pen combo in an embossed wood gift case. Laser-engravable with employee name or company motto.",
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod_corp_6",
    name: "High-Capacity Power Bank",
    category: "Corporate Gifts",
    subcategory: "Tech Accessories",
    price: 2999,
    quantity: 25,
    isBestSeller: false,
    isPersonalized: false,
    description: "A 20000mAh metal shell power bank supporting 22.5W fast output, keeping corporate executives connected on business travels.",
    imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b629?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod_corp_7",
    name: "Wireless Ergonomic Mouse",
    category: "Corporate Gifts",
    subcategory: "Tech Accessories",
    price: 2499,
    quantity: 35,
    isBestSeller: false,
    isPersonalized: false,
    description: "High-precision vertical wireless mouse with custom buttons, ergonomic design to prevent wrist strain, and 18-month battery life.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    reviews: []
  },
  {
    id: "prod_corp_8",
    name: "LED Smart Desk Lamp",
    category: "Corporate Gifts",
    subcategory: "Desk Accessories",
    price: 3199,
    quantity: 18,
    isBestSeller: false,
    isPersonalized: false,
    description: "Dimmable LED reading light with adjustable arm, wireless charging base, and built-in LCD clock display. Perfect for modern home office setups.",
    imageUrl: "https://images.unsplash.com/photo-1534189237700-4a75f49a53b1?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    reviews: []
  },
  {
    id: "prod_corp_9",
    name: "Corporate Gift Voucher",
    category: "Corporate Gifts",
    subcategory: "Gift Cards",
    price: 5000,
    quantity: 100,
    isBestSeller: false,
    isPersonalized: false,
    description: "A premium physical gift envelope voucher worth ₹5000, redeemable on any item across the SyncGifts catalog. Perfect for employee rewards.",
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod_corp_10",
    name: "Customized Office Clock",
    category: "Corporate Gifts",
    subcategory: "Clocks",
    price: 3499,
    quantity: 22,
    isBestSeller: false,
    isPersonalized: true,
    description: "A sleek modern office wall clock with company logo engraved on the face. Metal casing with a silent sweep quartz movement. 12-inch diameter.",
    imageUrl: "https://images.unsplash.com/photo-1615786682965-e6d3e7f97fef?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviews: []
  }
];



const DEFAULT_SHOP_INFO = {
  shopName: "SyncGifts",
  owner: "Karthik",
  description: "SyncGifts is an AI-powered gift recommendation platform designed to help customers quickly find the perfect gift for every occasion. It offers personalized recommendations based on occasion, age, relationship, and budget, making gift shopping faster, smarter, and more enjoyable.",
  address: "Opposite Bus Stop, Yadagirigutta, Telangana, India",
  phone: "9951303523",
  whatsapp: "9951303523",
  email: "hello@syncgifts.com",
  businessHours: "Monday - Sunday: 10:00 AM - 9:00 PM",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3802.7214952093557!2d78.9441113!3d17.5921617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb6588a53e4125%3A0x6b8764024340d859!2sYadagirigutta%20Bus%20Stop!5e0!3m2!1sen!2sin!4v1700000000000",
  branches: [
    "Yadagirigutta (Main Branch)",
    "Bhongir",
    "Warangal",
    "Hanamkonda",
    "Hyderabad"
  ],
  whatsappSettings: {
    autoReplyOnNoAnswer: true,
    busyMessage: "Hello! Thank you for contacting SyncGifts. We are currently busy and unable to answer your call. We will contact you within 15–20 minutes. Thank you for your patience."
  }
};

// JSON database helper functions
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readJSON = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    if (collection === 'products') {
      writeJSON('products', SEED_PRODUCTS);
      return SEED_PRODUCTS;
    }
    if (collection === 'shopInfo') {
      writeJSON('shopInfo', DEFAULT_SHOP_INFO);
      return DEFAULT_SHOP_INFO;
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeJSON = (collection, data) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
};

// MongoDB Mongoose Schemas (used if MongoDB connects successfully)
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviews: [{ user: String, rating: Number, comment: String }],
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Processing, Shipped, Delivered, Cancelled
  whatsappNotificationSent: { type: Boolean, default: false },
  shippingAddress: { type: String },
  contactPhone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const shopInfoSchema = new mongoose.Schema({
  shopName: { type: String, default: "SyncGifts" },
  owner: { type: String },
  description: { type: String },
  address: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  email: { type: String },
  businessHours: { type: String },
  googleMapsEmbedUrl: { type: String },
  branches: [{ type: String }],
  whatsappSettings: {
    autoReplyOnNoAnswer: { type: Boolean, default: true },
    busyMessage: { type: String }
  }
});

let User, Product, Order, ShopInfo;

async function connect() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://srichandanapallakonda229_db_user:Sri%402008@cluster0.5pgdfml.mongodb.net/syncgifts?retryWrites=true&w=majority&appName=Cluster0';
  if (!uri) {
    console.log("No MONGODB_URI found. Defaulting to local JSON file-based database.");
    isMock = true;
    initializeMockData();
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB successfully!");
    isMock = false;

    // Define models
    User = mongoose.models.User || mongoose.model('User', userSchema);
    Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
    ShopInfo = mongoose.models.ShopInfo || mongoose.model('ShopInfo', shopInfoSchema);

    // Seed if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(SEED_PRODUCTS.map(p => {
        const { id, ...prodWithoutId } = p;
        return prodWithoutId;
      }));
      console.log("Mongoose: Seeded default products");
    }

    const shopCount = await ShopInfo.countDocuments();
    if (shopCount === 0) {
      await ShopInfo.create(DEFAULT_SHOP_INFO);
      console.log("Mongoose: Seeded default shop details");
    }

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Falling back to local JSON file-based database.");
    isMock = true;
    initializeMockData();
    return false;
  }
}

function initializeMockData() {
  readJSON('products');
  readJSON('shopInfo');
  readJSON('users');
  readJSON('orders');
}

const db = {
  isMock: () => isMock,
  connect,

  // Users
  getUserById: async (id) => {
    if (isMock) {
      const users = readJSON('users');
      return users.find(u => u.id === id) || null;
    }
    return await User.findOne({ id });
  },

  upsertUser: async (userData) => {
    if (isMock) {
      const users = readJSON('users');
      const idx = users.findIndex(u => u.id === userData.id);
      const updatedUser = { 
        ...userData, 
        role: idx !== -1 ? users[idx].role : (userData.email && userData.email.endsWith('@syncgifts.com') ? 'admin' : 'user'),
        createdAt: idx !== -1 ? users[idx].createdAt : new Date().toISOString()
      };
      if (idx !== -1) {
        users[idx] = updatedUser;
      } else {
        users.push(updatedUser);
      }
      writeJSON('users', users);
      return updatedUser;
    }
    const existing = await User.findOne({ id: userData.id });
    const role = existing ? existing.role : (userData.email && userData.email.endsWith('@syncgifts.com') ? 'admin' : 'user');
    return await User.findOneAndUpdate(
      { id: userData.id },
      { ...userData, role },
      { new: true, upsert: true }
    );
  },

  getAllUsers: async () => {
    if (isMock) {
      return readJSON('users');
    }
    return await User.find({});
  },

  updateUserRole: async (id, role) => {
    if (isMock) {
      const users = readJSON('users');
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx].role = role;
        writeJSON('users', users);
        return users[idx];
      }
      return null;
    }
    return await User.findOneAndUpdate({ id }, { role }, { new: true });
  },

  // Products
  getProducts: async () => {
    if (isMock) {
      return readJSON('products');
    }
    const prods = await Product.find({});
    return prods.map(p => {
      const obj = p.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
  },

  getProductById: async (id) => {
    if (isMock) {
      const products = readJSON('products');
      return products.find(p => p.id === id) || null;
    }
    try {
      const prod = await Product.findById(id);
      if (!prod) return null;
      const obj = prod.toObject();
      obj.id = obj._id.toString();
      return obj;
    } catch (e) {
      return null;
    }
  },

  createProduct: async (productData) => {
    if (isMock) {
      const products = readJSON('products');
      const newProduct = {
        ...productData,
        id: 'prod_' + (Date.now() + Math.random().toString(36).substr(2, 5)),
        rating: 5,
        reviews: []
      };
      products.push(newProduct);
      writeJSON('products', products);
      return newProduct;
    }
    const prod = await Product.create(productData);
    const obj = prod.toObject();
    obj.id = obj._id.toString();
    return obj;
  },

  updateProduct: async (id, productData) => {
    if (isMock) {
      const products = readJSON('products');
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        const updated = { ...products[idx], ...productData };
        products[idx] = updated;
        writeJSON('products', products);
        return updated;
      }
      return null;
    }
    try {
      const prod = await Product.findByIdAndUpdate(id, productData, { new: true });
      if (!prod) return null;
      const obj = prod.toObject();
      obj.id = obj._id.toString();
      return obj;
    } catch (e) {
      return null;
    }
  },

  deleteProduct: async (id) => {
    if (isMock) {
      const products = readJSON('products');
      const filtered = products.filter(p => p.id !== id);
      writeJSON('products', filtered);
      return true;
    }
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (e) {
      return false;
    }
  },

  addProductReview: async (id, review) => {
    if (isMock) {
      const products = readJSON('products');
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) {
        products[idx].reviews.push(review);
        const sum = products[idx].reviews.reduce((acc, r) => acc + r.rating, 0);
        products[idx].rating = parseFloat((sum / products[idx].reviews.length).toFixed(1));
        writeJSON('products', products);
        return products[idx];
      }
      return null;
    }
    const prod = await Product.findById(id);
    if (!prod) return null;
    prod.reviews.push(review);
    const sum = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
    prod.rating = parseFloat((sum / prod.reviews.length).toFixed(1));
    await prod.save();
    const obj = prod.toObject();
    obj.id = obj._id.toString();
    return obj;
  },

  // Orders
  getOrders: async () => {
    if (isMock) {
      return readJSON('orders');
    }
    const ords = await Order.find({}).sort({ createdAt: -1 });
    return ords.map(o => {
      const obj = o.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
  },

  getOrdersByUserId: async (userId) => {
    if (isMock) {
      const orders = readJSON('orders');
      return orders.filter(o => o.userId === userId).reverse();
    }
    const ords = await Order.find({ userId }).sort({ createdAt: -1 });
    return ords.map(o => {
      const obj = o.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
  },

  createOrder: async (orderData) => {
    if (isMock) {
      const orders = readJSON('orders');
      const products = readJSON('products');

      orderData.products.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.quantity = Math.max(0, prod.quantity - item.quantity);
        }
      });
      writeJSON('products', products);

      const newOrder = {
        ...orderData,
        id: 'ord_' + (Date.now() + Math.random().toString(36).substr(2, 5)),
        status: 'Pending',
        whatsappNotificationSent: false,
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      writeJSON('orders', orders);
      return newOrder;
    }
    
    for (const item of orderData.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    const order = await Order.create({
      ...orderData,
      status: 'Pending'
    });
    const obj = order.toObject();
    obj.id = obj._id.toString();
    return obj;
  },

  updateOrderStatus: async (id, status) => {
    if (isMock) {
      const orders = readJSON('orders');
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].status = status;
        writeJSON('orders', orders);
        return orders[idx];
      }
      return null;
    }
    try {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) return null;
      const obj = order.toObject();
      obj.id = obj._id.toString();
      return obj;
    } catch (e) {
      return null;
    }
  },

  updateOrderWhatsappStatus: async (id, sent) => {
    if (isMock) {
      const orders = readJSON('orders');
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        orders[idx].whatsappNotificationSent = sent;
        writeJSON('orders', orders);
        return orders[idx];
      }
      return null;
    }
    const order = await Order.findByIdAndUpdate(id, { whatsappNotificationSent: sent }, { new: true });
    if (!order) return null;
    const obj = order.toObject();
    obj.id = obj._id.toString();
    return obj;
  },

  // ShopInfo
  getShopInfo: async () => {
    if (isMock) {
      return readJSON('shopInfo');
    }
    let info = await ShopInfo.findOne({});
    if (!info) {
      info = await ShopInfo.create(DEFAULT_SHOP_INFO);
    }
    const obj = info.toObject();
    obj.id = obj._id.toString();
    return obj;
  },

  updateShopInfo: async (infoData) => {
    if (isMock) {
      const info = { ...readJSON('shopInfo'), ...infoData };
      writeJSON('shopInfo', info);
      return info;
    }
    const info = await ShopInfo.findOneAndUpdate({}, infoData, { new: true, upsert: true });
    const obj = info.toObject();
    obj.id = obj._id.toString();
    return obj;
  }
};

module.exports = db;
