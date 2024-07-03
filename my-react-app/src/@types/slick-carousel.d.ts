declare module "react-slick" {
  import { Component } from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
  }

  export default class Slider extends Component<{ settings: Settings }> {}
}
