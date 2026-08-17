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
  log,
  categories,
}) {
  const display = format ? format(value) : num(value);

  let pct;
  let sliderMin;
  let sliderMax;
  let sliderStep;
  let sliderValue;
  let onSliderChange;
  let lo;
  let hi;

  if (log) {
    // Logarithmic slider: one continuous track that can reach any amount from
    // low values to 100 crore, with low ranges still usable. When min is 0
    // (e.g. prepayment where 0 = "none"), the log scale still starts at ₹100 so
    // the category bars line up evenly with the other amount sliders.
    const floor = Math.max(1, min || 100);
    lo = Math.log(floor);
    hi = Math.log(max);
    const v = Math.log(Math.max(floor, value));
    pct = clamp(((v - lo) / (hi - lo)) * 100, 0, 100);
    sliderMin = lo;
    sliderMax = hi;
    sliderStep = (hi - lo) / 1000;
    sliderValue = v;
    onSliderChange = (e) => onChange(Math.round(Math.exp(Number(e.target.value))));
  } else {
    pct = clamp(((value - min) / (max - min)) * 100, 0, 100);
    sliderMin = min;
    sliderMax = max;
    sliderStep = step;
    sliderValue = clamp(value, min, max);
    onSliderChange = (e) => onChange(Number(e.target.value));
  }

  return (
    <div className="field">
      <div className="field-head">
        <label>
          {label}
          {helper && (
            <span className="helper-dot" data-tip={helper} title={helper}>
              <Info size={12} />
            </span>
          )}
        </label>
        <div className="field-input">
          {prefix && <span className="prefix">{prefix}</span>}
          <input
            type={format ? "text" : "number"}
            inputMode={format ? "numeric" : undefined}
            value={format ? display : value}
            onChange={(e) => {
              const v = e.target.value;
              const parsed = Number(v);
              onChange(v === "" || Number.isNaN(parsed) ? 0 : parsed);
            }}
            onBlur={(e) => {
              const p = Number(e.target.value);
              onChange(Number.isNaN(p) ? value : clamp(p || 0, min, max));
            }}
          />
          {unit && <span className="unit">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={sliderValue}
        onChange={onSliderChange}
        style={{ "--pct": `${pct}%` }}
        className="slider"
        aria-label={label}
      />
      {log && categories ? (
        <div className="field-cats">
          {categories.map((cat) => {
            const pos = clamp(((Math.log(cat.value) - lo) / (hi - lo)) * 100, 0, 100);
            return (
              <span key={cat.label} className="cat-marker" style={{ left: `${pos}%` }}>
                <i className="cat-bar" />
                <span className="cat-label">{cat.label}</span>
              </span>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
}