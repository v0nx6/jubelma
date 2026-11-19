"use client";

import { useState } from "react";
import { StarFilled } from "./icons";

const LABELS = ["", "Sangat kurang", "Kurang", "Cukup", "Puas", "Sangat puas"];

export function RatingInput({ name = "rating" }: { name?: string }) {
  const [value, setValue] = useState(5);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Beri ${i} bintang`}
            aria-pressed={value === i}
            onClick={() => setValue(i)}
            className={`transition hover:scale-110 ${
              i <= value ? "text-[#8f1030]" : "text-[#e7d6da]"
            }`}
          >
            <StarFilled size={30} />
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13px] font-semibold text-heading">
        {value} dari 5 · {LABELS[value]}
      </p>
    </div>
  );
}
