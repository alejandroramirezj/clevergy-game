let memLB = [];

export function loadLB() {
  try {
    return JSON.parse(localStorage.getItem("retreatLB") || "[]");
  } catch (e) {
    return memLB;
  }
}

export function saveLB(lb) {
  memLB = lb;
  try {
    localStorage.setItem("retreatLB", JSON.stringify(lb));
  } catch (e) {}
}
