export const PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: null,
  totalRecord: 0,
};

export const STORAGE_KEY = {
  PERMISSION: "PERMISSION",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  TOKEN: "TOKEN",
  TASKS: "TASKS",
  USER: "USER",
};
export const FORMAT_DATE = "DD-MM-YYYY";
export const FORMAT_DATETIME = "DD-MM-YYYY HH:mm";
export const FORMAT_MINUTE = "HH:mm";
export const FORMAT_INPUT_DATE = "YYYY-MM-DD";
export const FILE_EXTENSION = {
  WORD: [".doc", ".docm", ".docx", ".dot", ".dotm", ".dotx"],
  EXCEL: [
    ".xlsx",
    ".xlsm",
    ".xlsb",
    ".xltx",
    ".xltm",
    ".xls",
    ".xlt",
    ".xls",
    ".xlam",
    ".xla",
    ".xlw",
    ".xlr",
  ],
  XML: [".xml"],
  TEXT: [".txt"],
  PDF: [".pdf"],
  IMAGE: [".jpg", ".jpeg", ".png", ".gif"],
  FOLDER: "FOLDER",
};

export const frequencyOptions = {
  Days: "Days",
  Weeks: "Weeks",
  Months: "Months",
  Years: "Years",
  Option: [
    {
      label: "Days",
      value: 1,
    },
    {
      label: "Weeks",
      value: 2,
    },
    {
      label: "Months",
      value: 3,
    },
    {
      label: "Years",
      value: 4,
    },
  ],
};

export const additionalInfoType = {
  OneLine: "OneLine",
  Multiplelines: "Multiplelines",
  Option: [
    { label: "One Line", value: 1 },
    { label: "Multiple lines", value: 2 },
  ],
};

export const priorityType = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Option: [
    {
      label: "constant.priorityType.high",
      value: "High",
      color: "#ff4d4f",
    },
    {
      label: "constant.priorityType.medium",
      value: "Medium",
      color: "#faad14",
    },
    {
      label: "constant.priorityType.low",
      value: "Low",
      color: "#52c41a",
    },
  ],
};

export const formatFloat = (number, decimals = 2) => {
  if (typeof number !== "number") return "0.00";
  return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const weekDaysOptions = [
  { label: "Thứ 2", value: "Monday" },
  { label: "Thứ 3", value: "Tuesday" },
  { label: "Thứ 4", value: "Wednesday" },
  { label: "Thứ 5", value: "Thursday" },
  { label: "Thứ 6", value: "Friday" },
  { label: "Thứ 7", value: "Saturday" },
  { label: "Chủ nhật", value: "Sunday" },
];

export const dateType = {
  days: "days",
  weeks: "weeks",
  months: "months",
  years: "years",
  Options: [
    {
      label: "Days",
      value: "days",
    },
    {
      label: "Weeks",
      value: "weeks",
    },
    {
      label: "Months",
      value: "months",
    },
    {
      label: "Years",
      value: "years",
    },
  ],
};

export const notificationStatus = {
  all: "all",
  read: "read",
  unread: "unread",
  Options: [
    { label: "notification.all", value: "all" },
    { label: "notification.unread", value: "unread" },
    { label: "notification.read", value: "read" },
  ],
};

export const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".json",
  ".mp4",
];

export const notificationTypeCode = {};
