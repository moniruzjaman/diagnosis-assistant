export interface ImagePathogenInfo {
  figureLabel: string;
  pathogenName: string;
  pathogenNameEn: string;
  pathogenNameBn: string;
  problemType: string;
  problemTypeEn: string;
  problemTypeBn: string;
  typeColor: {
    bg: string;
    text: string;
    border: string;
    dot: string;
  };
  hostCrop: string;
  hostCropEn: string;
  hostCropBn: string;
  diagnosticClue: string;
  diagnosticClueEn: string;
  diagnosticClueBn: string;
  page: number;
  fileName: string;
}

// Problem category color mapping
export const PROBLEM_TYPE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Water Mould": { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200", dot: "bg-teal-500" },
  "Bacteria": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200", dot: "bg-purple-500" },
  "Fungus": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", dot: "bg-amber-500" },
  "Virus": { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200", dot: "bg-rose-500" },
  "Insect Pest": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", dot: "bg-emerald-500" },
  "Mite": { bg: "bg-lime-50", text: "text-lime-800", border: "border-lime-200", dot: "bg-lime-500" },
  "Nematode": { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200", dot: "bg-orange-500" },
  "Phytoplasma": { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200", dot: "bg-cyan-500" },
  "Mineral Deficiency": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200", dot: "bg-blue-500" },
  "Abiotic / Chemical": { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200", dot: "bg-slate-500" },
  "General": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" }
};

interface PagePathogenMeta {
  pathogenEn: string;
  pathogenBn: string;
  typeEn: string;
  typeBn: string;
  cropEn: string;
  cropBn: string;
  clueEn: string;
  clueBn: string;
  imgSpecific?: Record<number, {
    pathogenEn?: string;
    pathogenBn?: string;
    typeEn?: string;
    typeBn?: string;
    cropEn?: string;
    cropBn?: string;
    clueEn?: string;
    clueBn?: string;
  }>;
}

// Comprehensive registry indexed by CABI guide page number
export const PAGE_PATHOGEN_CATALOG: Record<number, PagePathogenMeta> = {
  1: {
    pathogenEn: "CABI Plantwise Diagnostic Handbook",
    pathogenBn: "ক্যাবি প্ল্যান্টওয়াইজ রোগ নির্ণয় হ্যান্ডবুক",
    typeEn: "General",
    typeBn: "সাধারণ রেফারেন্স",
    cropEn: "Global Field Crops",
    cropBn: "বিশ্বব্যাপী মাঠ ফসল",
    clueEn: "Field diagnostic key and symptom identification process.",
    clueBn: "মাঠ পর্যায়ে লক্ষণভিত্তিক রোগ ও সমস্যা শনাক্তকরণ পদ্ধতি।"
  },
  2: {
    pathogenEn: "Plantwise Factsheet Knowledge Bank",
    pathogenBn: "প্ল্যান্টওয়াইজ ফ্যাক্টশিট নলেজ ব্যাংক",
    typeEn: "General",
    typeBn: "তথ্য ভাণ্ডার",
    cropEn: "Agricultural Extension",
    cropBn: "কৃষি সম্প্রসারণ",
    clueEn: "Offline agronomy reference repository.",
    clueBn: "অফলাইন কৃষি তথ্য ও সমাধান সংকলন।"
  },
  4: {
    pathogenEn: "CABI International Plant Pathology Library",
    pathogenBn: "ক্যাবি আন্তর্জাতিক উদ্ভিদ রোগতত্ত্ব সংরক্ষণাগার",
    typeEn: "General",
    typeBn: "তথ্য ভাণ্ডার",
    cropEn: "Crop Protection",
    cropBn: "ফসল সুরক্ষা",
    clueEn: "Official diagnostic and research methodology reference.",
    clueBn: "দাপ্তরিক রোগ নির্ণয় ও বৈজ্ঞানিক গবেষণা তথ্য।"
  },
  6: {
    pathogenEn: "Field Diagnostic Process of Elimination",
    pathogenBn: "লক্ষণ বর্জন পদ্ধতিতে রোগ নির্ণয় প্রক্রিয়া",
    typeEn: "General",
    typeBn: "পদ্ধতিগত গাইড",
    cropEn: "Crop Scouting",
    cropBn: "মাঠ পরিদর্শন",
    clueEn: "Systematic elimination from biotic to abiotic stress factors.",
    clueBn: "জৈব ও অজৈব কারণগুলোর ধারাবাহিক যাচাই ও বর্জন পদ্ধতি।"
  },
  15: {
    pathogenEn: "Cashew Leaf Spot (Colletotrichum / Pestalotiopsis)",
    pathogenBn: "কাজুবাদামের পাতার দাগ রোগ (কলিটোট্রিকাম / পেস্টালশিওপসিস)",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত",
    cropEn: "Cashew (Anacardium occidentale)",
    cropBn: "কাজুবাদাম",
    clueEn: "Clearly defined, uniform spots with sharp boundary separating healthy green tissue.",
    clueBn: "সুস্পষ্ট প্রান্তসীমাযুক্ত ও সমান আকারের বাদামী দাগ, যা সুস্থ পাতার অংশ থেকে পরিষ্কারভাবে পৃথক।"
  },
  20: {
    pathogenEn: "Insect & Mite Pest Ready Reckoner",
    pathogenBn: "ক্ষতিকর পোকা ও মাকড় দ্রুত শনাক্তকারী চার্ট",
    typeEn: "Insect Pest",
    typeBn: "পোকা ও মাকড়",
    cropEn: "Horticulture & Field Crops",
    cropBn: "উদ্যান ও মাঠ ফসল",
    clueEn: "Diagnostic silhouettes and morphological scale of major agricultural insect pests.",
    clueBn: "ফসলের প্রধান ক্ষতিকর পোকা ও মাকড়ের আকৃতি ও গঠনগত স্কেল চার্ট।",
    imgSpecific: {
      0: { pathogenEn: "Aphid (Aphis spp. / Sap Sucker)", pathogenBn: "জাব পোকা (এফিড)", cropEn: "Vegetables & Pulses", cropBn: "শাকসবজি ও ডাল" },
      1: { pathogenEn: "Mealybug (Pseudococcidae)", pathogenBn: "মিলিবাগ (সাদা তুলো পোকা)", cropEn: "Fruit trees & Cotton", cropBn: "ফলগাছ ও তুলা" },
      2: { pathogenEn: "Scale Insect (Coccoidea)", pathogenBn: "স্কেল পোকা (খোসা পোকা)", cropEn: "Citrus & Woody Plants", cropBn: "লেবুজাতীয় ও কাষ্ঠল গাছ" },
      3: { pathogenEn: "Psyllid (Jumping Plant Lice)", pathogenBn: "সাইলিড পোকা", cropEn: "Citrus & Potato", cropBn: "লেবু ও আলু" },
      4: { pathogenEn: "Thrips (Frankliniella / Thrips tabaci)", pathogenBn: "থ্রিপস (চুষি পোকা)", cropEn: "Chilli, Onion & Cotton", cropBn: "মরিচ, পেঁয়াজ ও তুলা" },
      5: { pathogenEn: "Plant Bug (Miridae / Hemiptera)", pathogenBn: "উদ্ভিদ ছারপোকা (প্ল্যান্ট বাগ)", cropEn: "Legumes & Cotton", cropBn: "শিম ও ডাল ফসল" },
      6: { pathogenEn: "Brown Plant Hopper (Nilaparvata lugens)", pathogenBn: "বাদামী গাছ ফড়িং (কারেন্ট পোকা)", cropEn: "Rice (Oryza sativa)", cropBn: "ধান" },
      7: { pathogenEn: "Whitefly (Bemisia tabaci)", pathogenBn: "সাদা মাছি (হোয়াইটফ্লাই)", cropEn: "Tomato, Cotton & Brinjal", cropBn: "টমেটো, তুলা ও বেগুন" },
      8: { pathogenEn: "Grasshopper / Locust (Orthoptera)", pathogenBn: "ঘাসফড়িং / পঙ্গপাল", cropEn: "Cereals & Forage", cropBn: "দানাশস্য ও ঘাস" },
      9: { pathogenEn: "Sawfly Larva (Tenthredinidae)", pathogenBn: "করাত মাছি লার্ভা", cropEn: "Mustard & Vegetables", cropBn: "সরিষা ও শাকসবজি" },
      10: { pathogenEn: "Lepidopteran Moth Larva (Caterpillar / Borer)", pathogenBn: "লেদা পোকা / মাজরা পোকা", cropEn: "Cereals & Vegetables", cropBn: "দানাশস্য ও সবজি" },
      11: { pathogenEn: "Beetle Grub (Coleoptera)", pathogenBn: "গুবরে পোকার বাচ্চা (গ্রাব)", cropEn: "Tubers & Roots", cropBn: "আলু ও শিকড় ফসল" },
      12: { pathogenEn: "Fly Maggot (Diptera / Fruit Fly)", pathogenBn: "মাছির কীড়া (ফল মাছি)", cropEn: "Cucurbits & Fruits", cropBn: "লাউ-কুমড়ো ও ফল" },
      13: { pathogenEn: "Spider Mite (Tetranychidae)", pathogenBn: "লাল মাকড় (স্পাইডার মাইট)", cropEn: "Tea, Vegetables & Cotton", cropBn: "চা, শাকসবজি ও তুলা" }
    }
  },
  23: {
    pathogenEn: "Mineral & Micro-Nutrient Deficiencies",
    pathogenBn: "খনিজ ও অণুখাদ্যের অভাবজনিত লক্ষণসমূহ",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Maize, Tomato, Potato & Legumes",
    cropBn: "ভুট্টা, টমেটো, আলু ও শিম",
    clueEn: "Comparative visual matrix of nutritional shortages across four staple crops.",
    clueBn: "চারটি প্রধান ফসলে পুষ্টি উপাদানের অভাবজনিত লক্ষণের তুলনামূলক চিত্র।"
  },
  25: {
    pathogenEn: "Principal Visual Symptoms Matrix",
    pathogenBn: "প্রধান বাহ্যিক লক্ষণসমূহের তালিকা",
    typeEn: "General",
    typeBn: "সাধারণ চার্ট",
    cropEn: "Field Crops",
    cropBn: "মাঠ ফসল",
    clueEn: "CABI visual index matching 10 symptom classes with pathogenic causes.",
    clueBn: "১০টি প্রধান লক্ষণের সাথে রোগজীবাণুর সমন্বিত সূচক তালিকা।"
  },
  26: {
    pathogenEn: "Phytophthora Root & Crown Rot (Water Mould Wilt)",
    pathogenBn: "ফাইটোফথোরা শিকড় পচা ও ঢলে পড়া (ওয়াটার মোল্ড)",
    typeEn: "Water Mould",
    typeBn: "ওয়াটার মোল্ড (ছত্রাকসদৃশ)",
    cropEn: "Tomato, Potato, Pepper & Bean",
    cropBn: "টমেটো, আলু, মরিচ ও শিম",
    clueEn: "Water mould root rot causing sudden wilting; vascular xylem destruction with rapid foliage collapse.",
    clueBn: "শিকড়ে ওয়াটার মোল্ড আক্রমণে হঠাৎ করে গাছ ঢলে পড়া; কাণ্ডের নিম্নভাগে পানিভেজা দাগ।"
  },
  27: {
    pathogenEn: "Ralstonia solanacearum (Bacterial Wilt)",
    pathogenBn: "রালস্টোনিয়া সোলানাসিয়ারাম (ব্যাকটেরিয়াজনিত ঢলে পড়া)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়াজনিত",
    cropEn: "Solanaceae (Tomato, Potato, Eggplant)",
    cropBn: "টমেটো, আলু ও বেগুন",
    clueEn: "Rapid daytime wilting of entire plant while leaves remain green; darkened vascular bundles.",
    clueBn: "পাতা সবুজ অবস্থাতেই হঠাৎ পুরো গাছ ঢলে পড়া; কাণ্ড কাটলে পরিবহন নালীতে বাদামী বলয় দেখা যায়।"
  },
  28: {
    pathogenEn: "Bacterial Streaming Diagnostic Test (Ralstonia)",
    pathogenBn: "ব্যাকটেরিয়াল স্ট্রিমিং পরীক্ষা (রালস্টোনিয়া)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়াজনিত",
    cropEn: "Tomato / Potato Stem Cut",
    cropBn: "টমেটো / আলুর কাণ্ডের নমুনা",
    clueEn: "Milky white bacterial slime ooze streaming into clear water from cut vascular bundle.",
    clueBn: "কাটা কাণ্ড পরিষ্কার পানিতে ধরলে কাটার মুখ থেকে দুধের মতো সাদা ব্যাকটেরিয়া নির্গত হওয়া।"
  },
  29: {
    pathogenEn: "Tomato Spotted Wilt Virus (TSWV)",
    pathogenBn: "টমেটো স্পটেড উইল্ট ভাইরাস (টিএসডব্লিউভি)",
    typeEn: "Virus",
    typeBn: "ভাইরাসজনিত",
    cropEn: "Tomato & Pineapple",
    cropBn: "টমেটো ও আনারস",
    clueEn: "Bronzing and terminal shoot wilting caused by viral vascular necrosis, vectored by thrips.",
    clueBn: "থ্রিপস পোকা বাহিত ভাইরাস সংক্রমণে কাণ্ড ও ডগার শিরা মরে গাছ শুকিয়ে ঢলে পড়া।"
  },
  30: {
    pathogenEn: "Stem Borer Larval Tunneling (Insect Wilt)",
    pathogenBn: "মাজরা পোকার কীড়ার কাণ্ড ছিদ্রকরণ (পোকাঘটিত ঢলে পড়া)",
    typeEn: "Insect Pest",
    typeBn: "পোকার আক্রমণ",
    cropEn: "Maize, Rice, Sugarcane & Solanaceae",
    cropBn: "ভুট্টা, ধান, আখ ও বেগুন",
    clueEn: "Larval tunnel boring inside stem severing vascular flow, resulting in dead heart or wilting.",
    clueBn: "কাণ্ডের ভেতরে পোকার লার্ভা গর্ত করে নালী কেটে দেওয়ায় গাছের আগা মরে যাওয়া বা ঢলে পড়া।"
  },
  31: {
    pathogenEn: "Copper Deficiency Physiological Wilt",
    pathogenBn: "তামা (কপার) এর অভাবজনিত কৃত্রিম নেতিয়ে পড়া",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Cereals & Young Fruit Trees",
    cropBn: "দানাশস্য ও ফলগাছ",
    clueEn: "Young leaf tips limp and bleached white, curling downward due to impaired lignin synthesis.",
    clueBn: "কচি পাতার ডগা সাদা হয়ে নুইয়ে পড়া, কোষের দৃঢ়তা নষ্ট হওয়ায় গাছ দুর্বল হয়ে পড়ে।"
  },
  32: {
    pathogenEn: "Foliar Leaf Spot Syndrome Overview",
    pathogenBn: "পাতার দাগ রোগের সাধারণ লক্ষণ ও ধরণ",
    typeEn: "Fungus",
    typeBn: "ছত্রাক / ব্যাকটেরিয়া",
    cropEn: "Field Crops & Fruit Orchards",
    cropBn: "মাঠ ফসল ও ফলের বাগান",
    clueEn: "Diverse necrotic spots developing distinct fungal borders on exposed foliar surfaces.",
    clueBn: "পাতার উপরিভাগে নানা ধরনের বাদামী ও কালো দাগ সৃষ্টি হওয়া।"
  },
  33: {
    pathogenEn: "Fungal Pycnidia & Spore Fruiting Bodies",
    pathogenBn: "ছত্রাকের পিকনিডিয়া ও রেনু উৎপাদক ফ্রুটিং বডি",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত লক্ষণ",
    cropEn: "Legumes, Vegetables & Cereals",
    cropBn: "ডাল, শাকসবজি ও দানাশস্য",
    clueEn: "Concentric rings and tiny black pinpoint fruiting bodies (pycnidia / perithecia) inside necrotic lesions.",
    clueBn: "মৃত দাগের ভেতরে সুক্ষ্ম পিন-হেডের মতো কালো পিকনিডিয়া ফ্রুটিং বডির উপস্থিতি (লক্ষণ নয়, প্রত্যক্ষ নিদর্শন)।"
  },
  34: {
    pathogenEn: "Natural Leaf Glands (Non-Pathogenic Mimics)",
    pathogenBn: "পাতার স্বাভাবিক গ্রন্থি (যা দেখে ভুলবশত রোগ ভাবা হতে পারে)",
    typeEn: "Abiotic / Chemical",
    typeBn: "প্রাকৃতিক শারীরিক গঠন",
    cropEn: "Tropical Shrubs & Legumes",
    cropBn: "গুল্ম ও ডালজাতীয় গাছ",
    clueEn: "Symmetric nectar glands and peltate hairs along veins that mimic fungal fruiting bodies.",
    clueBn: "শিরার পাশে সুষমভাবে সাজানো স্বাভাবিক গ্রন্থি বা রোম, যা রোগ নয় বরং উদ্ভিদের স্বাভাবিক অঙ্গ।"
  },
  35: {
    pathogenEn: "Phytophthora infestans (Late Blight Water Mould)",
    pathogenBn: "ফাইটোফথোরা ইনফেস্ট্যান্স (আলু ও টমেটোর লেট ব্লাইট)",
    typeEn: "Water Mould",
    typeBn: "ওয়াটার মোল্ড",
    cropEn: "Potato & Tomato",
    cropBn: "আলু ও টমেটো",
    clueEn: "Rapidly expanding water-soaked lesions with pale green chlorotic halos and white sporulation underneath.",
    clueBn: "দ্রুত বিস্তার লাভকারী ভেজা বাদামী দাগ এবং আর্দ্র অবস্থায় পাতার নিচে সাদা তুলার মতো ছত্রাকজাল।"
  },
  36: {
    pathogenEn: "Xanthomonas & Pseudomonas (Bacterial Leaf Spot)",
    pathogenBn: "জ্যান্থোমোনাস ও সিউডোমোনাস (ব্যাকটেরিয়াজনিত পাতার দাগ)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়াজনিত",
    cropEn: "Pepper, Tomato, Brassicas & Beans",
    cropBn: "মরিচ, টমেটো, বাঁধাকপি ও শিম",
    clueEn: "Small angular water-soaked spots bounded by leaf veins, developing yellow halo margins.",
    clueBn: "পাতার শিরা দ্বারা সীমাবদ্ধ কোণাকৃতির পানিভেজা দাগ এবং চারদিকে সুস্পষ্ট হলুদ বলয়।"
  },
  37: {
    pathogenEn: "Aphelenchoides foliar nematodes / Phytoplasma",
    pathogenBn: "পাতার কৃমি (নেমাটোড) ও ফাইটোোপ্লাজমার দাগ",
    typeEn: "Nematode",
    typeBn: "নেমাটোড / অণুজীব",
    cropEn: "Strawberries, Rice & Ornamentals",
    cropBn: "স্ট্রবেরি, ধান ও ফুলগাছ",
    clueEn: "Angular brown wedges delineated by major leaf veins resulting from foliar nematode movement.",
    clueBn: "পাতার প্রধান শিরার ভেতরে আটকে থাকা কোণাকৃতি বাদামী দাগ, যা নেমাটোডের সংক্রমণের বৈশিষ্ট্য।"
  },
  38: {
    pathogenEn: "Potassium & Magnesium Deficiency Necrotic Spots",
    pathogenBn: "পটাসিয়াম ও ম্যাগনেসিয়ামের অভাবে সৃষ্ট পাতার নেক্রোটিক দাগ",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Maize, Tomato & Cotton",
    cropBn: "ভুট্টা, টমেটো ও তুলা",
    clueEn: "Non-pathogenic necrotic flecks between veins on older mature leaves without fungal fruiting bodies.",
    clueBn: "পুরানো পাতায় শিরার মধ্যবর্তী অংশে বাদামী পোড়া দাগ সৃষ্টি হওয়া, যাতে কোনো ছত্রাকের জীবাণু থাকে না।"
  },
  39: {
    pathogenEn: "Contact Herbicide Drift & Chemical Scorch Spots",
    pathogenBn: "আগাছানাশক ও রাসায়নিক স্প্রে জনিত পাতার পোড়া দাগ",
    typeEn: "Abiotic / Chemical",
    typeBn: "অজৈব / রাসায়নিক ক্ষতি",
    cropEn: "Vegetables & Broadleaf Crops",
    cropBn: "শাকসবজি ও চওড়া পাতার ফসল",
    clueEn: "Random circular chemical scorch droplet spots with sharp bleached centers and no pathogen rings.",
    clueBn: "রাসায়নিক স্প্রের ফোঁটা পড়ে পাতায় এলোমেলো পোড়া দাগ, কোনো নির্দিষ্ট জৈব বিস্তার থাকে না।"
  },
  40: {
    pathogenEn: "Witches' Broom Syndrome (Apical Dominance Loss)",
    pathogenBn: "উইচেস ব্রুম বা ঝাঁটার মতো ডালপালা গজা রোগ",
    typeEn: "Fungus",
    typeBn: "ছত্রাক / জৈব কারণ",
    cropEn: "Cocoa, Bamboo & Woody Crops",
    cropBn: "কোকো, বাঁশ ও কাষ্ঠল গাছ",
    clueEn: "Proliferation of dense, broom-like competing shoots from a single growth node.",
    clueBn: "একটি পর্ব থেকে অতিরিক্ত ও ঘন ঝাঁটার মতো অপ্রকৃতিস্থ ডালপালার গুচ্ছ গজানো।"
  },
  41: {
    pathogenEn: "Eriophyid Gall Mite Witches' Broom",
    pathogenBn: "এরিওফাইডি মাকড় ঘটিত উইচেস ব্রুম",
    typeEn: "Mite",
    typeBn: "মাকড়ের আক্রমণ",
    cropEn: "Mango, Pigeon Pea & Shrubs",
    cropBn: "আম, অড়হর ও গুল্ম",
    clueEn: "Microscopic eriophyid mite toxins triggering excessive lateral bud sprouting and clustering.",
    clueBn: "সুক্ষ্ম মাকড়ের লালার বিষক্রিয়ায় কাণ্ডের চোখ থেকে অসংখ্য অতিরিক্ত ডাল ও পাতার গুচ্ছ তৈরি হওয়া।"
  },
  42: {
    pathogenEn: "Bacterial & Fungal Stem Canker (Xanthomonas / Nectria)",
    pathogenBn: "ব্যাকটেরিয়া ও ছত্রাকজনিত কাণ্ডের ক্ষত বা ক্যাঙ্কার",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়া / ছত্রাক",
    cropEn: "Citrus, Fruit Trees & Tomatoes",
    cropBn: "লেবুজাতীয়, ফলগাছ ও টমেটো",
    clueEn: "Sunken, callous-margined open wounds with cracked cortical bark on woody or semi-woody stems.",
    clueBn: "কাণ্ডের ছাল ফেটে সৃষ্টি হওয়া দীর্ঘস্থায়ী ক্ষত ও শক্ত হয়ে ফুলে ওঠা প্রান্তভাগ।"
  },
  43: {
    pathogenEn: "Cassava & Tobacco Mosaic Virus (CMD / TMV)",
    pathogenBn: "কাসাভা ও তামাকের মোজাইক ভাইরাস (সিএমভি / টিএমভি)",
    typeEn: "Virus",
    typeBn: "ভাইরাসজনিত",
    cropEn: "Cassava, Tobacco, Tomato & Cucurbits",
    cropBn: "কাসাভা, তামাক, টমেটো ও শসা-কুমড়ো",
    clueEn: "Irregular patchwork of dark green islands contrasting with pale yellow chlorotic lamina.",
    clueBn: "পাতায় গাঢ় সবুজ ও হালকা হলুদ রঙের ছোপ ছোপ অনিয়মিত বুটিদার মোজাইক নকশা।"
  },
  44: {
    pathogenEn: "Sap-Feeding Piercing Insect Stippling (Mites / Thrips)",
    pathogenBn: "রসচোষক পোকা ও মাকড়ের খোঁচানো দাগ (যা মোজাইক নয়)",
    typeEn: "Insect Pest",
    typeBn: "পোকার আক্রমণ",
    cropEn: "Beans, Brinjal & Cotton",
    cropBn: "শিম, বেগুন ও তুলা",
    clueEn: "Minute pinpoint chlorotic speckling caused by cell emptying under stylet feeding; web strands visible.",
    clueBn: "পাতার নিচে পোকা বা মাকড়ের রস চোষার কারণে অসংখ্য সুক্ষ্ম হলুদ বিন্দুর সৃষ্টি।"
  },
  46: {
    pathogenEn: "Insect Vector-Induced Foliar Yellowing (Whitefly / Jassids)",
    pathogenBn: "চোষক পোকার বিষাক্ত লালা ও রস শোষণে পাতা হলুদ হওয়া",
    typeEn: "Insect Pest",
    typeBn: "পোকার আক্রমণ",
    cropEn: "Cotton, Okra & Cucurbits",
    cropBn: "তুলা, ঢ্যাঁড়শ ও লাউ-কুমড়ো",
    clueEn: "Chlorosis spreading along veins with sooty mould development due to secreted honeydew.",
    clueBn: "রস শোষণের ফলে পাতা ফ্যাকাশে হলুদ হয়ে যাওয়া এবং পোকার মিষ্টি বর্জ্যে কালো ছত্রাক জমা।"
  },
  47: {
    pathogenEn: "Nitrogen & Potassium Deficiency Chlorosis",
    pathogenBn: "নাইট্রোজেন ও পটাসিয়ামের ঘাটতিজনিত পাতা হলুদ হওয়া",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Maize, Rice & Cereals",
    cropBn: "ভুট্টা, ধান ও দানাশস্য",
    clueEn: "V-shaped yellowing starting from tip of lowest older leaves progressing toward stalk.",
    clueBn: "পুরানো নিচের পাতার ডগা থেকে মাঝের শিরা বরাবর ইংরেজি V আকৃতিতে হলুদ হয়ে শুকিয়ে যাওয়া।"
  },
  48: {
    pathogenEn: "Magnesium Deficiency Interveinal Chlorosis",
    pathogenBn: "ম্যাগনেসিয়ামের অভাবে শিরার মধ্যবর্তী অংশ হলুদ হওয়া",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Tomato, Brassicas, Maize & Fruit Trees",
    cropBn: "টমেটো, বাঁধাকপি, ভুট্টা ও ফলগাছ",
    clueEn: "Striking interveinal yellowing while primary veins remain dark green on mature lower leaves.",
    clueBn: "পাতার প্রধান শিরাগুলো গাঢ় সবুজ থাকে কিন্তু শিরার মধ্যবর্তী অংশ উজ্জ্বল হলুদ বা লালচে হয়ে যায়।"
  },
  49: {
    pathogenEn: "Sulfur & Iron Deficiency Chlorosis in Young Foliage",
    pathogenBn: "সালফার ও আয়রনের অভাবে কচি পাতা হলুদ হওয়া",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Rice, Groundnut & Vegetables",
    cropBn: "ধান, চিনাবাদাম ও শাকসবজি",
    clueEn: "Chlorosis starting first on newly emerging top leaves due to nutrient immobility inside the plant.",
    clueBn: "গাছের একদম কচি অগ্রভাগের পাতাগুলো ফ্যাকাশে সাদাটে-হলুদ হয়ে যাওয়া।"
  },
  50: {
    pathogenEn: "Waterlogging & Salinity-Induced Leaf Yellowing",
    pathogenBn: "জলাবদ্ধতা ও লবণাক্ততার কারণে পাতা হলুদ হওয়া",
    typeEn: "Abiotic / Chemical",
    typeBn: "অজৈব পরিবেশগত চাপ",
    cropEn: "Legumes, Papaya & Field Crops",
    cropBn: "ডাল, পেঁপে ও মাঠ ফসল",
    clueEn: "Uniform drooping and yellowing across the entire plant caused by root anoxia in water-saturated soil.",
    clueBn: "শিকড়ে বাতাসের অভাব হওয়ায় পুরো গাছের পাতা একসাথে ফ্যাকাশে হলুদ হয়ে নুইয়ে পড়া।"
  },
  51: {
    pathogenEn: "Morphological Leaf Distortion Overview",
    pathogenBn: "পাতার আকৃতি বিকৃতির সাধারণ ধরণসমূহ",
    typeEn: "Virus",
    typeBn: "ভাইরাস / মাকড়",
    cropEn: "Horticultural Crops",
    cropBn: "উদ্যান ফসল",
    clueEn: "Asymmetric lamina bubbling, curling, and puckering from viral or hormonal disruptors.",
    clueBn: "পাতার স্বাভাবিক গঠন নষ্ট হয়ে কুঁচকে যাওয়া বা ফুলকার মতো ফুলে ওঠা।"
  },
  52: {
    pathogenEn: "Tomato Leaf Curl Begomovirus (ToLCV)",
    pathogenBn: "টমেটো পাতার কুঁকড়ানো রোগ (টমেটো লিফ কার্ল ভাইরাস)",
    typeEn: "Virus",
    typeBn: "ভাইরাসজনিত",
    cropEn: "Tomato (Solanum lycopersicum)",
    cropBn: "টমেটো",
    clueEn: "Severe upward leaf cupping, thick leathery puckering, and extreme plant stunting vectored by whiteflies.",
    clueBn: "পাতা চামড়ার মতো মোটা হয়ে উপরের দিকে কুঁচকে নৌকার মতো হওয়া এবং গাছের বৃদ্ধি থমকে যাওয়া।"
  },
  53: {
    pathogenEn: "Aphid & Broad Mite Toxin Leaf Curling",
    pathogenBn: "জাব পোকা ও মাকড়ের লালার বিষে পাতা কুঁচকানো",
    typeEn: "Insect Pest",
    typeBn: "পোকা ও মাকড়",
    cropEn: "Chilli, Pepper & Citrus",
    cropBn: "মরিচ ও লেবুজাতীয় ফসল",
    clueEn: "Downward curling of tender margins with shiny bronzed lower surface from broad mite feeding.",
    clueBn: "পাতার কিনারা নিচের দিকে কুঁকড়ে উল্টানো নৌকার মতো হওয়া এবং পাতার নিচের পিঠ চকচকে তামাটে হওয়া।"
  },
  54: {
    pathogenEn: "Calcium & Boron Deficiency Terminal Leaf Distortion",
    pathogenBn: "ক্যালসিয়াম ও বোরনের ঘাটতিতে পাতার বিকৃতি",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Tomato, Brassica & Cucurbits",
    cropBn: "টমেটো, বাঁধাকপি ও লাউ-কুমড়ো",
    clueEn: "Hooked and distorted growing tips with necrotic margins due to failed cell wall integrity.",
    clueBn: "গাছের কচি ডগা ও পাতার প্রান্তভাগ বাঁকা ও কুঁকড়ে যাওয়া এবং অগ্রমুকুল শুকিয়ে নষ্ট হওয়া।"
  },
  55: {
    pathogenEn: "Little Leaf Symptomology Overview",
    pathogenBn: "ক্ষুদ্রাকৃতির পাতা (লিটল লিফ) রোগের সাধারণ বৈশিষ্ট্য",
    typeEn: "Phytoplasma",
    typeBn: "ফাইটোোপ্লাজমা",
    cropEn: "Brinjal & Fruit Trees",
    cropBn: "বেগুন ও ফলগাছ",
    clueEn: "Severe reduction in lamina surface area with closely packed nodes and bushy habit.",
    clueBn: "পাতার আকার স্বাভাবিকের চেয়ে অতিমাত্রায় ছোট হয়ে যাওয়া এবং গাছ ঝোপালো রূপ নেওয়া।"
  },
  56: {
    pathogenEn: "Brinjal Little Leaf Phytoplasma",
    pathogenBn: "বেগুনের লিটল লিফ রোগ (ফাইটোোপ্লাজমা)",
    typeEn: "Phytoplasma",
    typeBn: "ফাইটোোপ্লাজমাজনিত",
    cropEn: "Eggplant / Brinjal (Solanum melongena)",
    cropBn: "বেগুন",
    clueEn: "Phytoplasma vectoring leafhopper causes severe leaf miniaturization and complete sterility of flowers.",
    clueBn: "পাতাফড়িং বাহিত ফাইটোোপ্লাজমায় পাতা অতি ক্ষুদ্রাকৃতির হয়ে যায় এবং গাছে কোনো ফুল বা ফল ধরে না।"
  },
  57: {
    pathogenEn: "Plant Gall & Swelling Morphology",
    pathogenBn: "উদ্ভিদে টিউমার বা গল (গাঁট) সৃষ্টির কারণসমূহ",
    typeEn: "Nematode",
    typeBn: "নেমাটোড / ব্যাক্টেরিয়া",
    cropEn: "Crops & Trees",
    cropBn: "মাঠ ফসল ও বৃক্ষ",
    clueEn: "Hypertrophy of plant tissues resulting in tumorous swelling induced by nematodes or insects.",
    clueBn: "জীবাণু বা কীটের উদ্দীপনায় উদ্ভিদের কোষে অস্বাভাবিক বৃদ্ধি ঘটে টিউমারের মতো ফোলা অংশ সৃষ্টি হওয়া।"
  },
  58: {
    pathogenEn: "Meloidogyne spp. (Root-Knot Nematode Galls)",
    pathogenBn: "রুট-নট নেমাটোড বা শিকড়ে গাঁট সৃষ্টিকারী কৃমি",
    typeEn: "Nematode",
    typeBn: "নেমাটোড (কৃমিজনিত)",
    cropEn: "Tomato, Brinjal, Banana & Carrot",
    cropBn: "টমেটো, বেগুন, কলা ও গাজর",
    clueEn: "Distinct swollen spherical galls on root system impairing nutrient and water uptake.",
    clueBn: "শিকড়ে অসংখ্য ক্ষুদ্র ক্ষুদ্র গাঁট বা টিউমার সৃষ্টি হওয়া, যার ফলে গাছ পর্যাপ্ত পানি ও খাদ্য নিতে পারে না।"
  },
  59: {
    pathogenEn: "Insect & Mite Foliar Galls (Gall Wasps / Aphids)",
    pathogenBn: "পোকা ও মাকড় সৃষ্ট পাতার ফোস্কা গল",
    typeEn: "Insect Pest",
    typeBn: "পোকা ও মাকড়",
    cropEn: "Mango, Syzygium & Woody Trees",
    cropBn: "আম, জাম ও কাষ্ঠল গাছ",
    clueEn: "Pouch and horn galls forming on foliar surface housing developing insect or mite nymphs.",
    clueBn: "পাতার উপরিভাগে শিং বা থলির মতো ফোলা অংশ তৈরি হওয়া যার ভেতরে পোকার ছানা বাস করে।"
  },
  60: {
    pathogenEn: "Blight & Foliar Necrosis Overview",
    pathogenBn: "ব্লাইট বা দ্রুত ঝলসে যাওয়ার সাধারণ রূপরেখা",
    typeEn: "Fungus",
    typeBn: "ছত্রাক / ব্যাকটেরিয়া",
    cropEn: "Cereals & Vegetables",
    cropBn: "দানাশস্য ও শাকসবজি",
    clueEn: "Rapid, extensive death of vegetative leaves, shoots, and blossoms turning brown and brittle.",
    clueBn: "পাতা, ডাল ও ফুল দ্রুত ঝলসে গিয়ে বাদামী হয়ে মরে শুকিয়ে যাওয়া।"
  },
  61: {
    pathogenEn: "Xanthomonas oryzae (Bacterial Leaf Blight)",
    pathogenBn: "জ্যান্থোমোনাস ওরাইজি (ধানের ব্যাকটেরিয়াজনিত পাতা পোড়া / ব্লাইট)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়াজনিত",
    cropEn: "Rice (Oryza sativa)",
    cropBn: "ধান",
    clueEn: "Wavy yellowish-orange necrotic lesions advancing from leaf tip along margins with milky bacterial beads.",
    clueBn: "পাতার ডগা থেকে শুরু হয়ে ঢেউ খেলানো হলুদ-সাদাটে ব্লাইটের দাগ দুই পাশ দিয়ে নিচের দিকে নেমে আসা।"
  },
  62: {
    pathogenEn: "Pratylenchus spp. (Root Lesion Nematodes)",
    pathogenBn: "রুট লেসন নেমাটোড (শিকড়ের ক্ষতের কৃমি)",
    typeEn: "Nematode",
    typeBn: "নেমাটোড (কৃমিজনিত)",
    cropEn: "Banana, Coffee, Maize & Cereals",
    cropBn: "কলা, কফি, ভুট্টা ও দানাশস্য",
    clueEn: "Reddish-brown necrotic tunnels and decay throughout feeder roots with secondary fungal rot.",
    clueBn: "শিকড়ে লালচে-বাদামী ক্ষতের দাগ এবং পচন সৃষ্টি হয়ে ধীরে ধীরে শিকড় সম্পূর্ণ নষ্ট হয়ে যাওয়া।"
  },
  93: {
    pathogenEn: "Vascular Water Stress & Seedling Wilt",
    pathogenBn: "পানির তীব্র অভাব ও চারা গাছের ঢলে পড়া",
    typeEn: "Abiotic / Chemical",
    typeBn: "অজৈব / পানির অভাব",
    cropEn: "Bean & Seedling Crops",
    cropBn: "শিম ও কচি চারাগাছ",
    clueEn: "Flaccid drooping of young succulent stems and leaves due to severed water column.",
    clueBn: "পর্যাপ্ত পানির অভাবে কচি কাণ্ড ও পাতার কোষের রসস্ফীতি নষ্ট হয়ে নুইয়ে পড়া।"
  },
  94: {
    pathogenEn: "General Foliar Chlorosis & Nitrogen Senescence",
    pathogenBn: "সাধারণ ক্লোরোসিস ও নাইট্রোজেনের অভাবে পাতা হলুদ হওয়া",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Field Crops",
    cropBn: "মাঠ ফসল",
    clueEn: "Uniform loss of chlorophyll pigment resulting in pale yellow foliage across leaf blades.",
    clueBn: "ক্লোরোফিল বিনষ্ট হয়ে পাতা সম্পূর্ণভাবে ফ্যাকাশে হলুদ বর্ণ ধারণ করা।"
  },
  95: {
    pathogenEn: "Phosphorus Deficiency Anthocyanin Purpling",
    pathogenBn: "ফসফরাসের অভাবে পাতায় বেগুনি ও লালচে অস্বাভাবিক রঙ",
    typeEn: "Mineral Deficiency",
    typeBn: "পুষ্টি উপাদানের অভাব",
    cropEn: "Maize, Tomato & Brassicas",
    cropBn: "ভুট্টা, টমেটো ও বাঁধাকপি",
    clueEn: "Accumulation of dark purple or reddish anthocyanin pigments on leaf underside and stems.",
    clueBn: "ফসফরাস সংকটে পাতায় অ্যান্থোসায়ানিন জমে পাতার নিচে ও শিরায় গাঢ় বেগুনি রঙ ধারণ করা।"
  },
  96: {
    pathogenEn: "Physiological & Viral Plant Stunting",
    pathogenBn: "শারীরবৃত্তীয় ও ভাইরাসজনিত গাছ খর্বাকৃতি হওয়া",
    typeEn: "Virus",
    typeBn: "ভাইরাস / অপুষ্টি",
    cropEn: "Cereals & Vegetables",
    cropBn: "দানাশস্য ও শাকসবজি",
    clueEn: "Dwarfed vegetative habit with compressed internodes while maintaining normal developmental stages.",
    clueBn: "গাছের স্বাভাবিক বয়স বাড়লেও উচ্চতা ও শাখা-প্রশাখা অস্বাভাবিক খর্বাকৃতি থাকা।"
  },
  97: {
    pathogenEn: "Botryosphaeria / Colletotrichum Shoot Dieback",
    pathogenBn: "বট্রিওসফেরিয়ার ডাইব্যাক (ডগা মরা রোগ)",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত",
    cropEn: "Avocado, Citrus & Mango",
    cropBn: "অ্যাভোকাডো, লেবু ও আম",
    clueEn: "Necrosis initiating strictly at shoot tip and progressing downward toward mature wood.",
    clueBn: "ডাল বা গাছের একদম শীর্ষভাগ থেকে শুকিয়ে নিচের কাষ্ঠল অংশের দিকে মরে আসা।"
  },
  98: {
    pathogenEn: "Banana Streak Badnavirus & Cereal Leaf Streaks",
    pathogenBn: "কলার স্ট্রিক ভাইরাস ও দানাদার ফসলের রেখা রোগ",
    typeEn: "Virus",
    typeBn: "ভাইরাসজনিত",
    cropEn: "Banana (Musa) & Grasses",
    cropBn: "কলা ও ঘাসজাতীয় ফসল",
    clueEn: "Parallel linear chlorotic and necrotic streaks guided by parallel vascular leaf veins.",
    clueBn: "পাতার সমান্তরাল শিরা বরাবর হলুদ ও বাদামী লম্বাটে দাগ বা রেখার সৃষ্টি।"
  },
  99: {
    pathogenEn: "Cassava Brown Leaf Spot (Cercospora henningsii)",
    pathogenBn: "কাসাভার বাদামী পাতার দাগ (সারকোস্পোরা)",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত",
    cropEn: "Cassava (Manihot esculenta)",
    cropBn: "কাসাভা (শিমুল আলু)",
    clueEn: "Well-demarcated circular brown spots contrasting sharply against bright green cassava leaves.",
    clueBn: "গাঢ় সবুজ কাসাভার পাতার ওপর সুস্পষ্ট গোলাকার বাদামী দাগের স্পষ্ট বৈসাদৃশ্য।"
  },
  100: {
    pathogenEn: "Uromyces appendiculatus (Common Bean Rust Pustules)",
    pathogenBn: "ইউরোমাইসিস (শিমের মরিচা বা রাস্ট রোগ)",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত",
    cropEn: "Common Bean & Legumes",
    cropBn: "শিম ও ডাল ফসল",
    clueEn: "Elevated powdery brown-red urediniospore pustules rupturing epidermis surrounded by yellow halos.",
    clueBn: "পাতার ত্বক ফেটে বের হওয়া লালচে-বাদামী গুঁড়ো পাউডারের মতো উরেডিনিওস্পোর পাস্টুলস।"
  },
  101: {
    pathogenEn: "Caterpillar & Beetle Foliar Chewing Damage",
    pathogenBn: "লেদা পোকা ও গুবরে পোকার পাতা চিবিয়ে খাওয়ার ক্ষত",
    typeEn: "Insect Pest",
    typeBn: "পোকার ক্ষতি",
    cropEn: "Vegetables, Pulses & Maize",
    cropBn: "শাকসবজি, ডাল ও ভুট্টা",
    clueEn: "Serrated missing leaf margins and irregular holes accompanied by dark fecal frass pellets.",
    clueBn: "পাতার অংশবিশেষ ও কিনারা দাঁতের মতো খুবলে খাওয়া এবং পাশে পোকার মল (ফ্রাস) থাকা।"
  },
  102: {
    pathogenEn: "Rugose Foliar Puckering & Blistering (Taphrina / Virus)",
    pathogenBn: "পাতার ফোস্কা ও অমসৃণ কুঁচকানো (ট্যাফরিনা / ভাইরাস)",
    typeEn: "Fungus",
    typeBn: "ছত্রাক / ভাইরাস",
    cropEn: "Peach, Pepper & Tomato",
    cropBn: "পিচ ফল, মরিচ ও টমেটো",
    clueEn: "Severe lamina puckering and thickening preventing the leaf from lying flat on a plane.",
    clueBn: "পাতার টিস্যুর অনিয়মিত স্ফীতির কারণে পাতা অসমান ও ফোস্কার মতো ফুলে থাকা।"
  },
  103: {
    pathogenEn: "Mite & Growth Regulator Distortion",
    pathogenBn: "মাকড় ও হরমোন বিষক্রিয়াজনিত অঙ্গ বিকৃতি",
    typeEn: "Mite",
    typeBn: "মাকড় / হরমোন বিষক্রিয়া",
    cropEn: "Horticulture & Vegetables",
    cropBn: "উদ্যান ও শাকসবজি",
    clueEn: "Gross morphological twisting and strapping of leaves and young growing fruitlets.",
    clueBn: "পাতা ও কচি ফল অদ্ভুতভাবে দুমড়ে-মুচড়ে ও ফিতার মতো চিকন হয়ে বিকৃত হয়ে যাওয়া।"
  },
  104: {
    pathogenEn: "Phytoplasma Stunt & Little Leaf Clustering",
    pathogenBn: "ফাইটোোপ্লাজমা জনিত ক্ষুদ্রাকৃতির পাতার গুচ্ছ",
    typeEn: "Phytoplasma",
    typeBn: "ফাইটোোপ্লাজমা",
    cropEn: "Mulberry, Brinjal & Weeds",
    cropBn: "তুঁত, বেগুন ও আগাছা",
    clueEn: "Extremely stunted miniature leaves clustered densely without typical necrosis.",
    clueBn: "কোনো পচনশীল দাগ ছাড়াই অত্যন্ত ক্ষুদ্র পাতার নিবিড় ঘন গুচ্ছ।"
  },
  105: {
    pathogenEn: "Cassava Mosaic Geminivirus (CMD)",
    pathogenBn: "কাসাভা মোজাইক ভাইরাস (সিএমডি)",
    typeEn: "Virus",
    typeBn: "ভাইরাসজনিত",
    cropEn: "Cassava (Manihot esculenta)",
    cropBn: "কাসাভা",
    clueEn: "Bold yellow-green patchwork mosaic accompanied by distorted asymmetric lobes.",
    clueBn: "উজ্জ্বল হলুদ ও সবুজ রঙের বুটিদার মোজাইক এবং পাতার ফলক অসমভাবে বাঁকা হওয়া।"
  },
  106: {
    pathogenEn: "Abiotic Marginal Leaf Edge Scorch (Potassium / Drought)",
    pathogenBn: "অজৈব কারণে পাতার কিনারা পুড়ে যাওয়া (পটাসিয়াম ঘাটতি / খরা)",
    typeEn: "Abiotic / Chemical",
    typeBn: "অজৈব / পুষ্টি ঘাটতি",
    cropEn: "Fruit Trees, Legumes & Cereals",
    cropBn: "ফলগাছ, ডাল ও দানাশস্য",
    clueEn: "Crisp brown marginal death strictly along external leaf rim with intact central blade.",
    clueBn: "পাতার ভেতরের অংশ অক্ষত রেখে ঠিক কিনারার চারপাশ পুড়ে মচমচে বাদামী হওয়া।"
  },
  107: {
    pathogenEn: "Moniliophthora perniciosa (Witches' Broom on Cacao / Bramble)",
    pathogenBn: "উইচেস ব্রুম বা ঝাঁটার মতো কাণ্ডের অস্বাভাবিক বৃদ্ধি",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত",
    cropEn: "Cacao (Theobroma cacao) & Bramble",
    cropBn: "কোকো ও ঝোপঝাড়",
    clueEn: "Growing apex splits into dozens of competing shoots creating a classic dense brush structure.",
    clueBn: "ডগার বৃদ্ধি বিন্দু ভেঙে শত শত ক্ষুদ্র প্রতিযোগিতামূলক কাণ্ডের ঝাঁটায় পরিণত হওয়া।"
  },
  108: {
    pathogenEn: "Surface Pathogen Growth (Powdery Mildew / Sooty Mould)",
    pathogenBn: "পাতার বহিরাবরণে দৃশ্যমান পরজীবী (পাউডারি মিলডিউ / সুটি মোল্ড)",
    typeEn: "Fungus",
    typeBn: "ছত্রাকের চিহ্ন (Sign)",
    cropEn: "Cucurbits, Citrus, Mango & Roses",
    cropBn: "লাউ-কুমড়ো, লেবু, আম ও গোলাপ",
    clueEn: "Direct macroscopic sign of fungal colonies (white powdery spores or black superficial crust).",
    clueBn: "সরাসরি চোখে দৃশ্যমান ছত্রাকের উপস্থিতি: সাদা পাউডারের আবরণ বা কালো কয়লার মতো সুটি মোল্ড।"
  },
  109: {
    pathogenEn: "Bacterial & Fungal Stem Canker (Cherry & Blueberry)",
    pathogenBn: "চেরি ও ব্লুবেরির কাণ্ডে ব্যাকটেরিয়া ও ছত্রাকের গভীর ক্ষত (ক্যাঙ্কার)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়া / ছত্রাক",
    cropEn: "Cherry, Blueberry & Fruit Trees",
    cropBn: "চেরি, ব্লুবেরি ও ফলগাছ",
    clueEn: "Bulging calloused margins surrounding an open perennial woody depression or fissure.",
    clueBn: "কাষ্ঠল কাণ্ডে দেবে যাওয়া গভীর ক্ষত এবং তার চারপাশের টিস্যু ফুলে শক্ত হয়ে ওঠা।"
  },
  110: {
    pathogenEn: "Cosmopolites sordidus (Banana Weevil Stem Bore Holes)",
    pathogenBn: "কলার বিটল পোকার কাণ্ড ছিদ্রকরণ ও ফ্রাস নির্গমন",
    typeEn: "Insect Pest",
    typeBn: "পোকার আক্রমণ",
    cropEn: "Banana (Musa paradisiaca)",
    cropBn: "কলা",
    clueEn: "Clear cylindrical entry and exit tunnels inside pseudo-stem plugged with dark insect frass sawdust.",
    clueBn: "কলার কাণ্ডে পরিষ্কার গোল ছিদ্র এবং ভেতর থেকে করাতের গুঁড়োর মতো মল বের হয়ে আসা।"
  },
  111: {
    pathogenEn: "Root-Knot Nematode (Meloidogyne) & Crown Gall",
    pathogenBn: "শিকড়ের নট নেমাটোড ও কাষ্ঠল কাণ্ডের ক্রাউন গল",
    typeEn: "Nematode",
    typeBn: "নেমাটোড / ব্যাক্টেরিয়া",
    cropEn: "Horticulture, Roots & Woody Twigs",
    cropBn: "শাকসবজি, শিকড় ও কাষ্ঠল ডাল",
    clueEn: "Massive disordered nodular swellings on primary root strands and woody branches.",
    clueBn: "শিকড়ে ও ডালপালায় গোল ও অসমান বিকৃত টিউমার বা নডিউল গঠন।"
  },
  112: {
    pathogenEn: "Rhizopus & Pectobacterium (Soft Slimy Rot)",
    pathogenBn: "নরম দুর্গন্ধযুক্ত ও পিচ্ছিল পচন (সফট রট)",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়া / ছত্রাক",
    cropEn: "Sweet Potato, Tomato & Fruit Tuber",
    cropBn: "মিষ্টি আলু, টমেটো ও মূল ফসল",
    clueEn: "Rapid liquefaction of internal fleshy tissues into a soft, slimy, foul-smelling brown rot.",
    clueBn: "ভেতরের মাংসল টিস্যু গলে নরম ও পিচ্ছিল হয়ে দুর্গন্ধযুক্ত পচনে রূপ নেওয়া।"
  },
  113: {
    pathogenEn: "Fusarium & Verticillium Vascular Xylem Staining",
    pathogenBn: "ফিউজেরিয়াম ও ভার্টিসিলিয়াম ঘটিত পরিবহন নালীর বাদামী দাগ",
    typeEn: "Fungus",
    typeBn: "ছত্রাকজনিত (উইল্ট)",
    cropEn: "Tomato, Cotton, Banana & Potato",
    cropBn: "টমেটো, তুলা, কলা ও আলু",
    clueEn: "Dark brown or reddish streaks visible in the water-conducting vascular ring when stem is split.",
    clueBn: "কাণ্ড লম্বালম্বিভাবে চিরলে ভেতরের পরিবহন নালীতে অবিচ্ছিন্ন বাদামী বা লালচে দাগ দেখা যায়।"
  },
  114: {
    pathogenEn: "Erwinia amylovora (Fire Blight Localised Branch Drying)",
    pathogenBn: "ফায়ার ব্লাইট ও কফির শাখায় হঠাৎ শুকিয়ে যাওয়া রোগ",
    typeEn: "Bacteria",
    typeBn: "ব্যাকটেরিয়াজনিত",
    cropEn: "Pear, Apple & Coffee",
    cropBn: "নাশপাতি, আপেল ও কফি",
    clueEn: "Sudden localized scorching and shriveling of entire foliage branch while adjacent limbs remain lush.",
    clueBn: "পুরো গাছের বাকি অংশ সুস্থ থাকা সত্ত্বেও নির্দিষ্ট একটি ডালের পাতা হঠাৎ আগুনে পোড়ার মতো শুকিয়ে যাওয়া।"
  },
  118: {
    pathogenEn: "CABI Plantwise Pest Management Guidelines",
    pathogenBn: "ক্যাবি প্ল্যান্টওয়াইজ সমন্বিত বালাই ব্যবস্থাপনা নির্দেশিকা",
    typeEn: "General",
    typeBn: "সার্বিক নির্দেশিকা",
    cropEn: "Integrated Pest Management (IPM)",
    cropBn: "সমন্বিত বালাই ব্যবস্থাপনা",
    clueEn: "Comprehensive farmer recommendations and sustainable agro-ecological practices.",
    clueBn: "কৃষকদের জন্য টেকসই জৈব বালাই দমন ও সঠিক ফসল সুরক্ষা ব্যবস্থাপনা।"
  }
};

// Comprehensive mapping of CABI guide pages to primary symptom category
export const PAGE_CATEGORY_MAP: Record<number, string> = {
  15: "Leaf spot",
  26: "Wilt",
  27: "Wilt",
  28: "Wilt",
  29: "Wilt",
  30: "Wilt",
  31: "Wilt",
  32: "Leaf spot",
  33: "Leaf spot",
  34: "Leaf spot",
  35: "Leaf spot",
  36: "Leaf spot",
  37: "Leaf spot",
  38: "Leaf spot",
  39: "Leaf spot",
  40: "Witches' broom",
  41: "Witches' broom",
  42: "Canker",
  43: "Mosaic",
  44: "Mosaic",
  46: "Yellowing of leaves",
  47: "Yellowing of leaves",
  48: "Yellowing of leaves",
  49: "Yellowing of leaves",
  50: "Yellowing of leaves",
  51: "Distortion of leaves",
  52: "Distortion of leaves",
  53: "Distortion of leaves",
  54: "Distortion of leaves",
  55: "Little leaf",
  56: "Little leaf",
  57: "Galls",
  58: "Galls",
  59: "Galls",
  60: "Drying/necrosis/blight",
  61: "Drying/necrosis/blight",
  62: "Drying/necrosis/blight",
  93: "Wilt",
  94: "Yellowing of leaves",
  95: "Yellowing of leaves",
  96: "Drying/necrosis/blight",
  97: "Wilt",
  98: "Leaf spot",
  99: "Leaf spot",
  100: "Leaf spot",
  101: "Drying/necrosis/blight",
  102: "Distortion of leaves",
  103: "Distortion of leaves",
  104: "Little leaf",
  105: "Mosaic",
  106: "Drying/necrosis/blight",
  107: "Witches' broom",
  108: "Leaf spot",
  109: "Canker",
  110: "Drying/necrosis/blight",
  111: "Galls",
  112: "Drying/necrosis/blight",
  113: "Wilt",
  114: "Drying/necrosis/blight"
};

/**
 * Returns a fully indexed pathogen/problem metadata object for any image.
 */
export function getImagePathogenInfo(
  imageName: string,
  pageNumber: number,
  locale: "en" | "bn",
  category?: string | null,
  figIndex?: number
): ImagePathogenInfo {
  // Extract index number from filename if available (e.g. "img_page20_4.jpeg" -> 4)
  let extractedIdx = 0;
  const match = imageName.match(/_(\d+)\.(jpeg|jpg|png|webp)$/i);
  if (match && match[1]) {
    extractedIdx = parseInt(match[1], 10);
  } else if (typeof figIndex === "number") {
    extractedIdx = figIndex;
  }

  const catalogEntry = PAGE_PATHOGEN_CATALOG[pageNumber];
  const figNumberDisplay = extractedIdx + 1;
  const figureLabel = locale === "bn" ? `চিত্র ${figNumberDisplay}` : `Fig ${figNumberDisplay}`;

  if (catalogEntry) {
    const specific = catalogEntry.imgSpecific?.[extractedIdx];
    const pathogenNameEn = specific?.pathogenEn || catalogEntry.pathogenEn;
    const pathogenNameBn = specific?.pathogenBn || catalogEntry.pathogenBn;
    const problemTypeEn = specific?.typeEn || catalogEntry.typeEn;
    const problemTypeBn = specific?.typeBn || catalogEntry.typeBn;
    const hostCropEn = specific?.cropEn || catalogEntry.cropEn;
    const hostCropBn = specific?.cropBn || catalogEntry.cropBn;
    const diagnosticClueEn = specific?.clueEn || catalogEntry.clueEn;
    const diagnosticClueBn = specific?.clueBn || catalogEntry.clueBn;

    const typeColor = PROBLEM_TYPE_COLORS[problemTypeEn] || PROBLEM_TYPE_COLORS["General"];

    return {
      figureLabel,
      pathogenName: locale === "bn" ? pathogenNameBn : pathogenNameEn,
      pathogenNameEn,
      pathogenNameBn,
      problemType: locale === "bn" ? problemTypeBn : problemTypeEn,
      problemTypeEn,
      problemTypeBn,
      typeColor,
      hostCrop: locale === "bn" ? hostCropBn : hostCropEn,
      hostCropEn,
      hostCropBn,
      diagnosticClue: locale === "bn" ? diagnosticClueBn : diagnosticClueEn,
      diagnosticClueEn,
      diagnosticClueBn,
      page: pageNumber,
      fileName: imageName
    };
  }

  // Fallback if page not explicitly in catalog
  const fallbackCatEn = category || "Field Crop Pathogen";
  const fallbackCatBn = category ? (locale === "bn" ? category : category) : "মাঠ ফসলের রোগজীবাণু";
  return {
    figureLabel,
    pathogenName: locale === "bn" ? `${fallbackCatBn} নমুনা` : `${fallbackCatEn} Specimen`,
    pathogenNameEn: `${fallbackCatEn} Specimen`,
    pathogenNameBn: `${fallbackCatBn} নমুনা`,
    problemType: locale === "bn" ? "মাঠ রোগজীবাণু" : "Field Pathogen",
    problemTypeEn: "Field Pathogen",
    problemTypeBn: "মাঠ রোগজীবাণু",
    typeColor: PROBLEM_TYPE_COLORS["General"],
    hostCrop: locale === "bn" ? "মাঠ ফসল" : "Field Crops",
    hostCropEn: "Field Crops",
    hostCropBn: "মাঠ ফসল",
    diagnosticClue: locale === "bn" ? `CABI মাঠ নির্দেশিকার পৃষ্ঠা ${pageNumber} এর প্রামাণ্য ছবি।` : `Reference photograph from CABI field guide page ${pageNumber}.`,
    diagnosticClueEn: `Reference photograph from CABI field guide page ${pageNumber}.`,
    diagnosticClueBn: `CABI মাঠ নির্দেশিকার পৃষ্ঠা ${pageNumber} এর প্রামাণ্য ছবি।`,
    page: pageNumber,
    fileName: imageName
  };
}
