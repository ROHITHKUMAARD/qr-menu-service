/**
 * Spice Street — Menu Dataset (Checkpoint 2B)
 * Exactly 25 items across 7 categories (4, 4, 4, 3, 3, 4, 3 distribution)
 * Bilingual support: English (en) and Hindi (hi)
 */

const RESTAURANT_INFO = {
  name: {
    en: "Spice Street",
    hi: "मसाला स्ट्रीट"
  },
  tagline: {
    en: "Authentic Indian Flavours & Culinary Heritage",
    hi: "प्रामाणिक भारतीय स्वाद एवं पाक परंपरा"
  },
  address: {
    en: "Shop 14, Block C, Inner Circle, Connaught Place, New Delhi",
    hi: "दुकान 14, ब्लॉक सी, इनर सर्कल, कनॉट प्लेस, नई दिल्ली"
  },
  timing: {
    en: "Open Daily: 11:30 AM – 11:00 PM",
    hi: "प्रतिदिन खुला: सुबह 11:30 – रात 11:00"
  },
  phone: "+91 98765 43210",
  typeBadge: {
    en: "Dine-In • Takeaway",
    hi: "डाइन-इन • टेकअवे"
  }
};

const CATEGORIES = [
  {
    id: "starters",
    name: {
      en: "Starters",
      hi: "शुरुआत / स्टार्टर्स"
    },
    icon: "🍢",
    expectedCount: 4
  },
  {
    id: "south-indian",
    name: {
      en: "South Indian",
      hi: "दक्षिण भारतीय"
    },
    icon: "🥞",
    expectedCount: 4
  },
  {
    id: "north-indian",
    name: {
      en: "North Indian",
      hi: "उत्तर भारतीय"
    },
    icon: "🥘",
    expectedCount: 4
  },
  {
    id: "main-course",
    name: {
      en: "Main Course",
      hi: "मुख्य भोजन"
    },
    icon: "🍲",
    expectedCount: 3
  },
  {
    id: "rice-biryani",
    name: {
      en: "Rice and Biryani",
      hi: "चावल एवं बिरयानी"
    },
    icon: "🍚",
    expectedCount: 3
  },
  {
    id: "beverages",
    name: {
      en: "Beverages",
      hi: "पेय पदार्थ"
    },
    icon: "🥤",
    expectedCount: 4
  },
  {
    id: "desserts",
    name: {
      en: "Desserts",
      hi: "मिठाइयाँ / डेज़र्ट्स"
    },
    icon: "🍨",
    expectedCount: 3
  }
];

const MENU_ITEMS = [
  // 1. STARTERS (4 items)
  {
    id: "str-01",
    categoryId: "starters",
    name: {
      en: "Paneer Tikka Angare",
      hi: "पनीर टिक्का अंगारे"
    },
    description: {
      en: "Succulent cubes of cottage cheese marinated in spiced yogurt and roasted in a traditional clay oven.",
      hi: "पारंपरिक तंदूर में सिका हुआ मसालेदार दही में डूबा ताज़ा पनीर।"
    },
    price: 260,
    isVeg: true,
    isAvailable: true,
    tags: ["Tandoor", "Chef Special"]
  },
  {
    id: "str-02",
    categoryId: "starters",
    name: {
      en: "Crispy Corn Pepper Fry",
      hi: "क्रिस्पी कॉर्न पेपर फ्राई"
    },
    description: {
      en: "Golden sweet corn tossed with freshly cracked black pepper, curry leaves, and green chillies.",
      hi: "कुचली हुई काली मिर्च, कढ़ी पत्ता और हरी मिर्च के साथ भुना कुरकुरा स्वीट कॉर्न।"
    },
    price: 210,
    isVeg: true,
    isAvailable: true,
    tags: ["Crispy", "Spicy"]
  },
  {
    id: "str-03",
    categoryId: "starters",
    name: {
      en: "Murgh Malai Tikka",
      hi: "मुर्ग मलाई टिक्का"
    },
    description: {
      en: "Tender chicken morsels infused with cream, cheese, cardamom, and mild aromatic spices.",
      hi: "मलाई, चीज़ और इलायची के सौम्य सुगंधित मसालों में पका मुलायम चिकन टिक्का।"
    },
    price: 320,
    isVeg: false,
    isAvailable: true,
    tags: ["Mild", "Clay Oven"]
  },
  {
    id: "str-04",
    categoryId: "starters",
    name: {
      en: "Amritsari Fish Tikka",
      hi: "अमृतसरी फिश टिक्का"
    },
    description: {
      en: "River sole fish fillets coated in carom seed batter and crisp-fried to perfection.",
      hi: "अजवाइन और बेसन के घोल में लिपटी कुरकुरी तली हुई अमृतसरी मछली।"
    },
    price: 360,
    isVeg: false,
    isAvailable: false, // Testing availability indicator (Sold Out)
    tags: ["Crisp", "Specialty"]
  },

  // 2. SOUTH INDIAN (4 items)
  {
    id: "si-01",
    categoryId: "south-indian",
    name: {
      en: "Masala Dosa",
      hi: "मसाला डोसा"
    },
    description: {
      en: "Crispy fermented crepe stuffed with spiced potato mash, served with sambar and fresh chutneys.",
      hi: "खुशबूदार आलू के मसाले से भरा कुरकुरा डोसा, सांभर और ताज़ा चटनियों के साथ।"
    },
    price: 160,
    isVeg: true,
    isAvailable: true,
    tags: ["Classic", "Served with Sambar"]
  },
  {
    id: "si-02",
    categoryId: "south-indian",
    name: {
      en: "Medu Vada",
      hi: "मेदू वड़ा"
    },
    description: {
      en: "Crisp golden lentil doughnuts fluffy on the inside, accompanied by coconut chutney and piping hot sambar.",
      hi: "बाहर से कुरकुरे और अंदर से स्पंजी उड़द दाल के वड़े, नारियल चटनी व सांभर सहित।"
    },
    price: 130,
    isVeg: true,
    isAvailable: true,
    tags: ["Crispy", "Breakfast Classic"]
  },
  {
    id: "si-03",
    categoryId: "south-indian",
    name: {
      en: "Ghee Podi Idli",
      hi: "घी पोड़ी इडली"
    },
    description: {
      en: "Steamed bite-sized rice cakes tossed in fragrant desi ghee and fiery gunpowder spice blend.",
      hi: "शुद्ध देसी घी और तीखी गनपाउडर पोड़ी मसाले में तली हुई गरम इडलियाँ।"
    },
    price: 150,
    isVeg: true,
    isAvailable: true,
    tags: ["Desi Ghee", "Spicy"]
  },
  {
    id: "si-04",
    categoryId: "south-indian",
    name: {
      en: "Chettinad Pepper Chicken Fry",
      hi: "चेट्टीनाड पेपर चिकन फ्राई"
    },
    description: {
      en: "Fiery pan-seared chicken tossed with freshly ground black peppercorns and aromatic southern spices.",
      hi: "ताज़ी पिसी काली मिर्च और पारंपरिक चेट्टीनाड मसालों में भुना हुआ मसालेदार चिकन।"
    },
    price: 290,
    isVeg: false,
    isAvailable: true,
    tags: ["Spicy", "Authentic"]
  },

  // 3. NORTH INDIAN (4 items)
  {
    id: "ni-01",
    categoryId: "north-indian",
    name: {
      en: "Dal Makhani",
      hi: "दाल मखनी"
    },
    description: {
      en: "Black lentils slow-cooked overnight on charcoal embers with butter, rich cream, and plum tomatoes.",
      hi: "धीमी आँच पर मक्खन और ताज़ी क्रीम के साथ पकाई गई गाढ़ी स्वादिष्ट उड़द दाल।"
    },
    price: 240,
    isVeg: true,
    isAvailable: true,
    tags: ["Slow Cooked", "Signature"]
  },
  {
    id: "ni-02",
    categoryId: "north-indian",
    name: {
      en: "Shahi Paneer",
      hi: "शाही पनीर"
    },
    description: {
      en: "Soft cottage cheese batons simmered in a velvety cashew and saffron-infused royal gravy.",
      hi: "काजू और केसर की मखमली शाही ग्रेवी में पकाए गए मुलायम पनीर के टुकड़े।"
    },
    price: 270,
    isVeg: true,
    isAvailable: true,
    tags: ["Rich", "Royal Recipe"]
  },
  {
    id: "ni-03",
    categoryId: "north-indian",
    name: {
      en: "Butter Chicken",
      hi: "बटर चिकन"
    },
    description: {
      en: "Char-grilled chicken simmered in an iconic buttery tomato and fenugreek satin sauce.",
      hi: "कसूरी मेथी और मक्खन वाली मखमली टमाटर ग्रेवी में पकाया गया तंदूरी चिकन।"
    },
    price: 340,
    isVeg: false,
    isAvailable: true,
    tags: ["Best Seller", "Iconic"]
  },
  {
    id: "ni-04",
    categoryId: "north-indian",
    name: {
      en: "Rogan Josh",
      hi: "रोगन जोश"
    },
    description: {
      en: "Traditional Kashmiri slow-braised mutton curry flavored with alkanet root, fennel, and dry ginger.",
      hi: "सौंफ, सोंठ और रतनजोत के विशेष कश्मीरी मसालों में धीमी आँच पर पका मटन करी।"
    },
    price: 390,
    isVeg: false,
    isAvailable: true,
    tags: ["Kashmiri", "Slow Cooked"]
  },

  // 4. MAIN COURSE (3 items)
  {
    id: "mc-01",
    categoryId: "main-course",
    name: {
      en: "Kadhai Paneer",
      hi: "कड़ाही पनीर"
    },
    description: {
      en: "Cottage cheese, bell peppers, and onions tossed in freshly pounded coriander-chili spice blend.",
      hi: "शिमला मिर्च, प्याज और साबुत खड़े मसालों की ग्रेवी में बनी लज़ीज़ कड़ाही पनीर।"
    },
    price: 260,
    isVeg: true,
    isAvailable: true,
    tags: ["Wok Tossed", "Medium Spicy"]
  },
  {
    id: "mc-02",
    categoryId: "main-course",
    name: {
      en: "Chana Pindi",
      hi: "चना पिंडी"
    },
    description: {
      en: "Rawalpindi-style tender chickpeas simmered in dark tea-leaf infused spices and amchur.",
      hi: "अनारदाना और अमचूर के खट्टे-तीखे देसी मसालों में पके पारंपरिक पिंडी छोले।"
    },
    price: 220,
    isVeg: true,
    isAvailable: true,
    tags: ["Tangy", "Traditional"]
  },
  {
    id: "mc-03",
    categoryId: "main-course",
    name: {
      en: "Mutton Rara",
      hi: "मटन रारा"
    },
    description: {
      en: "Rich combination of tender mutton chunks slow-cooked with spiced minced meat gravy.",
      hi: "भुने हुए कीमे और मटन के रसीले टुकड़ों से तैयार की गई गाढ़ी नवाबी करी।"
    },
    price: 410,
    isVeg: false,
    isAvailable: false, // Testing availability indicator (Sold Out)
    tags: ["Chef Special", "Hearty"]
  },

  // 5. RICE AND BIRYANI (3 items)
  {
    id: "rb-01",
    categoryId: "rice-biryani",
    name: {
      en: "Lucknowi Veg Dum Biryani",
      hi: "लखनवी वेज दम बिरयानी"
    },
    description: {
      en: "Long-grain basmati rice layered with garden vegetables, saffron milk, and rose water, sealed in handi.",
      hi: "हांडी में दम देकर पकाई गई ताज़ा सब्जियों, केसर और खुशबूदार बासमती चावल की बिरयानी।"
    },
    price: 250,
    isVeg: true,
    isAvailable: true,
    tags: ["Dum Pukht", "Aromatic"]
  },
  {
    id: "rb-02",
    categoryId: "rice-biryani",
    name: {
      en: "Dum Murgh Biryani",
      hi: "दम मुर्ग बिरयानी"
    },
    description: {
      en: "Fragrant aged basmati rice layered with spiced marinated chicken and fried crisp onions.",
      hi: "खुशबूदार बासमती चावल, मसालेदार चिकन और भूने प्याज़ की परतदार हैदराबादी दम बिरयानी।"
    },
    price: 330,
    isVeg: false,
    isAvailable: true,
    tags: ["Dum Cooked", "Popular"]
  },
  {
    id: "rb-03",
    categoryId: "rice-biryani",
    name: {
      en: "Jeera Rice",
      hi: "जीरा राइस"
    },
    description: {
      en: "Fluffy aged basmati rice tempered with roasted cumin seeds and farm fresh ghee.",
      hi: "शुद्ध देसी घी और भुने हुए साबुत जीरे के तड़के वाले खुशबूदार बासमती चावल।"
    },
    price: 160,
    isVeg: true,
    isAvailable: true,
    tags: ["Basmati", "Desi Ghee"]
  },

  // 6. BEVERAGES (4 items)
  {
    id: "bev-01",
    categoryId: "beverages",
    name: {
      en: "Masala Chai",
      hi: "मसाला चाय"
    },
    description: {
      en: "Freshly brewed Assam CTC tea infused with ginger, cardamom, cloves, and whole milk.",
      hi: "ताज़ा अदरक, हरी इलायची और लौंग के साथ कड़क उबली हुई देसी चाय।"
    },
    price: 60,
    isVeg: true,
    isAvailable: true,
    tags: ["Hot", "Freshly Brewed"]
  },
  {
    id: "bev-02",
    categoryId: "beverages",
    name: {
      en: "Mango Lassi",
      hi: "मैंगो लस्सी"
    },
    description: {
      en: "Thick chilled yogurt blended with sweet Alphonso mango pulp and cardamom dust.",
      hi: "अल्फांसो आम के गूदे और इलायची से बनी गाढ़ी और ठंडी पारंपरिक लस्सी।"
    },
    price: 110,
    isVeg: true,
    isAvailable: true,
    tags: ["Chilled", "Sweet"]
  },
  {
    id: "bev-03",
    categoryId: "beverages",
    name: {
      en: "Filter Coffee",
      hi: "फ़िल्टर कॉफ़ी"
    },
    description: {
      en: "Traditional South Indian chicory-blend decoction frothed with boiling creamy milk in a davarah.",
      hi: "पारंपरिक दक्षिण भारतीय तरीके से तैयार झागदार और सुगंधित फ़िल्टर कॉफ़ी।"
    },
    price: 80,
    isVeg: true,
    isAvailable: true,
    tags: ["Hot", "South Special"]
  },
  {
    id: "bev-04",
    categoryId: "beverages",
    name: {
      en: "Nimbu Shikanji",
      hi: "नींबू शिकंजी"
    },
    description: {
      en: "Spiced roadside lemonade made with fresh lime juice, roasted cumin, black salt, and mint.",
      hi: "ताज़ा नींबू रस, पुदीना, काला नमक और भुने जीरे से बना स्फूर्तिदायक पेय।"
    },
    price: 70,
    isVeg: true,
    isAvailable: true,
    tags: ["Refreshing", "Cold"]
  },

  // 7. DESSERTS (3 items)
  {
    id: "des-01",
    categoryId: "desserts",
    name: {
      en: "Gulab Jamun",
      hi: "गुलाब जामुन"
    },
    description: {
      en: "Golden khoya dumplings steeped in warm saffron and green cardamom scented sugar syrup.",
      hi: "केसर और इलायची की चाशनी में डूबे हुए गरमा-गरम रसीले मावा गुलाब जामुन।"
    },
    price: 120,
    isVeg: true,
    isAvailable: true,
    tags: ["Hot", "Mawa"]
  },
  {
    id: "des-02",
    categoryId: "desserts",
    name: {
      en: "Kesari Rasmalai",
      hi: "केसरी रसमलाई"
    },
    description: {
      en: "Delicate chenna discs soaked in thickened saffron-pistachio clotted milk.",
      hi: "पिस्ता और केसरिया रबड़ी के गाढ़े दूध में भीगे हुए मुलायम छेने के रसगुल्ले।"
    },
    price: 140,
    isVeg: true,
    isAvailable: true,
    tags: ["Chilled", "Kesar Pista"]
  },
  {
    id: "des-03",
    categoryId: "desserts",
    name: {
      en: "Moong Dal Halwa",
      hi: "मूंग दाल हलवा"
    },
    description: {
      en: "Traditional Rajasthani dessert crafted with yellow lentils slow-roasted in desi ghee with almonds.",
      hi: "शुद्ध घी में धीमी आँच पर भूनकर बनाया गया बादाम युक्त पारंपरिक राजस्थानी हलवा।"
    },
    price: 150,
    isVeg: true,
    isAvailable: true,
    tags: ["Desi Ghee", "Winter Special"]
  }
];

// Restaurant Configuration (Checkpoint 2C)
const RESTAURANT_CONFIG = {
  // Explicitly labeled fictional demonstration number (India country code 91 + 10 digits)
  whatsappNumber: "919876543210",
  whatsappNumberFormatted: "+91 98765 43210",
  currencySymbol: "₹",
  cartStorageKey: "spice_street_cart_v1"
};

// UI Localization strings
const UI_STRINGS = {
  en: {
    menuTitle: "Our Menu",
    searchPlaceholder: "Search dishes by name or ingredients...",
    allCategories: "All Items",
    filterAll: "All",
    filterVeg: "Pure Veg",
    filterNonVeg: "Non-Veg",
    available: "Available",
    soldOut: "Sold Out",
    vegBadge: "Veg",
    nonVegBadge: "Non-Veg",
    pricePrefix: "₹",
    noResultsTitle: "No dishes found",
    noResultsSubtitle: "Try searching with different keywords or resetting filters.",
    clearFilters: "Reset Filters",
    itemCountSuffix: "items",
    footerText: "Prices are inclusive of applicable taxes. Freshly prepared to order.",
    // Checkpoint 2C Cart & WhatsApp strings
    addToCart: "Add",
    addedToCart: "Added",
    cartTitle: "Your Cart",
    viewCart: "View Cart",
    emptyCartTitle: "Your cart is empty",
    emptyCartSubtitle: "Explore our menu and add your favorite dishes to the cart.",
    browseMenu: "Browse Menu",
    clearCart: "Clear Cart",
    subtotal: "Subtotal",
    taxesInclusive: "Inclusive of all applicable taxes",
    grandTotal: "Grand Total",
    proceedToWhatsApp: "Order via WhatsApp",
    orderViaWhatsApp: "Order via WhatsApp",
    tablePrompt: "Table / Order Note",
    tablePlaceholder: "Table number or special cooking notes (optional)",
    itemRemoved: "Item removed from cart",
    soldOutWarning: "This item is currently sold out and cannot be added.",
    invalidPhoneError: "Unable to open WhatsApp: The configured restaurant number is invalid."
  },
  hi: {
    menuTitle: "हमारा मेन्यू",
    searchPlaceholder: "व्यंजन का नाम या सामग्री खोजें...",
    allCategories: "सभी व्यंजन",
    filterAll: "सभी",
    filterVeg: "शाकाहारी",
    filterNonVeg: "माँसाहारी",
    available: "उपलब्ध",
    soldOut: "उपलब्ध नहीं",
    vegBadge: "शाकाहारी",
    nonVegBadge: "माँसाहारी",
    pricePrefix: "₹",
    noResultsTitle: "कोई व्यंजन नहीं मिला",
    noResultsSubtitle: "कृपया अन्य शब्दों से खोजें या फ़िल्टर हटाएँ।",
    clearFilters: "फ़िल्टर रीसेट करें",
    itemCountSuffix: "व्यंजन",
    footerText: "सभी कीमतें लागू कर सहित हैं। ताज़ा और स्वादिष्ट तैयारी।",
    // Checkpoint 2C Cart & WhatsApp strings
    addToCart: "जोड़ें",
    addedToCart: "जुड़ा",
    cartTitle: "आपकी थाली (कार्ट)",
    viewCart: "कार्ट देखें",
    emptyCartTitle: "आपकी थाली खाली है",
    emptyCartSubtitle: "हमारा मेन्यू देखें और अपने पसंदीदा व्यंजन थाली में जोड़ें।",
    browseMenu: "मेन्यू देखें",
    clearCart: "थाली खाली करें",
    subtotal: "उप-योग",
    taxesInclusive: "सभी लागू कर शामिल हैं",
    grandTotal: "कुल योग",
    proceedToWhatsApp: "व्हाट्सएप पर ऑर्डर करें",
    orderViaWhatsApp: "व्हाट्सएप द्वारा ऑर्डर भेजें",
    tablePrompt: "टेबल / विशेष निर्देश",
    tablePlaceholder: "टेबल नंबर या कोई विशेष निर्देश (वैकल्पिक)",
    itemRemoved: "व्यंजन थाली से हटा दिया गया",
    soldOutWarning: "यह व्यंजन वर्तमान में उपलब्ध नहीं है।",
    invalidPhoneError: "व्हाट्सएप खोलने में असमर्थ: कॉन्फ़िगर किया गया फ़ोन नंबर अमान्य है।"
  }
};

// Export for Node tests or attach to window for browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    RESTAURANT_INFO,
    RESTAURANT_CONFIG,
    CATEGORIES,
    MENU_ITEMS,
    UI_STRINGS
  };
}

if (typeof window !== "undefined") {
  window.MENU_DATA = {
    RESTAURANT_INFO,
    RESTAURANT_CONFIG,
    CATEGORIES,
    MENU_ITEMS,
    UI_STRINGS
  };
}
