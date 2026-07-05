/* Vanta Redesign Global Javascript - Search Indexing and Interactions */

document.addEventListener("DOMContentLoaded", () => {
  initGlobalSearch();
  initCodeCopy();
  initMobileNav();
  highlightActiveLink();
});

// Highlight the current page link in navigation
function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href === currentPath || (currentPath === "index.html" && href === "/")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Mobile responsive menu toggle
function initMobileNav() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      if (!isVisible) {
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "76px";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "rgba(5, 6, 8, 0.96)";
        navLinks.style.padding = "20px";
        navLinks.style.borderBottom = "1px solid var(--line)";
        navLinks.style.gap = "10px";
      }
    });
  }
}

// Code Copy to Clipboard
function initCodeCopy() {
  const preBlocks = document.querySelectorAll("pre");
  preBlocks.forEach(pre => {
    // Add copy button
    const btn = document.createElement("button");
    btn.className = "code-copy-btn";
    btn.type = "button";
    btn.innerText = "Copy";
    pre.appendChild(btn);

    btn.addEventListener("click", () => {
      const code = pre.querySelector("code");
      if (code) {
        navigator.clipboard.writeText(code.innerText.trim()).then(() => {
          btn.innerText = "Copied!";
          btn.style.color = "var(--mint)";
          setTimeout(() => {
            btn.innerText = "Copy";
            btn.style.color = "";
          }, 2000);
        });
      }
    });
  });
}

// Global Ctrl+K Search Overlay Modal
function initGlobalSearch() {
  // 1. Create and inject search modal HTML dynamically
  const overlay = document.createElement("div");
  overlay.id = "globalSearchOverlay";
  overlay.className = "search-overlay";
  overlay.innerHTML = `
    <div class="search-modal">
      <div class="search-modal-header">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" stroke-width="2"></circle>
          <path d="M13 13l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>
        <input type="search" id="globalSearchInput" class="search-modal-input" placeholder="Search catalog, assets, guides, FAQ..." autocomplete="off" spellcheck="false">
        <button class="search-modal-close" id="globalSearchClose">ESC</button>
      </div>
      <div class="search-modal-results" id="globalSearchResults">
        <div class="search-result-no-match">Type to start searching...</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const searchInput = document.getElementById("globalSearchInput");
  const resultsContainer = document.getElementById("globalSearchResults");
  const closeBtn = document.getElementById("globalSearchClose");

  // Open modal triggers
  const triggers = document.querySelectorAll(".search-trigger, .search-trigger-btn");
  triggers.forEach(t => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      openSearchModal();
    });
  });

  // Open Search Modal Function
  function openSearchModal() {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 50);
  }

  // Close Search Modal Function
  function closeSearchModal() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    searchInput.value = "";
    resultsContainer.innerHTML = `<div class="search-result-no-match">Type to start searching...</div>`;
  }

  closeBtn.addEventListener("click", closeSearchModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearchModal();
  });

  // Handle keys (Ctrl+K and ESC)
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeSearchModal();
    }
  });

  // Handle Search Input Logic
  if (searchInput && resultsContainer) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        resultsContainer.innerHTML = `<div class="search-result-no-match">Type to start searching...</div>`;
        return;
      }
      
      const matches = performIndexSearch(query);
      renderSearchResults(matches);
    });
  }

  // Perform Indexing Search on Local JS Database (keyflameDb)
  function performIndexSearch(query) {
    if (!window.keyflameDb) return [];
    const db = window.keyflameDb;
    const matches = [];

    // Search Windows Software
    if (db.windows) {
      db.windows.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          matches.push({
            title: item.name,
            desc: `Windows Software • Category: ${item.category} • Host: ${item.host}`,
            url: `windows.html?q=${encodeURIComponent(item.name)}`,
            category: "Windows"
          });
        }
      });
    }

    // Search macOS Software
    if (db.macos) {
      db.macos.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          matches.push({
            title: item.name,
            desc: `macOS Software • Category: ${item.category} • Host: ${item.host}`,
            url: `macos.html?q=${encodeURIComponent(item.name)}`,
            category: "macOS"
          });
        }
      });
    }

    // Search Extensions
    if (db.extensions) {
      db.extensions.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          matches.push({
            title: item.name,
            desc: `Extension & Script • Category: ${item.category} • Host: ${item.host}`,
            url: `extensions.html?q=${encodeURIComponent(item.name)}`,
            category: "Extensions"
          });
        }
      });
    }

    // Search Archives
    if (db.archives) {
      db.archives.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          matches.push({
            title: item.name,
            desc: `Legacy Project Compatibility • Category: ${item.category} • Host: ${item.host}`,
            url: `archives.html?q=${encodeURIComponent(item.name)}`,
            category: "Archives"
          });
        }
      });
    }

    // Search Free Assets (Resources)
    if (db.resources) {
      db.resources.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          matches.push({
            title: item.name,
            desc: item.description,
            url: `resources.html#${item.section.toLowerCase()}`,
            category: `Assets (${item.category})`
          });
        }
      });
    }

    // Search Guides
    if (db.guides) {
      db.guides.forEach(guide => {
        if (guide.title.toLowerCase().includes(query) || guide.description.toLowerCase().includes(query)) {
          matches.push({
            title: guide.title,
            desc: guide.description,
            url: `guides.html?guide=${guide.slug}`,
            category: "Guides"
          });
        }
        // Search inside sections
        guide.sections.forEach(sec => {
          if (sec.heading.toLowerCase().includes(query) || sec.htmlContent.toLowerCase().includes(query)) {
            matches.push({
              title: `${guide.title} > ${sec.heading}`,
              desc: sec.kicker || guide.description,
              url: `guides.html?guide=${guide.slug}#${sec.id}`,
              category: "Guides"
            });
          }
        });
      });
    }

    // Search FAQ
    if (db.faq) {
      db.faq.forEach((entry, idx) => {
        if (entry.question.toLowerCase().includes(query) || entry.answer.toLowerCase().includes(query)) {
          matches.push({
            title: entry.question,
            desc: entry.answer.replace(/<[^>]*>/g, '').substring(0, 120) + "...",
            url: `faq.html?faq=${idx}`,
            category: "FAQ"
          });
        }
      });
    }

    return matches.slice(0, 10); // cap results at 10
  }

  // Render search results HTML
  function renderSearchResults(matches) {
    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-result-no-match">No results found for that query.</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <div class="search-result-item" onclick="window.location.href='${item.url}'">
        <div class="search-result-title-row">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-cat">${item.category}</span>
        </div>
        <span class="search-result-desc">${item.desc}</span>
      </div>
    `).join("");
  }
}
