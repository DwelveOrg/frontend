"use client";

import { motion } from "motion/react";
import { containerVariants, itemVariants } from "../../_constants";
import type { ClassItem } from "../_types";
import ClassCard from "./ClassCard";

type ClassGridProps = {
  items: ClassItem[];
};

/** Responsive, staggered grid of class cards. Shared by the Classes page and the
 * School page's class directory so both stay visually identical. */
export default function ClassGrid({ items }: ClassGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <ClassCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
