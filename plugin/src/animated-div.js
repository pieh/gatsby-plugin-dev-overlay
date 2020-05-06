import React from "react";
import { motion } from "framer-motion";

const AnimatedDiv = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    />
  );
};

export default AnimatedDiv;
