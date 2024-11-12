import { format, parseISO, isValid, startOfDay } from 'date-fns';

export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatString) : '';
};

export const formatDateTime = (date, formatString = 'yyyy-MM-dd HH:mm') => {
  return formatDate(date, formatString);
};

export const isValidDate = (date) => {
  if (!date) return false;
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate);
};

export const compareDates = (date1, date2) => {
  const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  if (!isValid(parsedDate1) || !isValid(parsedDate2)) {
    throw new Error('Invalid date provided');
  }

  return parsedDate1.getTime() - parsedDate2.getTime();
};

export const isSameDay = (date1, date2) => {
  const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  if (!isValid(parsedDate1) || !isValid(parsedDate2)) {
    throw new Error('Invalid date provided');
  }

  return startOfDay(parsedDate1).getTime() === startOfDay(parsedDate2).getTime();
};

export const parseISODate = (dateString) => {
  return parseISO(dateString);
};

export const getCurrentDate = () => {
  return new Date().toISOString();
};