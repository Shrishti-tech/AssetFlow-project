export const CATEGORY_COLORS = ["#087ea4", "#2457b3", "#a56200", "#6b45d3", "#16724c", "#b42318"];
export const OTHER_COLOR = "#5b6472";

export const colorForIndex = (index) => CATEGORY_COLORS[index % CATEGORY_COLORS.length] || OTHER_COLOR;

export const SEQUENTIAL_TEAL = ["#eef2f6", "#cfeaf3", "#8fd0e6", "#4bb0d3", "#0f8ab0", "#075873"];

export const sequentialStep = (ratio) => {
  const index = Math.min(SEQUENTIAL_TEAL.length - 1, Math.round(ratio * (SEQUENTIAL_TEAL.length - 1)));
  return SEQUENTIAL_TEAL[Math.max(0, index)];
};
