import React from "react";
import { motion } from "framer-motion";

type FeatureCardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm mx-auto"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center">
        <img
          src={imageUrl}
          alt={title}
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
