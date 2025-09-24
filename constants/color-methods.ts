import { HTTPMethod } from "./http-methods";

export const METHOD_COLORS: Record<HTTPMethod, string> = {
  GET: "bg-[#61AFFE] text-background",
  POST: "bg-[#49CC90] text-background",
  PUT: "bg-[#FCA130] text-background",
  DELETE: "bg-[#F93E3E] text-background",
  PATCH: "bg-[#50E3C2] text-background",
};

export const METHOD_CARD_COLORS: Record<HTTPMethod, string> = {
  GET: "bg-[#eff7ff] border-[#61AFFE]",
  POST: "bg-[#eefaf5] border-[#49CC90]",
  PUT: "bg-[#fef6ea] border-[#FCA130]",
  DELETE: "bg-[#fdecec] border-[#F93E3E]",
  PATCH: "bg-[#edfcf9] border-[#50E3C2]",
};

export function getMethodColor(method: HTTPMethod): string {
  return METHOD_COLORS[method];
}

export function getMethodCardColor(method: HTTPMethod): string {
  return METHOD_CARD_COLORS[method];
}
