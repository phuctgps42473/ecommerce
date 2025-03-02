
export function formatPrice(price: number): string {
  const a = String(price).split("").reverse();
  return a.map((d, i) =>  (i + 1) % 3 === 0 ? ","+d : d ).reverse().join("") + "VNĐ";
}
