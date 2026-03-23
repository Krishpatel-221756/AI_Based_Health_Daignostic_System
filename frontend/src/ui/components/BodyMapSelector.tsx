import type { KeyboardEvent } from "react";
import type { BodyLocation } from "../api";
import { useTranslation } from "react-i18next";

type Option = { id: BodyLocation; label: string };

type Props = {
  value: BodyLocation | null;
  onChange: (value: BodyLocation | null) => void;
};

function regionClass(selected: boolean) {
  return [
    "transition-all duration-300",
    "cursor-pointer",
    selected 
      ? "fill-red-500/40 stroke-red-600 stroke-2 filter drop-shadow-md" 
      : "fill-emerald-100/50 stroke-emerald-600/30 hover:fill-emerald-200/50 hover:stroke-emerald-600"
  ].join(" ");
}

export function BodyMapSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  const OPTIONS: Option[] = [
    { id: "head_neck", label: t('bodyMap.head_neck') },
    { id: "chest", label: t('bodyMap.chest') },
    { id: "abdomen", label: t('bodyMap.abdomen') },
    { id: "back", label: t('bodyMap.back') },
    { id: "arms_hands", label: t('bodyMap.arms_hands') },
    { id: "legs_feet", label: t('bodyMap.legs_feet') },
    { id: "skin", label: t('bodyMap.skin') },
    { id: "general", label: t('bodyMap.general') }
  ];

  const pick = (id: BodyLocation) => {
    onChange(value === id ? null : id);
  };

  const onRegionKeyDown = (id: BodyLocation) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(id);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      <div className="flex flex-col items-center rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">{t('bodyMap.interactiveMap')}</div>
        
        <div className="relative h-[400px] w-full">
          <svg
            viewBox="0 0 200 450"
            className="h-full w-full drop-shadow-xl"
            role="img"
            aria-label={t('bodyMap.ariaLabel')}
          >
            <defs>
              <linearGradient id="skinGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f5d0b0" />
                <stop offset="50%" stopColor="#eac09a" />
                <stop offset="100%" stopColor="#dfb188" />
              </linearGradient>
              <filter id="muscleGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Silhouette (Skin Layer) */}
            <path
              d="M100 20 C115 20 125 32 125 45 C125 55 120 62 115 65 L118 70 C135 72 155 75 165 85 C175 95 175 110 170 140 L165 190 C163 200 160 210 165 215 L170 220 C175 225 170 235 160 235 L145 230 L140 210 L135 215 L135 280 C135 300 130 350 125 380 L120 420 L130 435 L105 440 L95 440 L70 435 L80 420 L75 380 C70 350 65 300 65 280 L65 215 L60 210 L55 230 L40 235 C30 235 25 225 30 220 L35 215 C40 210 37 200 35 190 L30 140 C25 110 25 95 35 85 C45 75 65 72 82 70 L85 65 C80 62 75 55 75 45 C75 32 85 20 100 20 Z"
              fill="url(#skinGradient)"
              stroke="#d1a484"
              strokeWidth="1"
              className={value === "skin" ? "opacity-100 stroke-red-500 stroke-2" : "opacity-30 hover:opacity-40 transition-opacity"}
              onClick={() => pick("skin")}
            />

            {/* Muscle Groups */}
            
            {/* Head & Neck */}
            <g
              onClick={() => pick("head_neck")}
              onKeyDown={onRegionKeyDown("head_neck")}
              tabIndex={0}
              className="outline-none"
            >
              <path
                d="M100 22 C112 22 120 32 120 45 C120 58 112 65 100 68 C88 65 80 58 80 45 C80 32 88 22 100 22 Z"
                className={regionClass(value === "head_neck")}
              />
              <path
                d="M85 65 Q100 75 115 65 L118 72 Q100 80 82 72 Z"
                className={regionClass(value === "head_neck")}
              />
            </g>

            {/* Chest (Pectorals) */}
            <g
              onClick={() => pick("chest")}
              onKeyDown={onRegionKeyDown("chest")}
              tabIndex={0}
              className="outline-none"
            >
              <path
                d="M100 75 Q130 75 145 85 Q150 100 140 120 Q120 130 100 125 Q80 130 60 120 Q50 100 55 85 Q70 75 100 75 Z"
                className={regionClass(value === "chest")}
              />
              <line x1="100" y1="75" x2="100" y2="125" stroke="currentColor" strokeOpacity="0.1" />
            </g>

            {/* Abdomen (Abs) */}
            <g
              onClick={() => pick("abdomen")}
              onKeyDown={onRegionKeyDown("abdomen")}
              tabIndex={0}
              className="outline-none"
            >
              <path
                d="M100 125 Q125 130 135 140 L130 185 Q125 200 100 205 Q75 200 70 185 L65 140 Q75 130 100 125 Z"
                className={regionClass(value === "abdomen")}
              />
              {/* Six pack definition lines */}
              <path d="M75 145 H125 M75 165 H125 M80 185 H120 M100 125 V205" stroke="currentColor" strokeOpacity="0.1" fill="none" />
            </g>

            {/* Arms */}
            <g
              onClick={() => pick("arms_hands")}
              onKeyDown={onRegionKeyDown("arms_hands")}
              tabIndex={0}
              className="outline-none"
            >
              {/* Left Arm (Viewer's Left) */}
              <path d="M55 85 Q35 90 30 110 L35 150 Q45 155 55 150 L60 120 Z" className={regionClass(value === "arms_hands")} /> {/* Delt/Bicep */}
              <path d="M35 150 L30 190 Q25 210 30 220 L40 225 Q50 210 55 150 Z" className={regionClass(value === "arms_hands")} /> {/* Forearm */}
              
              {/* Right Arm (Viewer's Right) */}
              <path d="M145 85 Q165 90 170 110 L165 150 Q155 155 145 150 L140 120 Z" className={regionClass(value === "arms_hands")} />
              <path d="M165 150 L170 190 Q175 210 170 220 L160 225 Q150 210 145 150 Z" className={regionClass(value === "arms_hands")} />
            </g>

            {/* Legs */}
            <g
              onClick={() => pick("legs_feet")}
              onKeyDown={onRegionKeyDown("legs_feet")}
              tabIndex={0}
              className="outline-none"
            >
              {/* Left Leg */}
              <path d="M70 205 Q60 250 65 290 Q80 300 95 290 L95 210 Z" className={regionClass(value === "legs_feet")} /> {/* Thigh */}
              <path d="M65 290 L70 360 Q75 400 70 420 L90 420 Q95 380 95 290 Z" className={regionClass(value === "legs_feet")} /> {/* Calf/Shin */}

              {/* Right Leg */}
              <path d="M130 205 Q140 250 135 290 Q120 300 105 290 L105 210 Z" className={regionClass(value === "legs_feet")} />
              <path d="M135 290 L130 360 Q125 400 130 420 L110 420 Q105 380 105 290 Z" className={regionClass(value === "legs_feet")} />
            </g>

            {/* Back (Simulated behind) - Toggleable area? Or just an area behind? 
                For now, let's put it as a distinct visual block if 'back' is selected, 
                or just an area on the side. 
                Actually, let's make a "Flip" button or just a separate small icon for back?
                For simplicity in this SVG, I will add "Traps" at the top which are often associated with back pain.
            */}
             <g
              onClick={() => pick("back")}
              onKeyDown={onRegionKeyDown("back")}
              tabIndex={0}
              className="outline-none"
            >
               {/* Traps / Upper Back visible from front */}
               <path d="M82 72 L60 80 L65 120 L80 130 Z" className={regionClass(value === "back")} opacity="0.5" />
               <path d="M118 72 L140 80 L135 120 L120 130 Z" className={regionClass(value === "back")} opacity="0.5" />
            </g>

          </svg>
          
          {/* Overlay Text for Selected Region */}
          {value && (
            <div className="absolute bottom-4 left-0 right-0 text-center animate-bounce">
              <span className="inline-block rounded-full bg-slate-900/80 px-4 py-1 text-sm font-bold text-white shadow-lg backdrop-blur">
                {OPTIONS.find((o) => o.id === value)?.label}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="mb-6 text-xl font-bold text-slate-900">{t('bodyMap.title')}</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const selected = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={[
                  "group relative overflow-hidden rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 shadow-sm",
                  selected
                    ? "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500 scale-105 z-10"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50 hover:shadow-md"
                ].join(" ")}
                onClick={() => pick(opt.id)}
              >
                <div className={[
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10",
                   selected ? "bg-emerald-600 opacity-10" : "bg-slate-400"
                ].join(" ")} />
                
                <span className={[
                  "relative block text-lg font-bold",
                  selected ? "text-emerald-900" : "text-slate-700"
                ].join(" ")}>
                  {opt.label}
                </span>
                
                {selected && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            className="col-span-2 mt-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-3 text-base font-bold text-slate-500 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            onClick={() => onChange(null)}
          >
            {t('actions.clearSelection')}
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-blue-50 p-6 border border-blue-100">
          <div className="flex gap-4">
            <div className="shrink-0 text-blue-600 mt-1">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-900">{t('bodyMap.guideTitle')}</h4>
              <p className="mt-2 text-base text-blue-900/80 leading-relaxed">
                {t('bodyMap.guideText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
