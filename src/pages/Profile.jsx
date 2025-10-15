import { useLang } from "../LanguageContext";

export default function Profile() {
  const { t, lang } = useLang();
  const isRTL = lang === "fa";
  const dir = isRTL ? "rtl" : "ltr";
  const align = isRTL ? "text-right" : "text-left";

  return (
    <section dir={dir} className={`flex flex-col items-center py-8 ${align}`}>
      <img
        src="https://api.dicebear.com/7.x/bottts/svg?seed=persian"
        alt="Avatar"
        className="w-24 h-24 mb-4 rounded-full border-4 border-fuchsia-300"
      />
      <h2 className="text-xl font-bold mb-2 text-fuchsia-700">{t.profile}</h2>
      <div className="bg-white/80 shadow rounded-xl px-8 py-4 mt-2 w-full max-w-xs">
        <div className="mb-2">
          <span className="font-semibold">{t.user}:</span> {t.guest}
        </div>
        <div>
          <span className="font-semibold">{t.progress}:</span> 2/2 {t.completed}
        </div>
      </div>
    </section>
  );
}
