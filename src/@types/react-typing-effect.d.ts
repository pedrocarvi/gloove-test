declare module "react-typing-effect" {
  const TypingEffect: React.ComponentType<{
    text: string[];
    speed?: number;
    eraseSpeed?: number;
    typingDelay?: number;
    eraseDelay?: number;
    displayTextRenderer?: (text: string, i: number) => React.ReactNode;
  }>;
  export default TypingEffect;
}
