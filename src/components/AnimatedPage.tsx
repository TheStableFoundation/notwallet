import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
}

export default function AnimatedPage({ children }: AnimatedPageProps) {
  // Simple fade-in; use Framer Motion or React Spring for more advanced animation
  return <div className="fade-in">{children}</div>;
}
