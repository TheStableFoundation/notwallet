export interface Translation {
  appName: string;
  home: string;
  lessons: string;
  wallet?: string;
  profile: string;
  welcome: string;
  homeDesc: string;
  getStarted: string;
  startLesson: string;
  back: string;
  lessonCompleted: string;
  user: string;
  guest: string;
  progress: string;
  completed: string;
  question: string;
  of: string;
  afterChoice: string;
  correct: string;
  incorrect: string;
  startThisLesson: string;
}

export type SupportedLanguages = 'fa' | 'en' | 'sv';

export const translations: Record<SupportedLanguages, Translation> = {
  fa: {
    appName: "رومی",
    home: "خانه",
    lessons: "درس‌ها",
    profile: "پروفایل",
    welcome: "به رومی خوش آمدید!",
    homeDesc: "روشی سرگرم‌کننده برای یادگیری زبان فارسی.",
    getStarted: "شروع یادگیری",
    startLesson: "شروع",
    back: "← بازگشت",
    lessonCompleted: "درس به پایان رسید! 🎉",
    user: "نام کاربر",
    guest: "مهمان",
    progress: "پیشرفت",
    completed: "درس تکمیل شده",
    question: "سوال",
    of: "از",
    afterChoice: "پس از انتخاب، نتیجه نمایش داده می‌شود.",
    correct: "درست!",
    incorrect: "اشتباه!",
    startThisLesson: "شروع درس",
  },
  en: {
    appName: "NotWallet",
    home: "Home",
    lessons: "Lessons",
    wallet: "Wallet",
    profile: "Profile",
    welcome: "Welcome to NotWallet Crypto!",
    homeDesc: "A fun way to learn Persian.",
    getStarted: "Start Learning",
    startLesson: "Start",
    back: "← Back",
    lessonCompleted: "Lesson Complete! 🎉",
    user: "Username",
    guest: "Guest",
    progress: "Progress",
    completed: "lesson(s) completed",
    question: "Question",
    of: "of",
    afterChoice: "The result will be shown after you select.",
    correct: "Correct!",
    incorrect: "Incorrect!",
    startThisLesson: "Start Lesson",
  },
  sv: {
    appName: "NotWallet",
    home: "Hem",
    lessons: "Lektioner",
    wallet: "Plånbok",
    profile: "Profil",
    welcome: "Välkommen till NotWallet Crypto!",
    homeDesc: "Ett roligt sätt att lära sig persiska.",
    getStarted: "Börja lära",
    startLesson: "Starta",
    back: "← Tillbaka",
    lessonCompleted: "Lektion klar! 🎉",
    user: "Användarnamn",
    guest: "Gäst",
    progress: "Framsteg",
    completed: "lektion(er) slutförda",
    question: "Fråga",
    of: "av",
    afterChoice: "Resultatet visas när du har valt.",
    correct: "Rätt!",
    incorrect: "Fel!",
    startThisLesson: "Starta lektionen",
  },
};
