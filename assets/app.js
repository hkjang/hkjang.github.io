const username = document.body.dataset.username || "hkjang";
const cacheKey = `portfolio:${username}:v3`;
const cacheTtlMs = 1000 * 60 * 30;
const initialVisibleCount = 18;
const loadIncrement = 18;

const state = {
  profile: null,
  repos: [],
  filteredRepos: [],
  visibleCount: initialVisibleCount,
  lastUpdatedLabel: "",
};

const elements = {
  currentYear: document.getElementById("currentYear"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileName: document.getElementById("profileName"),
  profileBio: document.getElementById("profileBio"),
  publicRepoCount: document.getElementById("publicRepoCount"),
  totalStars: document.getElementById("totalStars"),
  languageCount: document.getElementById("languageCount"),
  lastPushDate: document.getElementById("lastPushDate"),
  dataFreshness: document.getElementById("dataFreshness"),
  featuredProjects: document.getElementById("featuredProjects"),
  searchInput: document.getElementById("searchInput"),
  languageFilter: document.getElementById("languageFilter"),
  typeFilter: document.getElementById("typeFilter"),
  sortSelect: document.getElementById("sortSelect"),
  resultSummary: document.getElementById("resultSummary"),
  loadMoreButton: document.getElementById("loadMoreButton"),
  projectGrid: document.getElementById("projectGrid"),
};

init();

async function init() {
  elements.currentYear.textContent = String(new Date().getFullYear());
  bindControls();

  const cached = readCache();
  if (cached) {
    hydrate(cached.profile, cached.repos, cached.cachedAt, true);
  }

  try {
    const [profile, repos] = await Promise.all([fetchProfile(username), fetchAllRepos(username)]);
    writeCache(profile, repos);
    hydrate(profile, repos, Date.now(), false);
  } catch (error) {
    console.error(error);
    if (!cached) {
      renderErrorState();
    } else {
      elements.dataFreshness.textContent =
        "GitHub 새로고침에 실패해 마지막 캐시 데이터를 표시하고 있습니다.";
    }
  }
}

function bindControls() {
  const rerender = () => {
    state.visibleCount = initialVisibleCount;
    applyFilters();
  };

  elements.searchInput.addEventListener("input", rerender);
  elements.languageFilter.addEventListener("change", rerender);
  elements.typeFilter.addEventListener("change", rerender);
  elements.sortSelect.addEventListener("change", rerender);
  elements.loadMoreButton.addEventListener("click", () => {
    state.visibleCount += loadIncrement;
    renderProjectGrid();
  });
}

async function fetchProfile(user) {
  const response = await fetch(`https://api.github.com/users/${user}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  return response.json();
}

async function fetchAllRepos(user) {
  const repos = [];
  const perPage = 100;
  let page = 1;
  let shouldContinue = true;

  while (shouldContinue && page <= 10) {
    const response = await fetch(
      `https://api.github.com/users/${user}/repos?type=owner&sort=updated&direction=desc&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.status}`);
    }

    const batch = await response.json();
    repos.push(...batch);
    shouldContinue = batch.length === perPage;
    page += 1;
  }

  return repos;
}

function hydrate(profile, repos, timestamp, fromCache) {
  state.profile = profile;
  state.repos = normalizeRepos(repos);
  state.lastUpdatedLabel = formatDateTime(timestamp);

  renderProfile(fromCache);
  populateLanguageFilter();
  applyFilters();
}

function normalizeRepos(repos) {
  return repos
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      description: repo.description || "설명이 비어 있습니다. 저장소 링크에서 구조와 코드를 직접 확인할 수 있습니다.",
      language: repo.language || "Other",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      archived: Boolean(repo.archived),
      fork: Boolean(repo.fork),
      openIssues: repo.open_issues_count || 0,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      size: repo.size || 0,
    }))
    .sort((left, right) => new Date(right.pushedAt) - new Date(left.pushedAt));
}

function renderProfile(fromCache) {
  const { profile, repos, lastUpdatedLabel } = state;
  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const languageCount = new Set(repos.map((repo) => repo.language)).size;
  const latestPush = repos[0]?.pushedAt;

  elements.profileAvatar.src = profile.avatar_url;
  elements.profileAvatar.alt = `${profile.login} GitHub avatar`;
  elements.profileName.textContent = profile.name || profile.login;
  elements.profileBio.textContent =
    profile.bio ||
    "공개 저장소 활동을 기반으로 최신 프로젝트와 작업 흐름을 정리해 보여주는 포트폴리오입니다.";
  elements.publicRepoCount.textContent = formatNumber(profile.public_repos ?? repos.length);
  elements.totalStars.textContent = formatNumber(totalStars);
  elements.languageCount.textContent = formatNumber(languageCount);
  elements.lastPushDate.textContent = latestPush ? formatShortDate(latestPush) : "-";
  elements.dataFreshness.textContent = fromCache
    ? `캐시된 GitHub 스냅샷 기준입니다. 마지막 동기화: ${lastUpdatedLabel}`
    : `GitHub API 기준 실시간 반영 중입니다. 마지막 동기화: ${lastUpdatedLabel}`;
}

function populateLanguageFilter() {
  const currentValue = elements.languageFilter.value;
  const languages = [...new Set(state.repos.map((repo) => repo.language))].sort((a, b) =>
    a.localeCompare(b),
  );

  elements.languageFilter.innerHTML = '<option value="all">전체</option>';
  for (const language of languages) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    elements.languageFilter.append(option);
  }

  if (languages.includes(currentValue)) {
    elements.languageFilter.value = currentValue;
  }
}

function applyFilters() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const language = elements.languageFilter.value;
  const type = elements.typeFilter.value;
  const sort = elements.sortSelect.value;

  let filtered = [...state.repos];

  if (query) {
    filtered = filtered.filter((repo) => {
      const haystack = [repo.name, repo.description, repo.language].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  if (language !== "all") {
    filtered = filtered.filter((repo) => repo.language === language);
  }

  if (type === "source") {
    filtered = filtered.filter((repo) => !repo.fork && !repo.archived);
  } else if (type === "archived") {
    filtered = filtered.filter((repo) => repo.archived);
  } else if (type !== "forks") {
    filtered = filtered.filter((repo) => !repo.fork);
  }

  if (sort === "stars") {
    filtered.sort((left, right) => right.stars - left.stars || compareDates(right.pushedAt, left.pushedAt));
  } else if (sort === "name") {
    filtered.sort((left, right) => left.name.localeCompare(right.name));
  } else {
    filtered.sort((left, right) => compareDates(right.pushedAt, left.pushedAt));
  }

  state.filteredRepos = filtered;
  renderFeaturedProjects();
  renderProjectGrid();
}

function renderFeaturedProjects() {
  const featured = [...state.repos]
    .filter((repo) => !repo.archived && !repo.fork)
    .sort((left, right) => featuredScore(right) - featuredScore(left))
    .slice(0, 6);

  if (!featured.length) {
    elements.featuredProjects.innerHTML =
      '<article class="repo-card repo-card-placeholder"><p>표시할 대표 프로젝트가 아직 없습니다.</p></article>';
    return;
  }

  elements.featuredProjects.innerHTML = featured.map((repo) => renderRepoCard(repo, true)).join("");
}

function renderProjectGrid() {
  const total = state.filteredRepos.length;
  const visible = state.filteredRepos.slice(0, state.visibleCount);

  elements.resultSummary.textContent = `현재 ${formatNumber(total)}개 프로젝트가 조건에 맞습니다. 최신 활동이 많은 저장소부터 검토해 보세요.`;

  if (!visible.length) {
    elements.projectGrid.innerHTML =
      '<article class="repo-card repo-card-placeholder"><p>조건에 맞는 프로젝트가 없습니다. 검색어나 필터를 조정해 보세요.</p></article>';
  } else {
    elements.projectGrid.innerHTML = visible.map((repo) => renderRepoCard(repo, false)).join("");
  }

  const hasMore = total > visible.length;
  elements.loadMoreButton.hidden = !hasMore;
  elements.loadMoreButton.textContent = hasMore
    ? `${formatNumber(Math.min(loadIncrement, total - visible.length))}개 더 보기`
    : "모든 프로젝트를 표시 중";
}

function renderRepoCard(repo, featured) {
  const badges = [
    repo.language ? `<span class="repo-badge repo-badge-language">${escapeHtml(repo.language)}</span>` : "",
    repo.archived ? '<span class="repo-badge repo-badge-muted">Archived</span>' : "",
    repo.fork ? '<span class="repo-badge repo-badge-muted">Fork</span>' : "",
  ]
    .filter(Boolean)
    .join("");

  const homepageLink = repo.homepage
    ? `<a class="repo-link" href="${escapeAttribute(repo.homepage)}" target="_blank" rel="noreferrer">Live</a>`
    : "";
  const featuredTag = featured ? '<span class="repo-tag">Featured</span>' : "";

  return `
    <article class="repo-card">
      <div class="repo-header">
        <div>
          <div class="repo-badges">
            ${featuredTag}
            ${badges}
          </div>
          <h3><a href="${escapeAttribute(repo.htmlUrl)}" target="_blank" rel="noreferrer">${escapeHtml(repo.name)}</a></h3>
        </div>
      </div>
      <p class="repo-description">${escapeHtml(repo.description)}</p>
      <div class="repo-footer">
        <div class="repo-meta">
          <span>Updated ${escapeHtml(formatShortDate(repo.pushedAt))}</span>
          <span>Stars ${formatNumber(repo.stars)}</span>
          <span>Forks ${formatNumber(repo.forks)}</span>
        </div>
        <div class="repo-links">
          ${homepageLink}
          <a class="repo-link" href="${escapeAttribute(repo.htmlUrl)}" target="_blank" rel="noreferrer">Repo</a>
        </div>
      </div>
    </article>
  `;
}

function featuredScore(repo) {
  const ageInDays = Math.max(1, Math.round((Date.now() - new Date(repo.pushedAt).getTime()) / 86400000));
  const freshness = Math.max(0, 120 - ageInDays);
  const richness = repo.description ? 18 : 0;
  return freshness + repo.stars * 6 + repo.forks * 2 + richness;
}

function compareDates(left, right) {
  return new Date(left).getTime() - new Date(right).getTime();
}

function renderErrorState() {
  elements.profileBio.textContent =
    "GitHub 데이터를 불러오지 못했습니다. 아래 저장소 링크를 통해 직접 최신 프로젝트를 확인해 주세요.";
  elements.dataFreshness.textContent =
    "실시간 로딩에 실패했습니다. 네트워크 상태 또는 GitHub API 제한을 확인해 주세요.";
  elements.featuredProjects.innerHTML =
    '<article class="repo-card repo-card-placeholder"><p>대표 프로젝트를 불러오지 못했습니다.</p></article>';
  elements.projectGrid.innerHTML = `
    <article class="repo-card repo-card-placeholder">
      <p>프로젝트 목록 로딩에 실패했습니다. <a class="repo-link" href="https://github.com/${username}?tab=repositories" target="_blank" rel="noreferrer">GitHub 저장소 목록</a>에서 직접 확인할 수 있습니다.</p>
    </article>
  `;
  elements.resultSummary.textContent = "프로젝트 데이터를 가져오지 못했습니다.";
  elements.loadMoreButton.hidden = true;
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function writeCache(profile, repos) {
  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({
        profile,
        repos,
        cachedAt: Date.now(),
      }),
    );
  } catch (error) {
    console.error(error);
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
