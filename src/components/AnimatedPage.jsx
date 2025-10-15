export default function AnimatedPage({ children }) {
  // Simple fade-in; use Framer Motion or React Spring for more advanced animation
  return <div className="fade-in">{children}</div>;
}
