const PLAN_START = "2026-10";
const PLAN_END = "2031-04";
// Two responsive gantt bands, each using a proportional month scale.

// 2028年2月の高校入試は固定したまま、進学までの学年を正しくつなぐ。
const stageInfo = {
  p1: { label: "ステージ 1", shortLabel: "St1", title: "現在地の確認・ワンフェス発表・基礎の再編", period: "2026年10月", color: "#087F5B", bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46" },
  p2: { label: "ステージ 2", shortLabel: "St2", title: "音声・MIDIプロトタイプと中2の学び直し", period: "2026年11月〜2027年3月", color: "#B45309", bg: "#FFFBEB", border: "#FCD34D", text: "#92400E" },
  p3: { label: "ステージ 3", shortLabel: "St3", title: "中3前半：作品開発・学校学習・受験基礎", period: "2027年4〜7月", color: "#1D4ED8", bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF" },
  p4: { label: "ステージ 4", shortLabel: "St4", title: "高校受験準備と音楽・開発の継続", period: "2027年8月〜2028年2月", color: "#B91C1C", bg: "#FEF2F2", border: "#FCA5A5", text: "#7F1D1D" },
  p5: { label: "ステージ 5", shortLabel: "St5", title: "高校進学・軽音と制作活動の本格化", period: "2028年3月〜2029年3月", color: "#6D28D9", bg: "#F5F3FF", border: "#C4B5FD", text: "#5B21B6" },
  p6: { label: "ステージ 6", shortLabel: "St6", title: "高校2年：作品・基礎学力・進路条件の確認", period: "2029年4月〜2030年3月", color: "#0E7490", bg: "#ECFEFF", border: "#67E8F9", text: "#155E75" },
  p7: { label: "ステージ 7", shortLabel: "St7", title: "高校3年：作品・出願・選抜方式別の準備", period: "2030年4月〜2031年3月", color: "#BE185D", bg: "#FDF2F8", border: "#F9A8D4", text: "#9D174D" },
  p8: { label: "ステージ 8", shortLabel: "St8", title: "進学・次の制作環境へ（進学先は本人と相談）", period: "2031年4月", color: "#334155", bg: "#F1F5F9", border: "#94A3B8", text: "#1E293B" }
};
const stageDateRanges = {
  p1: { start: "2026-10", end: "2026-10" },
  p2: { start: "2026-11", end: "2027-03" },
  p3: { start: "2027-04", end: "2027-07" },
  p4: { start: "2027-08", end: "2028-02" },
  p5: { start: "2028-03", end: "2029-03" },
  p6: { start: "2029-04", end: "2030-03" },
  p7: { start: "2030-04", end: "2031-03" },
  p8: { start: "2031-04", end: "2031-04" }
};
const getMonthOffset = (dateStr, base = PLAN_START) => {
  if (!dateStr) return 0;
  const [year, month] = dateStr.split("-").map(Number);
  const [baseYear, baseMonth] = base.split("-").map(Number);
  return (year - baseYear) * 12 + month - baseMonth;
};
const makeMonthRange = (start, end) => {
  const [startYear, startMonth] = start.split("-").map(Number);
  const count = getMonthOffset(end, start) + 1;
  return Array.from({ length: count }, (_, index) => {
    const year = startYear + Math.floor((startMonth - 1 + index) / 12);
    const month = (startMonth - 1 + index) % 12 + 1;
    return { date: String(year) + "-" + String(month).padStart(2, "0"),
      year, m: month, label: month === 1 ? String(year).slice(2) + "/1" : String(month) };
  });
};
const GANTT_ROWS = [
  { title: "2026年10月〜2028年12月", start: "2026-10", end: "2028-12", months: makeMonthRange("2026-10", "2028-12") },
  { title: "2029年1月〜2031年4月", start: "2029-01", end: "2031-04", months: makeMonthRange("2029-01", "2031-04") }
];
const allGanttMonthLabels = makeMonthRange(PLAN_START, PLAN_END);
const TOTAL_GANTT_MONTHS = allGanttMonthLabels.length;

const checkIsCurrentStage = (sKey, targetDate = new Date()) => {
  const range = stageDateRanges[sKey];
  if (!range) return false;
  const targetOffset = getMonthOffset(`${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`);
  const startOff = getMonthOffset(range.start);
  const endOff = getMonthOffset(range.end);
  return targetOffset >= startOff && targetOffset <= endOff;
};

const checkIsCurrentTimeSlot = (timeRangeStr, targetDate = new Date()) => {
  if (!timeRangeStr || !timeRangeStr.includes("〜")) return false;
  const parts = timeRangeStr.split("〜");
  const parseMin = (s) => {
    const p = s.trim().split(":");
    if (p.length < 2) return null;
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  };
  const startMin = parseMin(parts[0]);
  let endMin = parseMin(parts[1]);
  if (startMin === null) return false;
  const curMin = targetDate.getHours() * 60 + targetDate.getMinutes();
  if (endMin === null) return Math.abs(curMin - startMin) < 15;
  return curMin >= startMin && curMin < endMin;
};

const isCurrentMonth = (yrStr, mStr, targetDate = new Date()) => {
  if (!yrStr || !mStr) return false;
  const curY = `${targetDate.getFullYear()}年`;
  const curM = `${targetDate.getMonth() + 1}月`;
  return yrStr.includes(curY) && (mStr === curM || mStr.startsWith(curM));
};

