import {
  Shirt,
  ShoppingBag,
  Baby,
  Sparkles,
  Snowflake,
  Dumbbell,
  Footprints,
  Watch,
  Glasses,
  Crown,
  Heart,
  Sun,
  Tag,
  Layers,
} from 'lucide-react';

/**
 * Categories are managed by admins in Admin Panel > Categories and served from
 * the API, so there is no hardcoded category list any more. Each category
 * stores a Lucide icon name; this map turns that name into a component.
 *
 * Anything not in the map falls back to a generic clothing icon, which means an
 * admin can save any icon name without ever breaking the navbar.
 */
export const CATEGORY_ICON_MAP = {
  Shirt,
  ShoppingBag,
  Baby,
  Sparkles,
  Snowflake,
  Dumbbell,
  Footprints,
  Watch,
  Glasses,
  Crown,
  Heart,
  Sun,
  Tag,
  Layers,
};

/** Icon names an admin can pick from when creating or editing a category. */
export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICON_MAP);

export const DEFAULT_CATEGORY_ICON = 'Shirt';

export const getCategoryIcon = (iconName) =>
  CATEGORY_ICON_MAP[iconName] || CATEGORY_ICON_MAP[DEFAULT_CATEGORY_ICON];
