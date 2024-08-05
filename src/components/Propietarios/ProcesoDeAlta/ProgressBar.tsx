import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({ steps, currentStep }) => {
    const progressWidth = useMemo(
      () => `${(currentStep / (steps.length - 1)) * 100}%`,
      [currentStep, steps.length]
    );

    const renderStep = useCallback(
      (step: string, index: number) => {
        const isActive = currentStep > index;
        const isCurrent = currentStep === index;
        return (
          <div key={index} className="flex items-center space-x-2">
            {isActive ? (
              <FaCheckCircle className="text-primary" />
            ) : (
              <span className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCurrent ? "bg-primary" : "bg-gray-300"
                  }`}
                ></span>
              </span>
            )}
            <span
              className={`text-sm ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        );
      },
      [currentStep]
    );

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <div className="relative pt-1">
          <motion.div
            className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-neutral-light"
            initial={{ width: 0 }}
            animate={{ width: progressWidth }}
            transition={{ duration: 0.5 }}
          >
            <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
          </motion.div>
          <div className="flex flex-wrap justify-between mt-2">
            {steps.map(renderStep)}
          </div>
        </div>
      </div>
    );
  }
);

export default ProgressBar;
