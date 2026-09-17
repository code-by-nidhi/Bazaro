// Regex rules shared by the storefront, admin panel and server.
// Keep this file in sync with admin/src/utils/validators.js and server/utils/validators.js.

export const PATTERNS = {
  personName: /^[A-Za-z][A-Za-z .'-]{1,49}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
  phone: /^(\+91[\s-]?)?[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,32}$/,
  pincode: /^[1-9]\d{5}$/,
  place: /^[A-Za-z][A-Za-z .'-]{1,49}$/,
  addressLine: /^[A-Za-z0-9][A-Za-z0-9\s,.'/#&()-]{4,149}$/,
  landmark: /^[A-Za-z0-9][A-Za-z0-9\s,.'/#&()-]{2,99}$/,
  message: /^(?=[\s\S]*\S)[\s\S]{10,1000}$/,
  reviewComment: /^(?=[\s\S]*\S)[\s\S]{10,500}$/,
  couponCode: /^[A-Za-z0-9]{4,15}$/,
  productName: /^[A-Za-z0-9][A-Za-z0-9\s&.,'()/+%-]{2,99}$/,
  brand: /^[A-Za-z0-9][A-Za-z0-9\s&.'-]{1,49}$/,
  sku: /^(?=.{3,30}$)[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/,
  price: /^(0|[1-9]\d{0,7})(\.\d{1,2})?$/,
  integer: /^(0|[1-9]\d{0,6})$/,
  description: /^(?=[\s\S]*\S)[\s\S]{10,5000}$/,
  shortText: /^[^<>]{0,300}$/,
  url: /^https?:\/\/[^\s<>"']+\.[^\s<>"']+$/i,
  linkPath: /^(\/[A-Za-z0-9\-._~/?#=&%]*|https?:\/\/[^\s<>"']+)$/,
  categoryName: /^[A-Za-z][A-Za-z0-9\s&,'-]{1,49}$/,
  listItem: /^[A-Za-z0-9][A-Za-z0-9\s&/.'-]{0,29}$/,
  bannerTitle: /^[^<>]{3,80}$/,
  displayOrder: /^\d{1,3}$/,
  discountType: /^(percentage|fixed)$/,
  date: /^\d{4}-\d{2}-\d{2}/,
  rating: /^[1-5]$/,
  objectId: /^[a-f\d]{24}$/i,
  paymentMethod: /^(Razorpay|COD)$/,
};

export const HINTS = {
  personName: 'must be 2-50 letters (spaces, dots, apostrophes and hyphens allowed).',
  email: 'must be a valid email address, e.g. name@example.com.',
  phone: 'must be a valid 10-digit Indian mobile number starting with 6-9 (optional +91).',
  password: 'must be 8-32 characters with an uppercase letter, a lowercase letter, a number and a special character, and no spaces.',
  pincode: 'must be a valid 6-digit pincode that does not start with 0.',
  place: 'must be 2-50 letters.',
  addressLine: 'must be 5-150 characters (letters, numbers, spaces and , . \' / # & ( ) -).',
  landmark: 'must be 3-100 characters (letters, numbers, spaces and , . \' / # & ( ) -).',
  message: 'must be 10-1000 characters.',
  reviewComment: 'must be 10-500 characters.',
  couponCode: 'must be 4-15 letters or numbers with no spaces.',
  productName: 'must be 3-100 characters (letters, numbers, spaces and & . , \' ( ) / + % -).',
  brand: 'must be 2-50 characters (letters, numbers, spaces and & . \' -).',
  sku: 'must be 3-30 letters/numbers in groups separated by single hyphens, e.g. MEN-SHIRT-01.',
  price: 'must be a positive amount with at most 2 decimal places.',
  integer: 'must be a whole number of 0 or more.',
  description: 'must be 10-5000 characters.',
  shortText: 'must be at most 300 characters and cannot contain < or >.',
  url: 'must be a valid URL starting with http:// or https://.',
  linkPath: 'must be a path starting with / (e.g. /shop) or a full http(s) URL.',
  categoryName: 'must be 2-50 characters starting with a letter (letters, numbers, spaces and & , \' -).',
  listItem: 'must be a comma separated list; each item 1-30 characters (letters, numbers, spaces and & / . \' -).',
  bannerTitle: 'must be 3-80 characters and cannot contain < or >.',
  displayOrder: 'must be a whole number between 0 and 999.',
  discountType: 'must be either percentage or fixed.',
  date: 'must be a valid date.',
  rating: 'must be between 1 and 5 stars.',
  objectId: 'is invalid.',
  paymentMethod: 'must be Razorpay or COD.',
};

// Checks a list of { label, value, rule, required, message } entries and
// returns an array of readable error messages (empty when everything passes).
export const validateFields = (fields) => {
  const errors = [];
  fields.forEach(({ label, value, rule, required = false, message }) => {
    const text = value === undefined || value === null ? '' : String(value).trim();
    if (text === '') {
      if (required) errors.push(`${label} is required.`);
      return;
    }
    if (rule && !PATTERNS[rule].test(text)) {
      errors.push(message || `${label} ${HINTS[rule]}`);
    }
  });
  return errors;
};

// Validates every item of a comma separated input such as "S, M, L".
export const validateCommaList = (label, value) => {
  const items = String(value || '').split(',').map((s) => s.trim()).filter(Boolean);
  return items.every((item) => PATTERNS.listItem.test(item)) ? [] : [`${label} ${HINTS.listItem}`];
};

// Rules for a delivery address form.
export const getAddressErrors = (address = {}) =>
  validateFields([
    { label: 'Full name', value: address.fullName, rule: 'personName', required: true },
    { label: 'Phone number', value: address.phone, rule: 'phone', required: true },
    { label: 'Street address', value: address.addressLine, rule: 'addressLine', required: true },
    { label: 'City', value: address.city, rule: 'place', required: true },
    { label: 'State', value: address.state, rule: 'place', required: true },
    { label: 'Pincode', value: address.pincode, rule: 'pincode', required: true },
    { label: 'Landmark', value: address.landmark, rule: 'landmark' },
  ]);
