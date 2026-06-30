const initialized = new WeakSet<ParentNode>();

export function initSmoothSectionScroll(root: ParentNode = document) {
  if (initialized.has(root)) return;
  initialized.add(root);

  root.addEventListener("click", (event) => {
    const link = (event.target as Element).closest('a[href^="#"]');
    if (!(link instanceof HTMLAnchorElement) || !root.contains(link)) return;
    if (!link.hasAttribute("data-smooth-section")) return;

    const id = link.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
    history.replaceState(null, "", link.hash);
  });
}
