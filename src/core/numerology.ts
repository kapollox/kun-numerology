// Pythagoras map + TR normalization
const MAP: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const TR = new Map(Object.entries({
  Ç:'C', Ğ:'G', İ:'I', I:'I', Ö:'O', Ş:'S', Ü:'U',
  ç:'C', ğ:'G', ı:'I', i:'I', ö:'O', ş:'S', ü:'U'
}));
export const MASTER = new Set([11,22,33]);
const VOWELS = new Set(['A','E','I','İ','O','Ö','U','Ü']);

export const normalize = (ch: string) => {
  const repl = TR.get(ch);
  return (repl ?? ch).toUpperCase();
};
export const letterValue = (ch: string) => MAP[normalize(ch)] ?? 0;

export const digitSum = (n: number) =>
  `${Math.abs(Math.trunc(n))}`.split('').reduce((a,d)=>a+Number(d),0);

// 2 haneli ay/gün için yardımcı (UTC hatasını önlemek amaçlı YYYYMMDD’yi kendimiz kuracağız)
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function reduceNumber(n: number, keepMaster=true): number {
  while (n > 9) {
    if (keepMaster && MASTER.has(n)) return n;
    n = digitSum(n);
  }
  return n;
}

export const onlyLetters = (s: string) =>
  s.split('').filter(c => /[A-Za-zÇĞİIÖŞÜçğıiöşü]/.test(c)).join('');

export function splitVowelsConsonants(name: string) {
  const letters = onlyLetters(name).split('');
  const vowels = letters.filter(c => VOWELS.has(normalize(c))).join('');
  const consonants = letters.filter(c => !VOWELS.has(normalize(c))).join('');
  return { vowels, consonants };
}

export function nameValue(s: string, keepMaster=true) {
  const comp = onlyLetters(s).split('').reduce((a,c)=>a+letterValue(c),0);
  return { compound: comp, reduced: reduceNumber(comp, keepMaster) };
}

function parseBirthdate(s: string): Date {
  const ymd = /^\d{4}[-.\/]\d{2}[-.\/]\d{2}$/;
  const dmy = /^(\d{2})[.\/-](\d{2})[.\/-](\d{4})$/;
  if (ymd.test(s)) {
    const [y, m, d] = s.split(/[.\/-]/).map(Number);
    return new Date(y, m-1, d);
  }
  const m = s.match(dmy);
  if (m) {
    const [, d, mo, y] = m;
    return new Date(Number(y), Number(mo)-1, Number(d));
  }
  throw new Error('Tarih biçimi anlaşılamadı. Örnek: 2000-07-21 veya 21.07.2000');
}

export function lifePathFromDate(dateStr: string, keepMaster=true) {
  const d = parseBirthdate(dateStr);
  // UTC'ye çevirmek yok; yerel alanlardan YYYYMMDD dizisini kendimiz kuruyoruz
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const digits = `${y}${pad2(m)}${pad2(day)}`;
  const comp = digits.split('').reduce((a,c)=>a+Number(c),0);
  return { compound: comp, reduced: reduceNumber(comp, keepMaster) };
}

export function birthdayNumber(dateStr: string, keepMaster=true) {
  const d = parseBirthdate(dateStr);
  const day = d.getDate();
  return { compound: day, reduced: reduceNumber(day, keepMaster) };
}

export function maturityNumber(lpReduced: number, exprReduced: number, keepMaster=true) {
  const comp = lpReduced + exprReduced;
  return { compound: comp, reduced: reduceNumber(comp, keepMaster) };
}

export function personalYear(dateStr: string, year: number, keepMaster=true) {
  const d = parseBirthdate(dateStr);
  const universal = `${year}`.split('').reduce((a,c)=>a+Number(c),0);
  const comp = (d.getMonth()+1) + d.getDate() + universal;
  return { compound: comp, reduced: reduceNumber(comp, keepMaster) };
}

/** 🔥 Zirve (Pinnacles) & Mücadele (Challenges)
 *  - Pinnacles: tek haneye indirgenmiş toplamlar (master korunabilir)
 *  - Challenges: tek haneye indirgenmiş mutlak farklar (master KORUNMAZ → tek hane 0–8)
 */
export function pinnaclesAndChallenges(dateStr: string, keepMaster=true) {
  const d = parseBirthdate(dateStr)
  const day   = reduceNumber(d.getDate(), keepMaster)
  const month = reduceNumber(d.getMonth() + 1, keepMaster)
  const year  = reduceNumber(d.getFullYear(), keepMaster)

  // Zirveler
  const p1 = reduceNumber(day + month, keepMaster)
  const p2 = reduceNumber(day + year,  keepMaster)
  const p3 = reduceNumber(p1 + p2,     keepMaster)
  const p4 = reduceNumber(month + year,keepMaster)

  // Mücadeleler (mutlak fark) → her zaman tek hane (master yok)
  const c1 = reduceNumber(Math.abs(day - month), false)
  const c2 = reduceNumber(Math.abs(day - year),  false)
  const c3 = reduceNumber(Math.abs(c1 - c2),     false)
  const c4 = reduceNumber(Math.abs(month - year),false)

  return {
    pinnacles: [p1, p2, p3, p4],
    challenges: [c1, c2, c3, c4]
  }
}

export function missingNumbers(name: string): number[] {
  const counts: Record<number, number> = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
  for (const ch of onlyLetters(name)) {
    const v = letterValue(ch);
    if (v >=1 && v <= 9) counts[v] += 1;
  }
  return Object.entries(counts).filter(([,v]) => v === 0).map(([k]) => Number(k));
}

export function computeAll(name: string, birthdate: string, keepMaster=true) {
  const clean = onlyLetters(name);
  const expr = nameValue(clean, keepMaster);
  const { vowels, consonants } = splitVowelsConsonants(clean);
  const hd = nameValue(vowels, keepMaster);
  const pers = nameValue(consonants, keepMaster);
  const lp = lifePathFromDate(birthdate, keepMaster);
  const bday = birthdayNumber(birthdate, keepMaster);
  const mat = maturityNumber(lp.reduced, expr.reduced, keepMaster);
  const year = new Date().getFullYear();
  const py = personalYear(birthdate, year, keepMaster);

  const karmic: number[] = [];
  for (const c of [expr.compound, hd.compound, pers.compound, lp.compound, bday.compound, mat.compound]) {
    if ([13,14,16,19].includes(c)) karmic.push(c);
  }
  const missing = missingNumbers(clean);

  // ➕ Zirve & Mücadele
  const { pinnacles, challenges } = pinnaclesAndChallenges(birthdate, keepMaster);

  return {
    name, birthdate, system: 'pythagoras', keep_master: keepMaster,
    expression_compound: expr.compound, expression: expr.reduced,
    heart_desire_compound: hd.compound, heart_desire: hd.reduced,
    personality_compound: pers.compound, personality: pers.reduced,
    life_path_compound: lp.compound, life_path: lp.reduced,
    birthday_compound: bday.compound, birthday: bday.reduced,
    maturity_compound: mat.compound, maturity: mat.reduced,
    personal_year_compound: py.compound, personal_year: py.reduced,
    karmic_debts: karmic,
    missing_numbers_list: missing,

    // yeni alanlar
    pinnacles,
    challenges,
  };
}
