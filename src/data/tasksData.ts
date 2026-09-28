import { Task, Badge } from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'room-cleanup',
    title: 'Xonani tartibga keltirish',
    shortDesc: 'Tartibsiz xonadagi buyumlarni o‘z joylariga to‘g‘ri joylashtirishni o‘rganing.',
    category: 'hayot',
    difficulty: 'Oson',
    xpReward: 50,
    icon: '🧹',
    estimatedTime: '3-5 daqiqa',
    explanation: 'Toza va tartibli xona — bu tinch va tiniq fikr garovidir. Narsalarni o‘z o‘rniga qo‘yish orqali vaqt tejaladi, stress kamayadi va ish unumdorligi oshadi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Kuzatish va saralash',
        instruction: 'Xonaga umumiy nazar tashlang. Birinchi navbatda ko‘zga tashlanadigan katta buyumlar va ochiqda qolgan kiyimlarni aniqlang.',
        tip: 'Hammasini bir vaqtda qilishga shoshilmang, toifalar bo‘yicha harakat qiling.'
      },
      {
        stepNumber: 2,
        title: 'Axlat va keraksiz narsalarni yo‘qotish',
        instruction: 'Qog‘ozlar, bo‘sh idishlar, konfet qog‘ozlari va singan mayda-chuydalarni to‘g‘ridan-to‘g‘ri axlat chelagiga tashlang.',
        tip: 'Axlatni yo‘qotish xona hajmini 40% ga darhol kengaytiradi.'
      },
      {
        stepNumber: 3,
        title: 'Kiyimlarni joyiga taxlash',
        instruction: 'Toza kiyimlarni ilmoqqa osib yoki shkaf tokchasiga buklab qo‘ying. Kir kiyimlarni esa kir yuvish savatiga soling.',
        tip: 'Kreslo yoki stul ustiga kiyim yig‘ish odatidan voz keching.'
      },
      {
        stepNumber: 4,
        title: 'Ish stoli va javonlarni tartiblash',
        instruction: 'Kitoblarni tik holatda javonga turing, qalam va daftarlarni qalamdonga, noutbukni esa ish stoli markaziga joylashtiring.',
        tip: 'Stol ustida faqat hozir foydalanilayotgan buyumlargina turishi kerak.'
      }
    ],
    gameObjective: 'Xona bo‘ylab tarqalib yotgan 8 xil buyumni (kitob, kiyim, axlat, kofe finjoni, o‘yinchoq va boshqalar) tegishli joylariga (javon, shkaf, axlat qutisi, oshxona, stol) to‘g‘ri joylashtiring!'
  },
  {
    id: 'time-planning',
    title: 'Vaqtni rejalashtirish',
    shortDesc: 'Kuningizni eng muhim va unumli soatlarga qarab to‘g‘ri taqsimlang.',
    category: 'unumdorlik',
    difficulty: 'O\'rtacha',
    xpReward: 60,
    icon: '⏰',
    estimatedTime: '4-6 daqiqa',
    explanation: 'Vaqt — tiklab bo‘lmaydigan eng qimmatli resurs. Eyzanxauer matritsasi va biologik ritm asosida rejalashtirish chalg‘ishlarning oldini oladi va asosiy maqsadlarga tezroq yetaklaydi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Vazifalar ro‘yxatini tuzish (Brain Dump)',
        instruction: 'Bajarilishi kerak bo‘lgan barcha ishlarni qog‘ozga yoki ilovaga yozib chiqing.',
        tip: 'Xotirangizga ortiqcha yuklama bermang, miya g‘oyalar yaratish uchun, saqlash uchun emas.'
      },
      {
        stepNumber: 2,
        title: 'Muhimlik va shoshilinchlikni baholash',
        instruction: 'Vazifalarni "Muhim va shoshilinch", "Muhim lekin shoshilinch emas", "Vakolat berish mumkin" guruhlariga ajrating.',
        tip: 'Eng katta natija beradigan "Muhim lekin shoshilinch emas" vazifalarga vaqt ajrating.'
      },
      {
        stepNumber: 3,
        title: 'Ertalabki "Qurbaqani yeyish" qoidasi',
        instruction: 'Kunning eng murakkab, eng ko‘p iroda va aqliy diqqat talab qiladigan vazifasini ertalabki soat 08:00 - 11:00 oralig‘iga qo‘ying.',
        tip: 'Kunning boshida qiyin ishni bitirsangiz, qolgan kun yengil va xotirjam o‘tadi.'
      },
      {
        stepNumber: 4,
        title: 'Chalg‘ituvchi omillarni bloklash',
        instruction: 'Ijtimoiy tarmoqlarni va behuda suhbatlarni ish vaqtidan tashqariga suring, 25/5 Pomodoro tanaffuslaridan foydalaning.',
        tip: 'Doimiy bildirishnomalarni (notif) o‘chirib qo‘ying.'
      }
    ],
    gameObjective: 'Kuningizdagi turli vazifalarni eng to‘g‘ri vaqt bloklariga (Ertalabki chuqur diqqat, Tushdan keyin amaliy ish, Kechki xulosa va dam olish) joylashtiring hamda chalg‘ituvchi zararli odatlarni rad eting!'
  },
  {
    id: 'book-reading',
    title: 'Kitob o‘qish va tushunish',
    shortDesc: 'Tez va tushunib o‘qish orqali matndan eng muhim xulosalarni ajratib oling.',
    category: 'talim',
    difficulty: 'Oson',
    xpReward: 55,
    icon: '📚',
    estimatedTime: '3-4 daqiqa',
    explanation: 'Kitob o‘qish faqat so‘zlarni ko‘zdan kechirish emas, balki muallif g‘oyasini tahlil qilish, asosiy faktlarni eslab qolish va ularni hayotga tatbiq etishdir.',
    steps: [
      {
        stepNumber: 1,
        title: 'Skimming (Yuzaki ko‘zdan kechirish)',
        instruction: 'Matnni to‘liq o‘qishdan oldin uning sarlavhalari, qalin shriftli so‘zlari va xulosasiga tezkor qarab chiqing.',
        tip: 'Bu miyaga matnning umumiy xaritasini chizib beradi.'
      },
      {
        stepNumber: 2,
        title: 'Faol o‘qish (Active Reading)',
        instruction: 'O‘qiyotganda "Bu nima uchun muhim?", "Buni o‘z hayotimda qanday qo‘llay olaman?" degan savollarni bering.',
        tip: 'Tushunarsiz so‘zlarni belgilab, lug‘atdan qarab keting.'
      },
      {
        stepNumber: 3,
        title: 'Konspekt qilish va xulosa chiqarish',
        instruction: 'O‘qilgan har bir bobdan 1-2 ta asosiy fikrni o‘z so‘zlaringiz bilan qisqacha daftarga yozib qo‘ying.',
        tip: 'Boshqalarga so‘zlab berish (Feynman texnikasi) tushunishni 90% ga mustahkamlaydi.'
      }
    ],
    gameObjective: 'Taqdim etilgan qisqa va mazmunli ilmiy-ommabop matnni diqqat bilan o‘qing va keyin uning mazmuni bo‘yicha tezkor savollarga to‘g‘ri javob bering!'
  },
  {
    id: 'logic-puzzle',
    title: 'Mantiqiy masalalar',
    shortDesc: 'Mantiqiy fikrlash, ketma-ketlik va muammolarni bosqichma-bosqich yechish.',
    category: 'mantiq',
    difficulty: 'Qiyin',
    xpReward: 75,
    icon: '🧠',
    estimatedTime: '5-8 daqiqa',
    explanation: 'Mantiqiy tafakkur — murakkab vaziyatlarda eng to‘g‘ri va optimal yechimni topish ko‘nikmasidir. Bu dasturlashda, biznesda va kundalik qarorlarda yordam beradi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Shartlarni chuqur tahlil qilish',
        instruction: 'Masalada nima berilgan va nima so‘ralayotganini aniqlang. Barcha cheklovlarni alohida qayd eting.',
        tip: 'Ko‘pincha eng muhim kalit masala matnidagi mayda detallarda yashiringan bo‘ladi.'
      },
      {
        stepNumber: 2,
        title: 'Katta muammoni mayda bo‘laklarga ajratish',
        instruction: 'Boshlang‘ich holatdan yakuniy maqsadga olib boruvchi qadamlarni birma-bir hisoblab chiqing.',
        tip: 'Qarama-qarshi tomondan (oxiridan boshiga qarab) fikrlash usuli juda foydali.'
      },
      {
        stepNumber: 3,
        title: 'Xatolardan xulosa chiqarish va qayta sinash',
        instruction: 'Agar urinish o‘xshamasa, orqaga qaytib boshqa yo‘lni sinab ko‘ring.',
        tip: 'Qat’iyatlilik va sabr — mantiqiy masalalarning asosiy quroli.'
      }
    ],
    gameObjective: 'Interaktiv "Bo‘ri, echki va karam daryodan o‘tish" hamda "Suv idishlari bilan 4 litrni o‘lchash" jumboqlarini xatosiz yechib, barcha yulduzlarni qo‘lga kiriting!'
  },
  {
    id: 'goal-planning',
    title: 'Reja tuzish va Maqsad qo‘yish',
    shortDesc: 'Katta maqsadlarni kichik va aniq amaliy qadamlarga ajratib, tartibga soling.',
    category: 'unumdorlik',
    difficulty: 'O\'rtacha',
    xpReward: 65,
    icon: '📝',
    estimatedTime: '4-5 daqiqa',
    explanation: 'Rejasiz maqsad — shunchaki xomxayoldir. SMART qoidasi asosida maqsad qo‘yish va harakatlar ketma-ketligini tuzish har qanday orzuni amalga oshirish poydevoridir.',
    steps: [
      {
        stepNumber: 1,
        title: 'SMART formatida aniq maqsad',
        instruction: 'Maqsad: Aniq (Specific), O‘lchovli (Measurable), Erishsa bo‘ladigan (Achievable), Muhim (Relevant) va Vaqti belgilangan (Time-bound) bo‘lishi lozim.',
        tip: '"Ingliz tilini o‘rganaman" emas, balki "3 oyda IELTS 6.5 olish uchun har kuni 1 soat shug‘ullanaman".'
      },
      {
        stepNumber: 2,
        title: 'Bosqichma-bosqich xarita tuzish',
        instruction: 'Oxirgi natijadan boshlab qadamlarni teskari tartibda tizimlashtiring: poydevor -> tayyorgarlik -> amaliyot -> baholash.',
        tip: 'Birinchi qadamni imkon qadar yengil va 24 soat ichida bajariladigan qiling.'
      },
      {
        stepNumber: 3,
        title: 'Muntazamlikni nazorat qilish',
        instruction: 'Har hafta oxirida o‘z progressingizni ko‘rib chiqing va rejadagi kamchiliklarni to‘g‘rilang.',
        tip: 'Kichik g‘alabalarni ham nishonlash ishtiyoqni so‘ndirmaydi.'
      }
    ],
    gameObjective: 'Aralashib ketgan amaliy qadamlarni to‘g‘ri xronologik va mantiqiy ketma-ketlikda joylashtiring!'
  },
  {
    id: 'digital-hygiene',
    title: 'Kompyuterda tez va to‘g‘ri ishlash',
    shortDesc: 'Klaviatura tezkor tugmalari (hotkeys) va fayllarni tartiblash bilan ish tezligini oshiring.',
    category: 'texnologiya',
    difficulty: 'Oson',
    xpReward: 50,
    icon: '💻',
    estimatedTime: '3-5 daqiqa',
    explanation: 'Kompyuterda klaviatura kombinatsiyalari orqali ishlash sichqoncha bilan solishtirganda har kuni kamida 30-40 daqiqa vaqtni tejaydi. Fayllarni tartibli saqlash esa kerakli hujjatni soniyalar ichida topish imkonini beradi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Asosiy kombinatsiyalarni avtomatlashtirish',
        instruction: 'Nusxa olish (Ctrl+C), joylashtirish (Ctrl+V), orqaga qaytarish (Ctrl+Z) va saqlash (Ctrl+S) tugmalarini qo‘lingiz o‘z-o‘zidan bosadigan darajaga yetkazing.',
        tip: 'Ekranga qaramasdan tugmalarni his qilishga o‘rganing.'
      },
      {
        stepNumber: 2,
        title: 'Ilovalar o‘rtasida tezkor almashish',
        instruction: 'Alt+Tab orqali ochiq oynalarni almashing, brauzerda yangi vkladka uchun Ctrl+T, yopilgan vkladkani qayta ochish uchun esa Ctrl+Shift+T dan foydalaning.',
        tip: 'Sichqonchaga kamroq teginish ish ritmini (flow state) buzmaydi.'
      },
      {
        stepNumber: 3,
        title: 'Desktop (Ish stoli) gigiyenasi',
        instruction: 'Ish stoliga yuzlab fayllarni to‘plamang. "Hujjatlar", "Loyihalar", "Yuklab olinganlar" papkalarini yarating.',
        tip: 'Haftada bir marta "Yuklab olinganlar" (Downloads) papkasini tozalab turing.'
      }
    ],
    gameObjective: 'Ekranda berilgan tezkor vazifalar uchun to‘g‘ri klaviatura tugmalarini bosing va fayllarni tegishli papkalarga saralang!'
  },
  {
    id: 'fact-checking',
    title: 'Ma’lumot izlash va Fakt-cheking',
    shortDesc: 'Internetdagi ishonchli manbalarni yolg‘on (feyk) xabarlardan ajratish san’ati.',
    category: 'talim',
    difficulty: 'O\'rtacha',
    xpReward: 60,
    icon: '🔍',
    estimatedTime: '4-5 daqiqa',
    explanation: 'Axborot asrida feyk xabarlar va manipulyatsiyalar juda ko‘p. Har qanday ma’lumotni tekshirish, asl manbasini topish va tanqidiy fikrlash har bir ongli inson uchun shart.',
    steps: [
      {
        stepNumber: 1,
        title: 'Manba va muallifni tekshirish',
        instruction: 'Xabar qaysi saytda yoki kanalda chiqqan? Muallif nomi bormi? Rasmiy davlat yoki ilmiy tashkilot saytida tasdiqlanganmi?',
        tip: 'Noma’lum havolalar va sensatsion nomlardan ehtiyot bo‘ling.'
      },
      {
        stepNumber: 2,
        title: 'Sarlavha shov-shuvini tahlil qilish (Clickbait)',
        instruction: '"Shok! Tezda ko‘ring!", "Buni barcha yashirmoqda" kabi hissiyotga ta’sir qiluvchi so‘zlar ko‘pincha feyk xabarlarning belgisidir.',
        tip: 'Xolis manbalar tinch, faktlarga asoslangan uslubda yozadi.'
      },
      {
        stepNumber: 3,
        title: 'Sana va kontekstni tekshirish',
        instruction: 'Eski yangiliklar qayta yangidek tarqatilishi mumkin. Google orqali qidiruv berib, ma’lumot sanasini aniqlang.',
        tip: 'Rasmlarni Google Lens orqali qidirib, asl qachon olinganini tekshiring.'
      }
    ],
    gameObjective: 'Detektiv sifatida 5 ta internet xabarini o‘rganing va ularning qaysi biri haqiqiy, qaysi biri yolg‘on feyk ekanligini aniqlang!'
  },
  {
    id: 'smart-budget',
    title: 'Moliyaviy byudjet tuzish',
    shortDesc: '50/30/20 qoidasi bo‘yicha daromadni to‘g‘ri taqsimlab, moliyaviy barqarorlikka erishing.',
    category: 'moliya',
    difficulty: 'O\'rtacha',
    xpReward: 65,
    icon: '🎯',
    estimatedTime: '4-6 daqiqa',
    explanation: 'Pul topish qanchalik muhim bo‘lsa, uni to‘g‘ri boshqarish undan ham muhimroq. 50/30/20 qoidasi dunyo bo‘yicha eng mashhur va oson moliyaviy taqsimot formulasi hisoblanadi.',
    steps: [
      {
        stepNumber: 1,
        title: '50% — Zaruriy ehtiyojlar (Needs)',
        instruction: 'Oziq-ovqat, ijara, kommunal to‘lovlar, yo‘l haqi va dori-darmonlar kabi yashash uchun zarur bo‘lgan xarajatlar.',
        tip: 'Bu xarajatlar kechiktirib bo‘lmaydigan asosiy ustun hisoblanadi.'
      },
      {
        stepNumber: 2,
        title: '30% — Xohish va istaklar (Wants)',
        instruction: 'Kafelarga borish, kiyim-kechak, ko‘ngilochar tadbirlar, kinoga tushish yoki yangi gadjetlar.',
        tip: 'Hayotdan zavqlanish kerak, lekin bu qism 30% dan oshib ketmasligi shart.'
      },
      {
        stepNumber: 3,
        title: '20% — Jamg‘arma va xavfsizlik yostiqchasi (Savings)',
        instruction: 'Investitsiyalar, kelajak uchun depozit va kamida 3-6 oylik xarajatni qoplaydigan favqulodda zaxira jamg‘armasi.',
        tip: 'Pul kelishi bilan birinchi bo‘lib o‘zingizning kelajagingizga (20%) ajrating.'
      }
    ],
    gameObjective: 'Oylik byudjetni 50/30/20 qoidasiga ko‘ra to‘g‘ri taqsimlang va kutilmagan moliyaviy sinovlardan muvaffaqiyatli o‘ting!'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_task',
    title: 'Birinchi Qadam',
    description: 'Ilk amaliy vazifani muvaffaqiyatli bajarganingiz uchun beriladi.',
    icon: '🌱',
    category: 'Boshlanish',
    isUnlocked: false,
    requiredTasksCount: 1
  },
  {
    id: 'clean_freak',
    title: 'Tozalik Posboni',
    description: 'Xonani tartibga keltirish vazifasini yuqori ball bilan tamomladingiz.',
    icon: '🧹',
    category: 'Maxsus',
    isUnlocked: false,
    specialCondition: 'room-cleanup'
  },
  {
    id: 'time_master',
    title: 'Vaqt Hukmdori',
    description: 'Kunlik vaqt taqsimotini a’lo darajada rejalashtirdingiz.',
    icon: '⏰',
    category: 'Maxsus',
    isUnlocked: false,
    specialCondition: 'time-planning'
  },
  {
    id: 'logic_whiz',
    title: 'Mantiq Ustasi',
    description: 'Murakkab mantiqiy jumboqlarni xatosiz yechdingiz.',
    icon: '🧠',
    category: 'Maxsus',
    isUnlocked: false,
    specialCondition: 'logic-puzzle'
  },
  {
    id: 'book_worm',
    title: 'Zakovatli Kitobxon',
    description: 'Matnni tez o‘qib, barcha savollarga 100% to‘g‘ri javob berdingiz.',
    icon: '📚',
    category: 'Maxsus',
    isUnlocked: false,
    specialCondition: 'book-reading'
  },
  {
    id: 'task_trio',
    title: 'Uch Karra Qahramon',
    description: 'Kamida 3 xil foydali vazifani to‘liq yakunladingiz.',
    icon: '🔥',
    category: 'Progress',
    isUnlocked: false,
    requiredTasksCount: 3
  },
  {
    id: 'xp_hundred',
    title: '100 XP Klub',
    description: 'Jami 100 dan ortiq tajriba balliga (XP) ega bo‘ldingiz.',
    icon: '⭐',
    category: 'XP',
    isUnlocked: false,
    requiredXp: 100
  },
  {
    id: 'xp_three_hundred',
    title: '300 XP Elitasi',
    description: 'Jami 300 dan ortiq tajriba balliga erishdingiz.',
    icon: '🌟',
    category: 'XP',
    isUnlocked: false,
    requiredXp: 300
  },
  {
    id: 'master_all',
    title: 'Grandmaster',
    description: 'Platformadagi barcha vazifalarni to‘liq bajarib chiqdingiz!',
    icon: '👑',
    category: 'Ulug‘vor',
    isUnlocked: false,
    requiredTasksCount: 8
  }
];

export const LEVEL_TIERS = [
  { level: 1, title: 'Boshlovchi', minXp: 0, maxXp: 100 },
  { level: 2, title: 'O‘rganuvchi', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Faol O‘rganuvchi', minXp: 250, maxXp: 450 },
  { level: 4, title: 'Tajribali Usta', minXp: 450, maxXp: 700 },
  { level: 5, title: 'Amaliyot Eksperti', minXp: 700, maxXp: 1000 },
  { level: 6, title: 'Grandmaster', minXp: 1000, maxXp: 9999 }
];

export function getLevelInfo(xp: number) {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      const tier = LEVEL_TIERS[i];
      const nextTier = LEVEL_TIERS[i + 1] || null;
      const progressInTier = nextTier
        ? Math.min(100, Math.round(((xp - tier.minXp) / (nextTier.minXp - tier.minXp)) * 100))
        : 100;
      return {
        level: tier.level,
        title: tier.title,
        currentXp: xp,
        tierMin: tier.minXp,
        nextTierXp: nextTier ? nextTier.minXp : tier.maxXp,
        progressPercent: progressInTier
      };
    }
  }
  return {
    level: 1,
    title: 'Boshlovchi',
    currentXp: xp,
    tierMin: 0,
    nextTierXp: 100,
    progressPercent: 0
  };
}
