declare module "react-step-progress-bar" {
  import * as React from "react";

  export interface ProgressBarProps {
    percent: number;
    filledBackground?: string;
    children: React.ReactNode;
  }

  export interface StepProps {
    transition?: string;
    children: (props: { accomplished: boolean }) => React.ReactNode;
  }

  export class ProgressBar extends React.Component<ProgressBarProps> {}
  export class Step extends React.Component<StepProps> {}
}
