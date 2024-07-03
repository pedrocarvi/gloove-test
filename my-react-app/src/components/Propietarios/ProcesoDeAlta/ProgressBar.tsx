import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="relative pt-1">
        <motion.div
          className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-neutral-light"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
        </motion.div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              {currentStep > index ? (
                <FaCheckCircle className="text-primary" />
              ) : (
                <span className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentStep === index ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></span>
                </span>
              )}
              <span
                className={`text-sm ${
                  currentStep > index ? "text-primary" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
