(() => {
  const names = {
    "api-contract-guard": "API Contract Guard",
    "evidencedesk": "EvidenceDesk",
    "toolcall-replay": "ToolCall Replay",
    "entity-resolution-workbench": "Entity Resolution Workbench",
    "postgres-migration-rehearsal": "PostgreSQL Migration Rehearsal",
    "skill-studio": "Skill Studio",
  };
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  let leaving = false;
  let timer;

  function projectName(pathname) {
    const slug = pathname.match(/^\/projects\/([^/]+)\//)?.[1];
    return names[slug] || "Project demos";
  }

  function removeOverlay() {
    clearTimeout(timer);
    document.querySelector(".project-transition")?.remove();
    leaving = false;
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion?.matches || leaving) return;

    const link = event.target.closest?.("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

    const destination = new URL(link.href, window.location.href);
    const isInternalProject = destination.origin === window.location.origin && destination.pathname.startsWith("/projects/");
    if (!isInternalProject && !link.dataset.projectTransition) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    leaving = true;
    const overlay = document.createElement("div");
    overlay.className = "project-transition";
    overlay.setAttribute("aria-hidden", "true");
    const title = link.dataset.projectTransition || projectName(destination.pathname);
    overlay.innerHTML = `<div class="project-transition__top"><strong>AM / 26</strong><span>SELECTED WORK</span></div><p class="project-transition__title"></p><div class="project-transition__bottom"><span>OPENING PROJECT</span><span>↗</span></div>`;
    overlay.querySelector(".project-transition__title").textContent = title;
    document.body.append(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("is-active")));
    timer = setTimeout(() => window.location.assign(destination.href), 500);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) removeOverlay();
  });
})();
