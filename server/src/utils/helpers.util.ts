export const slugify = (text: string | number): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/-+/g, '-');      // Replace multiple - with single -
};

export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `NX-${year}-${randomNum}`;
};

export const generateRepairNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `REP-${year}-${randomNum}`;
};
