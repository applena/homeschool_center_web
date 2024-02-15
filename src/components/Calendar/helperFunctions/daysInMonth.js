function daysInMonth(month, year){
  const isLeapYear = calculateLeapYear(year);
  const monthToDays ={
    'January': 31,
    'February': isLeapYear ? 29 : 28,
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31
  }
  return monthToDays[month];
}

const calculateLeapYear =(year)=>{
  if(year%4 === 0 && year%100 !== 0)return true;
  if(year%4 === 0 && year%100 === 0 && year%400 === 0) return true;
  return false;
} 

export default daysInMonth;