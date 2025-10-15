import { Link } from "react-router-dom";
import { useLang } from "../LanguageContext";

export default function Home() {
  const { t } = useLang();
  return (
    <section className="flex flex-col items-center justify-center min-h-[30vh]">
      <svg
        className="w-40 mb-8 animate-bounce"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="60" fill="#f3e8ff" />
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          fill="#a21caf"
          fontSize="36"
          fontFamily="Arial, sans-serif"
          dy=".3em"
        >
          🏵️
        </text>
      </svg>
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-fuchsia-700">
        {t.welcome}
      </h1>
      <p className="text-lg text-center mb-8 text-slate-600">{t.homeDesc}</p>
      <Link
        to="/lessons"
        className="bg-fuchsia-500 hover:bg-fuchsia-600 active:scale-95 transition transform text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl focus:ring-2 focus:ring-fuchsia-300 animate-pulse"
      >
        {t.getStarted}
      </Link>
    </section>
  );
}
