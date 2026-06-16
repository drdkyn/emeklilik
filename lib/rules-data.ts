// ════════════════════════════════════════════════════════════════════════════════
// STATİK EMEKLİLİK KURALLARI
// SQLite yerine build-time'da gömülen statik veri (Vercel serverless uyumlu)
// Kaynak: Excel (4a2, 4b2 sayfaları) — seed.js ile aynı kurallar
// ════════════════════════════════════════════════════════════════════════════════

export interface RetirementRule {
  status: string;       // 4a, 4b, 4c, 2925
  type: string;         // normal, age, disability
  name: string;
  dateFrom: string;     // YYYY-MM-DD
  dateTo: string;       // YYYY-MM-DD
  serviceYears: number | null;
  days: number | null;
  ageWoman: number | null;
  ageMan: number | null;
  degree: string | null;
  notes: string | null;
}

function rule(
  status: string,
  type: string,
  name: string,
  dateFrom: string,
  dateTo: string,
  serviceYears: number | null,
  days: number | null,
  ageWoman: number | null,
  ageMan: number | null,
  degree: string | null = null,
  notes: string | null = null
): RetirementRule {
  return { status, type, name, dateFrom, dateTo, serviceYears, days, ageWoman, ageMan, degree, notes };
}

const rules: RetirementRule[] = [];

// ════════════════════════════════════════════════════════════════════════════════
// 4/a (SSK)
// ════════════════════════════════════════════════════════════════════════════════

// NORMAL — 08.09.1999 Öncesi (EYT)
rules.push(rule('4a', 'normal', '08.09.1999 Öncesi - Erkek', '1976-09-08', '1999-09-08', 25, 5000, null, 60, null, 'EYT'));
rules.push(rule('4a', 'normal', '08.09.1999 Öncesi - Kadın', '1981-09-08', '1999-09-08', 20, 5000, 58, null, null, 'EYT'));

// NORMAL — 09.09.1999-30.04.2008 (TAM)
rules.push(rule('4a', 'normal', '09.09.1999-30.04.2008 TAM', '1999-09-09', '2008-04-30', null, 7000, 58, 60, null, 'TAM'));

// NORMAL + YAŞTAN — 01.05.2008+ kademeli
for (let year = 2008; year <= 2050; year++) {
  const start = year === 2008 ? '2008-05-01' : `${year}-01-01`;
  const end = `${year + 2}-12-31`;
  let ageW = 58, ageM = 60;
  if (year > 2008) {
    ageW = Math.min(58 + Math.floor((year - 2008) / 2), 65);
    ageM = Math.min(60 + Math.floor((year - 2008) / 2), 65);
  }
  rules.push(rule('4a', 'normal', `01.05.2008+ TAM ${year}`, start, end, null, 9000, ageW, ageM));
  rules.push(rule('4a', 'age', `01.05.2008+ KISMİ ${year}`, start, end, null, 5400, Math.min(ageW + 3, 65), Math.min(ageM + 3, 65)));
}

// YAŞTAN — 08.09.1999 Öncesi
rules.push(rule('4a', 'age', '08.09.1999 Öncesi YAŞTAN', '1976-09-08', '2099-12-31', 15, 3600, 50, 55));

// MALÜLLÜK
rules.push(rule('4a', 'disability', 'SK 28/4 - İşe Başlamadan Malül', '2008-10-01', '2099-12-31', 15, 3960, null, null));
rules.push(rule('4a', 'disability', 'SK 28/5 %50-%59', '2015-01-01', '2099-12-31', 16, 4320, null, null, '%50-%59'));
rules.push(rule('4a', 'disability', 'SK 28/5 %40-%49', '2014-01-01', '2099-12-31', 18, 4680, null, null, '%40-%49'));
rules.push(rule('4a', 'disability', 'SK 28/5 %60+ (Ağır)', '2008-10-01', '2099-12-31', 10, 1800, null, null, '%60+', 'Bakıma muhtaç varsa 10 yıl şartı yok'));

// ════════════════════════════════════════════════════════════════════════════════
// 2925 (TARIM)
// ════════════════════════════════════════════════════════════════════════════════
rules.push(rule('2925', 'normal', '2925 08.09.1999 Öncesi', '1976-09-08', '1999-09-08', 15, 3600, null, null));
rules.push(rule('2925', 'normal', '2925 09.09.1999-30.04.2008', '1999-09-09', '2008-04-30', 15, 3600, 58, 60));
rules.push(rule('2925', 'normal', '2925 01.05.2008+', '2008-05-01', '2099-12-31', null, 7200, 58, 60));

// ════════════════════════════════════════════════════════════════════════════════
// 4/b (BAĞ-KUR)
// ════════════════════════════════════════════════════════════════════════════════

// NORMAL
rules.push(rule('4b', 'normal', '4b 08.09.1999 Öncesi', '1976-09-08', '1999-09-08', 20, 7200, null, null));
rules.push(rule('4b', 'normal', '4b 09.09.1999-30.04.2008 TAM', '1999-09-09', '2008-04-30', 25, 9000, 58, 60, null, 'TAM'));

// NORMAL + YAŞTAN — 01.05.2008+ kademeli
for (let year = 2008; year <= 2050; year++) {
  const start = year === 2008 ? '2008-05-01' : `${year}-01-01`;
  const end = `${year + 2}-12-31`;
  let ageW = 58, ageM = 60;
  if (year > 2008) {
    ageW = Math.min(58 + Math.floor((year - 2008) / 2), 65);
    ageM = Math.min(60 + Math.floor((year - 2008) / 2), 65);
  }
  rules.push(rule('4b', 'normal', `4b TAM ${year}`, start, end, null, 9000, ageW, ageM));
  rules.push(rule('4b', 'age', `4b KISMİ ${year}`, start, end, null, 5400, Math.min(ageW + 3, 65), Math.min(ageM + 3, 65)));
}

// YAŞTAN — sabit dönemler
rules.push(rule('4b', 'age', '4b YAŞTAN 08.09.1999 Öncesi', '1976-09-08', '1999-09-08', 15, 5400, 56, 58));
rules.push(rule('4b', 'age', '4b YAŞTAN 09.09.1999-30.04.2008', '1999-09-09', '2008-04-30', 15, 5400, 60, 62));

// MALÜLLÜK
rules.push(rule('4b', 'disability', '4b SK 28/4 - İşe Başlamadan Malül', '2008-10-01', '2099-12-31', 15, 3960, null, null));
rules.push(rule('4b', 'disability', '4b SK 28/5 %50-%59', '2008-10-01', '2099-12-31', 16, 4320, null, null, '%50-%59'));
rules.push(rule('4b', 'disability', '4b SK 28/5 %40-%49', '2008-10-01', '2099-12-31', 18, 4680, null, null, '%40-%49'));
rules.push(rule('4b', 'disability', '4b SK 28/5 %60+ (Ağır)', '2008-10-01', '2099-12-31', 10, 1800, null, null, '%60+', 'Bakıma muhtaç varsa 10 yıl şartı yok'));

// ════════════════════════════════════════════════════════════════════════════════

export const RETIREMENT_RULES = rules;

export function getRulesByStatus(status: string): RetirementRule[] {
  return rules
    .filter((r) => r.status === status)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return b.dateFrom.localeCompare(a.dateFrom); // dateFrom DESC
    });
}
