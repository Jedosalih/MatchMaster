
import { MatchData, FormationsMap } from './types';

export const DEFAULT_PLAYER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23475569'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
export const DEFAULT_TEAM_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23475569'%3E%3Cpath d='M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'/%3E%3C/svg%3E";

export const FORMATIONS_MAP: FormationsMap = {
  "4-2-3-1": {
    "GK":  { x: 50, y: 92 },
    "LB":  { x: 8,  y: 76 }, "LCB": { x: 33, y: 82 }, "RCB": { x: 67, y: 82 }, "RB":  { x: 92, y: 76 },
    "LDM": { x: 32, y: 64 }, "RDM": { x: 68, y: 64 },
    "LM":  { x: 12, y: 40 }, "CAM": { x: 50, y: 42 }, "RM":  { x: 88, y: 40 },
    "ST":  { x: 50, y: 16 }
  },
  "4-3-3": {
    "GK":  { x: 50, y: 92 },
    "LB":  { x: 8,  y: 76 }, "LCB": { x: 33, y: 82 }, "RCB": { x: 67, y: 82 }, "RB":  { x: 92, y: 76 },
    "LCM": { x: 25, y: 58 }, "CM":  { x: 50, y: 62 }, "RCM": { x: 75, y: 58 },
    "LW":  { x: 12, y: 26 }, "ST":  { x: 50, y: 16 }, "RW":  { x: 88, y: 26 }
  },
  "4-4-2": {
    "GK":  { x: 50, y: 92 },
    "LB":  { x: 8,  y: 76 }, "LCB": { x: 33, y: 82 }, "RCB": { x: 67, y: 82 }, "RB":  { x: 92, y: 76 },
    "LM":  { x: 12, y: 54 }, "LCM": { x: 36, y: 58 }, "RCM": { x: 64, y: 58 }, "RM":  { x: 88, y: 54 },
    "CF":  { x: 35, y: 18 }, "ST":  { x: 65, y: 18 }
  },
  "3-5-2": {
    "GK":  { x: 50, y: 92 },
    "LCB": { x: 20, y: 82 }, "CB":  { x: 50, y: 85 }, "RCB": { x: 80, y: 82 },
    "LWB": { x: 8,  y: 52 }, "LCM": { x: 30, y: 60 }, "CM":  { x: 50, y: 64 }, "RCM": { x: 70, y: 60 }, "RWB": { x: 92, y: 52 },
    "CF":  { x: 38, y: 18 }, "ST":  { x: 62, y: 18 }
  }
};

export const MOCK_MATCH: MatchData = {
  competition: "دوري روشن السعودي • الجولة 25",
  time: "64:12",
  venue: "استاد مدينة الملك فهد الرياضية",
  score: { home: 2, away: 1 },
  homeTeam: {
    id: 'hilal-1',
    name: "نادي الهلال",
    shortName: "HIL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/55/Al_Hilal_SFC_Logo.svg",
    formation: "4-2-3-1",
    form: ['W', 'W', 'W', 'W', 'W'],
    manager: "جورجي جيسوس",
    notes: ["ضغط عالي من البداية", "تحركات العرضية لميتروفيتش", "الاعتماد على الكرات البينية"],
    commentaryPoints: [
      "الهلال يسعى لتعزيز الصدارة.",
      "سالم الدوسري في أفضل حالاته الفنية اليوم.",
      "تراجع بدني ملحوظ في خط الدفاع بالدقائق الأخيرة."
    ],
    players: [
      // الأساسيين
      { id: 'h1', avatar: 'https://img.btolat.com/playerslogo/169962.png?v=633', name: 'ياسين بونو', number: 37, category: 'Goalkeeper', subRole: 'GK', status: 'Starter', stats: { goals: 0, assists: 0, passes: 32 }, nationality: 'Morocco', birthDate: '1991-04-05' },
      { id: 'h2', avatar: 'https://img.btolat.com/playerslogo/404978.png?v=997', name: 'علي العوجامي', number: 78, category: 'Defense', subRole: 'LB', status: 'Starter', stats: { goals: 0, assists: 2, passes: 48 }, nationality: 'Saudi Arabia', birthDate: '1996-04-24' },
      { id: 'h3', avatar: 'https://img.btolat.com/playerslogo/139596.png?v=778', name: 'كوليبالي', number: 3, category: 'Defense', subRole: 'LCB', status: 'Starter', stats: { goals: 1, assists: 0, passes: 88 }, nationality: 'Senegal', birthDate: '1991-06-20' },
      { id: 'h4', avatar: 'https://img.btolat.com/playerslogo/414800.png?v=225', name: 'علي البليهي', number: 5, category: 'Defense', subRole: 'RCB', status: 'Starter', stats: { goals: 0, assists: 0, passes: 75 }, nationality: 'Saudi Arabia', birthDate: '1989-11-21' },
      { id: 'h5', avatar: 'https://img.btolat.com/playerslogo/161784.png?v=104', name: 'جواو كانسيلو', number: 20, category: 'Defense', subRole: 'RB', status: 'Starter', stats: { goals: 0, assists: 1, passes: 65 }, nationality: 'Portugal', birthDate: '1994-05-27' },
      { id: 'h6', avatar: 'https://img.btolat.com/playerslogo/270474.png?v=948', name: 'روبن نيفيز', number: 8, category: 'Midfield', subRole: 'LDM', status: 'Starter', stats: { goals: 2, assists: 9, passes: 98 }, nationality: 'Portugal', birthDate: '1997-03-13' },
      { id: 'h7', avatar: 'https://img.btolat.com/playerslogo/299106.png?v=239', name: 'سافيتش', number: 22, category: 'Midfield', subRole: 'RDM', status: 'Starter', stats: { goals: 8, assists: 7, passes: 62 }, nationality: 'Serbia', birthDate: '1995-02-27' },
      { id: 'h8', avatar: 'https://img.btolat.com/playerslogo/333697.png?v=376', name: 'مالكوم', number: 10, category: 'Midfield', subRole: 'LM', status: 'Starter', stats: { goals: 14, assists: 8, passes: 42 }, nationality: 'Brazil', birthDate: '1997-02-26' },
      { id: 'h9', avatar: 'https://img.btolat.com/playerslogo/197872.png?v=828', name: 'سالم الدوسري', number: 29, category: 'Midfield', subRole: 'CAM', isCaptain: true, status: 'Starter', stats: { goals: 12, assists: 11, passes: 56 }, nationality: 'Saudi Arabia', birthDate: '1991-08-19' },
      { id: 'h10', avatar: 'https://img.btolat.com/playerslogo/760565.png?v=439', name: 'محمد القحطاني', number: 15, category: 'Midfield', subRole: 'RM', status: 'Starter', stats: { goals: 5, assists: 12, passes: 38 }, nationality: 'Saudi Arabia', birthDate: '2002-07-23' },
      { id: 'h11', avatar: 'https://img.btolat.com/playerslogo/516682.png?v=330', name: 'داروين نونيز', number: 7, category: 'Attack', subRole: 'ST', status: 'Starter', stats: { goals: 28, assists: 3, passes: 22 }, nationality: 'Uruguay', birthDate: '1999-06-24' },

      // الاحتياطيين
      { id: 'h12', avatar: 'https://img.btolat.com/playerslogo/538994.png?v=201', name: 'عبدالله المعيوف', number: 1, category: 'Goalkeeper', subRole: 'GK', status: 'Substitute', stats: { goals: 0, assists: 0, passes: 10 }, nationality: 'Saudi Arabia', birthDate: '1987-04-10' },
      { id: 'h13', avatar: 'https://img.btolat.com/playerslogo/401210.png?v=201', name: 'محمد البريك', number: 2, category: 'Defense', subRole: 'LB', status: 'Substitute', stats: { goals: 0, assists: 0, passes: 12 }, nationality: 'Saudi Arabia', birthDate: '1990-08-05' },
      { id: 'h14', avatar: 'https://img.btolat.com/playerslogo/399987.png?v=201', name: 'محمد كنو', number: 14, category: 'Midfield', subRole: 'CM', status: 'Substitute', stats: { goals: 1, assists: 1, passes: 20 }, nationality: 'Saudi Arabia', birthDate: '1993-07-10' },
      { id: 'h15', avatar: 'https://img.btolat.com/playerslogo/400120.png?v=201', name: 'محمد الشلهوب', number: 16, category: 'Midfield', subRole: 'CAM', status: 'Substitute', stats: { goals: 0, assists: 2, passes: 18 }, nationality: 'Saudi Arabia', birthDate: '1981-02-08' },
      { id: 'h16', avatar: 'https://img.btolat.com/playerslogo/402001.png?v=201', name: 'كايكي', number: 17, category: 'Attack', subRole: 'ST', status: 'Substitute', stats: { goals: 2, assists: 0, passes: 8 }, nationality: 'Brazil', birthDate: '1992-11-05' }
    ]
  },
  awayTeam: {
    id: 'nassr-1',
    name: "نادي النصر",
    shortName: "NSR",
    logo: "https://upload.wikimedia.org/wikipedia/ar/thumb/6/6d/Al-Nassr_FC_%282025%29.svg/1280px-Al-Nassr_FC_%282025%29.svg.png",
    formation: "4-2-3-1",
    form: ['W', 'W', 'D', 'W', 'W'],
    manager: "ستيفانو بيولي",
    notes: ["تركيز على المرتدات", "استغلال سرعات ساديو ماني", "تحرير رونالدو في الصندوق"],
    commentaryPoints: [
      "النصر بحاجة للفوز لتقليص الفارق.",
      "رونالدو سجل 3 أهداف في آخر مواجهتين ديربي.",
      "تغيير تكتيكي متوقع في الشوط الثاني بدخول تاليسكا."
    ],
    players: [
      // الأساسيين
      { id: 'a1', avatar: 'https://img.btolat.com/playerslogo/599782.png?v=84', name: 'بينتو', number: 24, category: 'Goalkeeper', subRole: 'GK', status: 'Starter', stats: { goals: 0, assists: 0, passes: 25 }, nationality: 'Brazil', birthDate: '1999-06-10' },
      { id: 'a2', avatar: 'https://img.btolat.com/playerslogo/332554.png?v=605', name: 'سلطان الغنام', number: 2, category: 'Defense', subRole: 'RB', status: 'Starter', stats: { goals: 2, assists: 8, passes: 55 }, nationality: 'Saudi Arabia', birthDate: '1994-05-06' },
      { id: 'a3', avatar: 'https://img.btolat.com/playerslogo/146693.png?v=764', name: 'ايينيجو مارتينيز', number: 26, category: 'Defense', subRole: 'LCB', status: 'Starter', stats: { goals: 2, assists: 1, passes: 82 }, nationality: 'Spain', birthDate: '1991-05-17' },
      { id: 'a4', avatar: 'https://img.btolat.com/playerslogo/518049.png?v=0', name: 'سيماكان', number: 3, category: 'Defense', subRole: 'RCB', status: 'Starter', stats: { goals: 0, assists: 0, passes: 45 }, nationality: 'France', birthDate: '2000-05-03' },
      { id: 'a5', avatar: 'https://img.btolat.com/playerslogo/538526.png?v=626', name: 'علي الحسن', number: 19, category: 'Midfield', subRole: 'LDM', status: 'Starter', stats: { goals: 6, assists: 8, passes: 68 }, nationality: 'Saudi Arabia', birthDate: '1997-03-04' },
      { id: 'a6', avatar: 'https://img.btolat.com/playerslogo/137619.png?v=630', name: 'بروزوفيتش', number: 77, category: 'Midfield', subRole: 'RDM', status: 'Starter', stats: { goals: 3, assists: 12, passes: 102 }, nationality: 'Croatia', birthDate: '1992-11-16' },
      { id: 'a7', avatar: 'https://img.btolat.com/playerslogo/201602.png?v=875', name: 'ماني', number: 10, category: 'Midfield', subRole: 'LM', status: 'Starter', stats: { goals: 10, assists: 9, passes: 41 }, nationality: 'Senegal', birthDate: '1992-04-10' },
      { id: 'a8', avatar: 'https://img.btolat.com/playerslogo/686841.png?v=379', name: 'سعد الناصر', number: 96, category: 'Midfield', subRole: 'CAM', status: 'Starter', stats: { goals: 16, assists: 4, passes: 32 }, nationality: 'Saudi Arabia', birthDate: '2001-01-08' },
      { id: 'a9', avatar: 'https://img.btolat.com/playerslogo/465475.png?v=368', name: 'غريب', number: 29, category: 'Midfield', subRole: 'RM', status: 'Starter', stats: { goals: 4, assists: 11, passes: 45 }, nationality: 'Saudi Arabia', birthDate: '1997-03-31' },
      { id: 'a10', avatar: 'https://img.btolat.com/playerslogo/634114.png?v=318', name: 'ايمن يحى', number: 23, category: 'Attack', subRole: 'RW', status: 'Starter', stats: { goals: 4, assists: 11, passes: 45 }, nationality: 'Saudi Arabia', birthDate: '2001-05-05' },
      { id: 'a11', avatar: 'https://img.btolat.com/playerslogo/382.png?v=236', name: 'رونالدو', number: 7, category: 'Attack', subRole: 'ST', isCaptain: true, status: 'Starter', stats: { goals: 35, assists: 11, passes: 28 }, nationality: 'Portugal', birthDate: '1985-02-05' },

      // الاحتياطيين
      { id: 'a12', avatar: 'https://img.btolat.com/playerslogo/123456.png?v=1', name: 'فواز القرني', number: 1, category: 'Goalkeeper', subRole: 'GK', status: 'Substitute', stats: { goals: 0, assists: 0, passes: 5 }, nationality: 'Saudi Arabia', birthDate: '1989-01-01' },
      { id: 'a13', avatar: 'https://img.btolat.com/playerslogo/654321.png?v=1', name: 'عبدالله مادو', number: 12, category: 'Defense', subRole: 'LB', status: 'Substitute', stats: { goals: 0, assists: 1, passes: 10 }, nationality: 'Saudi Arabia', birthDate: '1990-02-02' },
      { id: 'a14', avatar: 'https://img.btolat.com/playerslogo/789012.png?v=1', name: 'أحمد الفريدي', number: 14, category: 'Midfield', subRole: 'CM', status: 'Substitute', stats: { goals: 1, assists: 0, passes: 15 }, nationality: 'Saudi Arabia', birthDate: '1992-03-03' },
      { id: 'a15', avatar: 'https://img.btolat.com/playerslogo/345678.png?v=1', name: 'نواف العابد', number: 16, category: 'Midfield', subRole: 'CAM', status: 'Substitute', stats: { goals: 0, assists: 2, passes: 12 }, nationality: 'Saudi Arabia', birthDate: '1991-04-04' },
      { id: 'a16', avatar: 'https://img.btolat.com/playerslogo/567890.png?v=1', name: 'إلتون خوزيه', number: 17, category: 'Attack', subRole: 'ST', status: 'Substitute', stats: { goals: 2, assists: 0, passes: 9 }, nationality: 'Brazil', birthDate: '1993-05-05' }
    ]
  },
  events: []
};
