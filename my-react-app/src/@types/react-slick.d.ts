// src/@types/react-slick.d.ts
declare module "react-slick" {
  import * as React from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    pauseOnHover?: boolean;
    className?: string;
    adaptiveHeight?: boolean;
  }

  export default class Slider extends React.Component<Settings> {}
}
