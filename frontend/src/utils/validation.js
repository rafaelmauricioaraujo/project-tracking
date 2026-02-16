export const required = (value) =>
  value && value.trim() ? undefined : 'This field is required';

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const endDateAfterStartDate = (endDate, startDate) => {
  if (!endDate || !startDate) return undefined;
  return new Date(endDate) > new Date(startDate)
    ? undefined
    : 'End date must be after start date';
};
