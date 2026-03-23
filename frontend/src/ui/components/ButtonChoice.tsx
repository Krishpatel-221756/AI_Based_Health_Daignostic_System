import type { ChoiceOption } from "../catalog";

type Props<T extends string> = {
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

export function ButtonChoice<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={[
              "rounded-xl border-2 px-6 py-4 text-lg font-medium transition-all shadow-sm hover:shadow-md",
              selected
                ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 scale-105"
                : "border-gray-200 bg-white text-gray-800 hover:border-emerald-400 hover:bg-emerald-50"
            ].join(" ")}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
