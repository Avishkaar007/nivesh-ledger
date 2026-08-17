import React from "react";
import { Info } from "lucide-react";
import { num, clamp } from "../lib/format.js";

export default function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  prefix = "",
  helper,
  format,
}) {
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
  const display = format ? format(value) : num(value);

  return (
    <div className="field">
      <div className="field-head">
        <label>
          {label}
          {helper && (
            <span className="helper-dot" title={helper}>
              <Info size={12} />
            </span>
          )}
        </label>
        <div className="field-input">
          {prefix && <span className="prefix">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? 0 : Number(v));
            }}
            onBlur={(e) => onChange(clamp(Number(e.target.value) || 0, min, max))}
          />
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` }}
        className="slider"
        aria-label={label}
      />
      <div className="field-range">
        <span>
          {prefix}
          {format ? format(min) : num(min)}
          {unit}
        </span>
        <span>
          {prefix}
          {format ? format(max) : num(max)}
          {unit}
        </span>
      </div>
    </div>
  );
}