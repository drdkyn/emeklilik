import { calculateRetirementOptionsDB } from './calculator-db';

export interface CalculationResult {
  age: number;
  serviceYears: number;
  days: number;
  results: Array<{
    name: string;
    type: string;
    uygun: boolean;
    kosullar: any[];
  }>;
  normal: { uygun: boolean; kosullar: any[] }[];
  yastan: { uygun: boolean; kosullar: any[] }[];
  maluluk: { uygun: boolean; kosullar: any[] }[];
}

function calculateAge(birthDate: Date, referenceDate: Date): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateServiceYears(startDate: Date, referenceDate: Date): number {
  let years = referenceDate.getFullYear() - startDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < startDate.getDate())) {
    years--;
  }
  return years;
}

export function calculateRetirement(
  birthDateStr: string,
  entryDateStr: string,
  gender: 'erkek' | 'kadin',
  status: string,
  premiumDays: number,
  malulukInfo?: { type: 'sk284' | 'sk285'; degree?: string }
): CalculationResult {
  // Parse dates
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('.').map(Number);
    if (!day || !month || !year) throw new Error('Geçersiz tarih formatı');
    return new Date(year, month - 1, day);
  };

  const birthDate = parseDate(birthDateStr);
  const entryDate = parseDate(entryDateStr);
  const today = new Date();

  // Calculate metrics
  const age = calculateAge(birthDate, today);
  const serviceYears = calculateServiceYears(entryDate, today);

  // Call new calculator
  const results = calculateRetirementOptionsDB({
    status: status as '4a' | '4b' | '4c' | '2925',
    dogumTarihi: birthDate,
    cinsiyet: gender,
    ilkGirisTarihi: entryDate,
    priGunu: premiumDays,
    borçlanmaOption: 'dahil', // Eski format için default
    borçlanmaGunu: 0,
    askerlikGunu: 0,
    askerlikNedir: 'sonra',
    malulukTuru: malulukInfo ? malulukInfo.type : 'yok',
    derece: malulukInfo?.degree || null,
    malulTarihi: null,
  });

  // Organize by type
  const normal: any[] = [];
  const yastan: any[] = [];
  const maluluk: any[] = [];

  for (const res of results) {
    const item = { uygun: res.uygun, kosullar: res.kosullar };
    if (res.type === 'normal') normal.push(item);
    else if (res.type === 'age') yastan.push(item);
    else if (res.type === 'disability') maluluk.push(item);
  }

  return {
    age,
    serviceYears,
    days: premiumDays,
    results,
    normal,
    yastan,
    maluluk,
  };
}
