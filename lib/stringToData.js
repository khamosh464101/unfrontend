const options = {
  day: "2-digit",
  month: "short", // Abbreviated month (e.g., 'Dec')
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false, // 24-hour format
};

const stringToDate = (sdate) => {
  const date = new Date(sdate);
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  const finalDate = formattedDate.replace(",", " -");
  return finalDate;
};

export default stringToDate;
