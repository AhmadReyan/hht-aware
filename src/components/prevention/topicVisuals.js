import { NoseDropletIcon } from './icons/NoseDropletIcon';
import { PlateIcon } from './icons/PlateIcon';
import { IronDropIcon } from './icons/IronDropIcon';
import { PillIcon } from './icons/PillIcon';
import { ActivityIcon } from './icons/ActivityIcon';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { HeartWellbeingIcon } from './icons/HeartWellbeingIcon';

// Shared icon + accent map for prevention categories, keyed by
// `preventionCategories[i].id` from src/data/prevention.js. Consumed by both
// TopicTileGrid (the tile grid) and PreventionTopicSheet (the bottom sheet)
// so the mapping only lives in one place.
export const TOPIC_ICONS = {
  'nasal-care': NoseDropletIcon,
  'diet-nutrition': PlateIcon,
  'iron-anemia': IronDropIcon,
  'medication-safety': PillIcon,
  'activity-environment': ActivityIcon,
  'screening-checkups': StethoscopeIcon,
  'emotional-wellbeing': HeartWellbeingIcon,
};

export const TOPIC_ACCENTS = {
  'nasal-care': 'teal',
  'diet-nutrition': 'orange',
  'iron-anemia': 'red',
  'medication-safety': 'orange',
  'activity-environment': 'teal',
  'screening-checkups': 'red',
  'emotional-wellbeing': 'orange',
};
