const { PATTERNS, HINTS, validateFields } = require('../utils/validators');

const getPath = (obj, path) => path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

// Builds an Express middleware from field rules ({ field, label, rule, required })
// and optional cross-field checks ((body, req) => errorMessage | null).
// Multipart routes must run multer before this so req.body is populated.
const validate = (fields, checks = []) => (req, res, next) => {
  const body = req.body || {};
  const errors = validateFields(fields.map((f) => ({ ...f, value: getPath(body, f.field) })));

  checks.forEach((check) => {
    const message = check(body, req);
    if (message) errors.push(message);
  });

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' '), errors });
  }
  next();
};

// Same rules with nothing required, for partial updates.
const optional = (fields) => fields.map((f) => ({ ...f, required: false }));

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const parseJsonList = (value) => {
  if (isBlank(value)) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// ---------- Auth ----------
const registerRules = validate([
  { field: 'name', label: 'Full name', rule: 'personName', required: true },
  { field: 'email', label: 'Email', rule: 'email', required: true },
  { field: 'phone', label: 'Phone number', rule: 'phone' },
  { field: 'password', label: 'Password', rule: 'password', required: true },
  { field: 'confirmPassword', label: 'Confirm password', required: true },
]);

// Login only checks the email format so older accounts with weaker passwords can still sign in.
const loginRules = validate([
  { field: 'email', label: 'Email', rule: 'email', required: true },
  { field: 'password', label: 'Password', required: true },
]);

const profileRules = validate([
  { field: 'name', label: 'Full name', rule: 'personName' },
  { field: 'phone', label: 'Phone number', rule: 'phone' },
  { field: 'password', label: 'New password', rule: 'password' },
]);

const addressFields = (prefix = '') => [
  { field: `${prefix}fullName`, label: 'Full name', rule: 'personName', required: true },
  { field: `${prefix}phone`, label: 'Phone number', rule: 'phone', required: true },
  { field: `${prefix}addressLine`, label: 'Street address', rule: 'addressLine', required: true },
  { field: `${prefix}city`, label: 'City', rule: 'place', required: true },
  { field: `${prefix}state`, label: 'State', rule: 'place', required: true },
  { field: `${prefix}pincode`, label: 'Pincode', rule: 'pincode', required: true },
  { field: `${prefix}landmark`, label: 'Landmark', rule: 'landmark' },
];

const addressRules = validate(addressFields());

// ---------- Orders & payments ----------
const orderRules = validate(
  [
    ...addressFields('shippingAddress.'),
    { field: 'paymentMethod', label: 'Payment method', rule: 'paymentMethod' },
    { field: 'couponCode', label: 'Coupon code', rule: 'couponCode' },
  ],
  [
    (body) => (!body.shippingAddress ? 'Shipping address is required.' : null),
    (body) => (!Array.isArray(body.orderItems) || body.orderItems.length === 0 ? 'Your cart is empty.' : null),
  ]
);

// ---------- Products ----------
const productFields = [
  { field: 'name', label: 'Product title', rule: 'productName', required: true },
  { field: 'brand', label: 'Brand name', rule: 'brand', required: true },
  { field: 'category', label: 'Category', rule: 'objectId', required: true },
  { field: 'subcategory', label: 'Subcategory', rule: 'categoryName', required: true },
  { field: 'shortDescription', label: 'Short description', rule: 'shortText' },
  { field: 'description', label: 'Description', rule: 'description', required: true },
  { field: 'price', label: 'Original price', rule: 'price', required: true },
  { field: 'discountPrice', label: 'Discount price', rule: 'price' },
  { field: 'stock', label: 'Stock count', rule: 'integer', required: true },
  { field: 'sku', label: 'SKU code', rule: 'sku', required: true },
  { field: 'imageUrl', label: 'Image URL', rule: 'url' },
];

const productChecks = [
  (body) =>
    !isBlank(body.price) && !isBlank(body.discountPrice) && Number(body.discountPrice) >= Number(body.price)
      ? 'Discount price must be lower than the original price.'
      : null,
  (body) =>
    !isBlank(body.price) && PATTERNS.price.test(String(body.price)) && Number(body.price) <= 0
      ? 'Original price must be greater than 0.'
      : null,
  (body) => {
    if (isBlank(body.variants)) return null;
    let variants = body.variants;
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch {
        return 'Variants are malformed.';
      }
    }
    const labels = { sizes: 'Sizes', colors: 'Colors', weights: 'Weights' };
    const bad = Object.keys(labels).find(
      (key) => Array.isArray(variants?.[key]) && !variants[key].every((item) => PATTERNS.listItem.test(String(item).trim()))
    );
    return bad ? `${labels[bad]} ${HINTS.listItem}` : null;
  },
];

const createProductRules = validate(productFields, productChecks);
const updateProductRules = validate(optional(productFields), productChecks);

// ---------- Categories ----------
const categoryFields = [
  { field: 'name', label: 'Category name', rule: 'categoryName', required: true },
  { field: 'description', label: 'Description', rule: 'shortText' },
  { field: 'imageUrl', label: 'Image URL', rule: 'url' },
  { field: 'displayOrder', label: 'Navbar position', rule: 'displayOrder' },
];

const categoryChecks = [
  (body) => {
    const subs = parseJsonList(body.subcategories);
    if (subs === null || !Array.isArray(subs)) return 'Subcategories are malformed.';
    const valid = subs.every((sub) => PATTERNS.categoryName.test(String(typeof sub === 'string' ? sub : sub?.name).trim()));
    return valid ? null : `Each subcategory ${HINTS.categoryName}`;
  },
];

const createCategoryRules = validate(categoryFields, categoryChecks);
const updateCategoryRules = validate(optional(categoryFields), categoryChecks);

// ---------- Coupons ----------
const createCouponRules = validate(
  [
    { field: 'code', label: 'Coupon code', rule: 'couponCode', required: true },
    { field: 'discountType', label: 'Discount type', rule: 'discountType', required: true },
    { field: 'discountValue', label: 'Discount value', rule: 'price', required: true },
    { field: 'minimumPurchase', label: 'Minimum purchase', rule: 'price' },
    { field: 'expiryDate', label: 'Expiry date', rule: 'date', required: true },
  ],
  [
    (body) => (Number(body.discountValue) <= 0 ? 'Discount value must be greater than 0.' : null),
    (body) =>
      body.discountType === 'percentage' && Number(body.discountValue) > 100
        ? 'Percentage discount cannot be more than 100%.'
        : null,
    (body) => {
      if (isBlank(body.expiryDate)) return null;
      const expiry = new Date(body.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (Number.isNaN(expiry.getTime())) return `Expiry date ${HINTS.date}`;
      return expiry < today ? 'Expiry date cannot be in the past.' : null;
    },
  ]
);

const applyCouponRules = validate([{ field: 'code', label: 'Coupon code', rule: 'couponCode', required: true }]);

// ---------- Banners ----------
const createBannerRules = validate([
  { field: 'title', label: 'Banner title', rule: 'bannerTitle', required: true },
  { field: 'subtitle', label: 'Subtitle', rule: 'shortText' },
  { field: 'link', label: 'Target link', rule: 'linkPath' },
  { field: 'imageUrl', label: 'Image URL', rule: 'url' },
]);

// ---------- Reviews ----------
const reviewRules = validate([
  { field: 'productId', label: 'Product', rule: 'objectId', required: true },
  { field: 'rating', label: 'Rating', rule: 'rating', required: true },
  { field: 'comment', label: 'Review comment', rule: 'reviewComment', required: true },
]);

module.exports = {
  validate,
  registerRules,
  loginRules,
  profileRules,
  addressRules,
  orderRules,
  createProductRules,
  updateProductRules,
  createCategoryRules,
  updateCategoryRules,
  createCouponRules,
  applyCouponRules,
  createBannerRules,
  reviewRules,
};
