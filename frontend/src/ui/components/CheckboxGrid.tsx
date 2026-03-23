type Item<T extends string> = { id: T; label: string; icon?: string };

type Props<T extends string> = {
  items: Item<T>[];
  selected: Set<T>;
  onToggle: (id: T) => void;
};

export function CheckboxGrid<T extends string>({ items, selected, onToggle }: Props<T>) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const isOn = selected.has(item.id);
        return (
          <button
            key={item.id}
            type="button"
            className={[
              "flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all shadow-sm hover:shadow-md",
              isOn
                ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
            ].join(" ")}
            onClick={() => onToggle(item.id)}
          >
            <div className="flex items-center gap-4">
              {item.icon ? <span aria-hidden="true" className="text-2xl">{item.icon}</span> : null}
              <span className="text-lg font-medium text-gray-900">{item.label}</span>
            </div>
            <span
              className={[
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 text-lg transition-colors",
                isOn
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-gray-300 bg-white text-gray-300"
              ].join(" ")}
              aria-hidden="true"
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
