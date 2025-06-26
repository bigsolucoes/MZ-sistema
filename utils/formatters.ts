
export const formatCurrency = (value: number, isConfidential: boolean, currencySymbol: string = 'R$'): string => {
  if (isConfidential) {
    return `${currencySymbol} •••••`;
  }
  return `${currencySymbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Use Intl.DateTimeFormat for more robust handling of options, including timeStyle
  const defaultOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  try {
    // Check if dateObj is valid before formatting
    if (isNaN(dateObj.getTime())) {
      // console.warn("formatDate called with an invalid date:", date);
      return "Invalid Date"; // Return a string representation for invalid dates
    }
    return new Intl.DateTimeFormat('pt-BR', options || defaultOptions).format(dateObj);
  } catch (e) {
    console.error("Error formatting date with provided options, falling back to default:", e);
    // Fallback attempt, ensure it still handles potentially invalid dateObj gracefully
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(dateObj);
  }
};

export const getYYYYMMDDString = (dateSource: Date | string | undefined): string => {
  if (!dateSource) {
    return '';
  }
  try {
    // formatDate by default uses { day: '2-digit', month: '2-digit', year: 'numeric' }
    // which for 'pt-BR' gives "DD/MM/YYYY"
    const formattedDisplayDate = formatDate(dateSource); 

    if (typeof formattedDisplayDate !== 'string') {
      // This case should ideally not happen if formatDate adheres to its signature and fixes.
      console.warn('getYYYYMMDDString: formatDate did not return a string for', dateSource);
      return '';
    }

    // If formatDate returns "Invalid Date" string, splitting will result in parts=["Invalid Date"]
    const parts = formattedDisplayDate.split('/');
    if (parts.length === 3) {
      // parts is [DD, MM, YYYY] for "DD/MM/YYYY"
      // Ensure parts look like date components (simple check)
      if (parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Construct YYYY-MM-DD
      }
    }
    // Handles "Invalid Date" (parts=["Invalid Date"]) or other unexpected formats not convertible to YYYY-MM-DD
    return '';
  } catch (error) {
    // Catch errors from .split or other operations if formatDate returns unexpected string
    console.error('Error in getYYYYMMDDString converting date:', dateSource, error);
    return '';
  }
};
