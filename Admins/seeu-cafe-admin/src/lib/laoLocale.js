export const laoLocale = {
  code: "lo",
  formatDistance: () => "",
  formatLong: {
    date: () => "",
    time: () => "",
    dateTime: () => "",
  },
  formatRelative: () => "",
  localize: {
    ordinalNumber: () => "",
    era: () => "",
    quarter: () => "",
    month: (month) => {
      const months = [
        "ມັງກອນ",
        "ກຸມພາ",
        "ມີນາ",
        "ເມສາ",
        "ພຶດສະພາ",
        "ມິຖຸນາ",
        "ກໍລະກົດ",
        "ສິງຫາ",
        "ກັນຍາ",
        "ຕຸລາ",
        "ພະຈິກ",
        "ທັນວາ",
      ];
      return months[month];
    },
    day: (day) => {
      const days = ["ອາທິດ", "ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ"];
      return days[day];
    },
    dayPeriod: () => "",
  },
  match: {
    ordinalNumber: () => 0,
    era: () => 0,
    quarter: () => 0,
    month: () => 0,
    day: () => 0,
    dayPeriod: () => 0,
  },
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1,
  },
};
