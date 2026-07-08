import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TopicTile } from './TopicTile';
import { PreventionTopicSheet } from './PreventionTopicSheet';
import { TOPIC_ICONS, TOPIC_ACCENTS } from './topicVisuals';
import { NoseDropletIcon } from './icons/NoseDropletIcon';

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

/**
 * 2-column grid of prevention topic tiles, replacing the long accordion list.
 * Tapping a tile opens PreventionTopicSheet, which is the new home for the
 * full tip-by-tip detail (reusing PreventionCategory's tip markup).
 */
export const TopicTileGrid = ({ categories = [] }) => {
  const [active, setActive] = useState(null);

  return (
    <>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {categories.map((cat) => {
          const Icon = TOPIC_ICONS[cat.id] || NoseDropletIcon;
          const accent = TOPIC_ACCENTS[cat.id] || 'red';
          return (
            <motion.div key={cat.id} variants={itemVariants}>
              <TopicTile
                icon={Icon}
                title={cat.title}
                summary={cat.summary}
                accent={accent}
                onClick={() => setActive(cat)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <PreventionTopicSheet
        category={active}
        isOpen={!!active}
        onClose={() => setActive(null)}
      />
    </>
  );
};
export default TopicTileGrid;
