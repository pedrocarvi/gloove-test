declare module "react-signature-canvas" {
  import { Component } from "react";

  export interface SignatureCanvasProps {
    canvasProps?: object;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    fromDataURL(dataURL: string, options?: object): void;
    getCanvas(): HTMLCanvasElement;
    getTrimmedCanvas(): HTMLCanvasElement;
    toDataURL(type?: string, quality?: number): string;
  }
}
