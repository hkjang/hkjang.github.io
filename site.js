const username = document.body.dataset.username || "hkjang";
const cacheKey = `portfolio:${username}:v4`;
const localeKey = `portfolio:${username}:locale`;
const cacheTtlMs = 1000 * 60 * 30;
const initialVisibleCount = 18;
const loadIncrement = 18;

const elements = {
  currentYear: document.getElementById("currentYear"),
  localeToggle: document.getElementById("localeToggle"),
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
  metaDescription: document.getElementById("metaDescription"),
  metaKeywords: document.getElementById("metaKeywords"),
  ogLocale: document.getElementById("ogLocale"),
  ogTitle: document.getElementById("ogTitle"),
  ogDescription: document.getElementById("ogDescription"),
  ogImage: document.getElementById("ogImage"),
  twitterTitle: document.getElementById("twitterTitle"),
  twitterDescription: document.getElementById("twitterDescription"),
  twitterImage: document.getElementById("twitterImage"),
  structuredData: document.getElementById("structuredData"),
};

const defaultStaticText = captureTextMap("data-i18n");
const defaultPlaceholderText = captureAttributeMap("data-i18n-placeholder", "placeholder");
const defaultAriaText = captureAttributeMap("data-i18n-aria-label", "aria-label");
const defaultMeta = {
  title: document.title,
  description: elements.metaDescription.content,
  keywords: elements.metaKeywords.content,
};

const koStaticText = {
  "nav.skip": "본문으로 건너뛰기",
  "nav.featured": "대표 프로젝트",
  "nav.projects": "프로젝트",
  "nav.approach": "실행 방식",
  "nav.faq": "FAQ",
  "nav.contact": "협업",
  "hero.eyebrow": "라이브 GitHub 포트폴리오",
  "hero.title": "AI와 소프트웨어를 빠르게 제품화하고, 공개된 결과로 실행력을 증명합니다.",
  "hero.lede":
    "이 사이트는 hkjang의 GitHub 공개 저장소를 실시간으로 정리해, 기술 역량과 제품화 감각, 업데이트 속도를 한눈에 보여주는 포트폴리오입니다. 한국의 IT·AI 전문가와 투자자가 최근 프로젝트 흐름을 바로 검토할 수 있도록 구성했습니다.",
  "hero.ctaPrimary": "프로젝트 전체 보기",
  "hero.ctaSecondary": "GitHub 프로필 열기",
  "hero.point1": "실시간 공개 저장소 반영",
  "hero.point2": "100개 이상 프로젝트 탐색 구조",
  "hero.point3": "기술·제품·업데이트 신호 확인",
  "profile.kicker": "GitHub 기반 포트폴리오",
  "profile.stats.publicRepos": "공개 저장소",
  "profile.stats.totalStars": "전체 스타",
  "profile.stats.languages": "언어 수",
  "profile.stats.lastPush": "최근 푸시",
  "answers.eyebrow": "핵심 요약",
  "answers.title": "기술 리더와 투자자가 먼저 봐야 할 포인트",
  "answers.body":
    "이 페이지는 무엇을 만들고 있는지, 얼마나 빠르게 반복하고 있는지, 그리고 어디서 바로 검증할 수 있는지를 빠르게 전달하도록 설계했습니다.",
  "answers.card1.title": "무엇을 하는 사람인가?",
  "answers.card1.body":
    "AI, 소프트웨어, 자동화 프로젝트를 빠르게 설계하고 공개 저장소와 배포 결과물로 실행력을 증명하는 빌더입니다.",
  "answers.card2.title": "왜 신뢰할 수 있는가?",
  "answers.card2.body":
    "GitHub API로 최신 저장소와 업데이트 흐름을 직접 반영해, 말이 아니라 공개된 실행 기록으로 확인할 수 있습니다.",
  "answers.card3.title": "무엇을 확인할 수 있는가?",
  "answers.card3.body":
    "저장소 설명, 기술 스택, 최근 업데이트, 스타·포크, 라이브 링크까지 기술 검토와 투자 판단에 필요한 신호를 바로 볼 수 있습니다.",
  "impact.eyebrow": "이 페이지의 의도",
  "impact.title": "정적인 소개 페이지가 아니라, 지속적인 빌드·배포·개선 능력을 보여주는 포트폴리오",
  "impact.body":
    "최근 작업량, 기술 깊이, 제품화 감각이 드러나도록 구조를 설계했습니다. 빠르게 만들고 공개하고 개선하는 팀에 특히 어필하도록 다듬었습니다.",
  "impact.card1.title": "실행력이 보이는 포트폴리오",
  "impact.card1.body":
    "GitHub에서 최신 저장소를 직접 가져오기 때문에 새 프로젝트와 최근 업데이트가 곧바로 반영됩니다.",
  "impact.card2.title": "프로젝트 밀도를 견디는 탐색성",
  "impact.card2.body":
    "저장소가 많아도 검색, 언어 필터, 정렬로 핵심 프로젝트를 빠르게 선별할 수 있습니다.",
  "impact.card3.title": "기술과 사업성을 함께 전달",
  "impact.card3.body":
    "단순 작업 목록이 아니라 무엇을 만들었고 어떤 문제를 푸는 사람인지가 자연스럽게 드러나도록 카피를 정리했습니다.",
  "featured.eyebrow": "대표 프로젝트",
  "featured.title": "최근성, 완성도, 시장 신호를 함께 반영한 핵심 저장소",
  "featured.body": "처음 방문한 사람이 어디부터 봐야 할지 고민하지 않도록, 업데이트 속도와 설명 밀도, 관심도 신호를 기준으로 우선 노출합니다.",
  "explorer.eyebrow": "프로젝트 탐색",
  "explorer.title": "최신 공개 프로젝트를 기술 관점과 제품 관점에서 함께 탐색",
  "explorer.body":
    "최신순, 스타순, 이름순 정렬과 검색·언어 필터를 통해 관심 있는 영역의 저장소를 빠르게 확인할 수 있습니다.",
  "explorer.searchLabel": "프로젝트 검색",
  "explorer.languageLabel": "언어",
  "explorer.typeLabel": "프로젝트 유형",
  "explorer.sortLabel": "정렬 기준",
  "approach.eyebrow": "실행 방식",
  "approach.title": "문제 정의부터 공개 검증까지 빠르게 연결합니다",
  "approach.body":
    "실험을 코드로 만들고, 제품 형태로 공개하고, 데이터와 피드백으로 다시 개선하는 흐름을 지향합니다.",
  "approach.card1.title": "빠른 제품화",
  "approach.card1.body": "아이디어를 짧은 주기로 프로토타입과 배포 가능한 결과물로 전환합니다.",
  "approach.card2.title": "지속적인 개선",
  "approach.card2.body": "첫 릴리스 이후에도 커밋과 업데이트를 이어가며 완성도를 끌어올립니다.",
  "approach.card3.title": "검증 가능한 공개성",
  "approach.card3.body": "소스, 메타데이터, 라이브 링크를 공개해 기술 검토와 협업 판단이 쉽도록 만듭니다.",
  "faq.eyebrow": "FAQ",
  "faq.title": "전문가와 투자자가 자주 묻는 질문",
  "faq.body": "기술 역량, 업데이트 지속성, 검증 가능성을 빠르게 파악할 수 있도록 핵심 질문에 답합니다.",
  "faq.q1": "hkjang은 어떤 영역의 프로젝트를 주로 만드나요?",
  "faq.a1": "AI 활용 제품, 개발 생산성 도구, 자동화 워크플로, 실험적 프로토타입 등 실제로 빠르게 검증 가능한 소프트웨어 프로젝트를 중심으로 작업합니다.",
  "faq.q2": "이 페이지는 어떻게 최신 상태를 유지하나요?",
  "faq.a2": "저장소 목록을 GitHub REST API에서 직접 불러오므로 새 공개 저장소와 최근 업데이트가 페이지에 바로 반영됩니다.",
  "faq.q3": "프로젝트 검토는 어디서 시작하면 되나요?",
  "faq.a3": "대표 프로젝트 카드와 전체 저장소 탐색기에서 관심 있는 저장소를 고른 뒤, GitHub 소스와 라이브 링크에서 바로 기술 검토를 이어갈 수 있습니다.",
  "cta.eyebrow": "협업 및 투자 대화",
  "cta.title": "프로젝트 검토, 기술 실사, 협업 제안은 GitHub에서 바로 시작할 수 있습니다.",
  "cta.body":
    "가장 최신 정보는 항상 GitHub에 있습니다. 관심 있는 저장소를 열어 기술 완성도와 실행 속도를 바로 확인해 보세요.",
  "cta.primary": "전체 저장소 바로 보기",
  "cta.secondary": "GitHub 프로필 보기",
  "footer.builtWith": "GitHub Pages 위에 구축했고, GitHub REST API와 구조화 메타데이터를 결합해 검색과 답변 엔진 가시성을 높였습니다.",
};

const dynamicCopy = {
  en: {
    meta: defaultMeta,
    localeToggleLabel: "한국어",
    localeToggleAria: "Switch page language",
    searchPlaceholder: defaultPlaceholderText.get("explorer.searchPlaceholder"),
    loadingBio: "Loading public profile and repository context.",
    fallbackBio: "A live portfolio that organizes recent public repositories and project activity into one reviewable page.",
    loadingData: "Loading live GitHub data.",
    statusLive: ({ time }) => `Live GitHub data synced ${time}.`,
    statusCached: ({ time }) => `Showing a recent cached GitHub snapshot from ${time}.`,
    statusStale: ({ time }) => `Showing a temporary cached GitHub snapshot from ${time}.`,
    allLabel: "All",
    typeOptions: { all: "All", source: "Original projects only", forks: "Forks only", archived: "Archived only" },
    sortOptions: { updated: "Most recently updated", stars: "Most starred", name: "Name A-Z" },
    featuredLoading: "Calculating featured repositories.",
    featuredEmpty: "There are no featured repositories to show yet.",
    resultLoading: "Loading repository data.",
    projectLoading: "Preparing repository list.",
    resultSummary: ({ count }) => `${count} repositories match the current filters.`,
    noResults: "No repositories match the current filters. Try a different query or filter.",
    loadMoreDefault: "Load more",
    loadMore: ({ count }) => `Load ${count} more`,
    showingAll: "Showing all matching repositories",
    repoUpdated: ({ value }) => `Updated ${value}`,
    repoStars: ({ value }) => `Stars ${value}`,
    repoForks: ({ value }) => `Forks ${value}`,
    repoLive: "Live",
    repoLabel: "Repo",
    repoArchived: "Archived",
    repoFork: "Fork",
    repoFeatured: "Featured",
    repoOtherLanguage: "Other",
    errorRefreshCached: "Refreshing from GitHub failed, so the most recent cached snapshot is shown.",
    errorProfileLoad: "GitHub data could not be loaded. You can still review repositories directly on GitHub.",
    errorFreshness: "Live loading failed. Check network access or GitHub API limits.",
    errorFeatured: "Unable to load featured repositories.",
    errorProject: "Unable to load repository list.",
    errorProjectLink: "GitHub repositories page",
    errorProjectResult: "Repository data could not be loaded.",
  },
  ko: {
    meta: {
      title: "hkjang | AI·소프트웨어 GitHub 포트폴리오",
      description: "AI와 소프트웨어 프로젝트를 빠르게 제품화하는 hkjang의 최신 GitHub 저장소, 대표 프로젝트, 실행 방식, 공개 업데이트 흐름을 한눈에 볼 수 있는 포트폴리오입니다.",
      keywords: "hkjang, AI 포트폴리오, 소프트웨어 포트폴리오, GitHub 포트폴리오, 개발자, 스타트업, 투자, 오픈소스, 자동화, 인공지능",
    },
    localeToggleLabel: "English",
    localeToggleAria: "페이지 언어 전환",
    searchPlaceholder: "프로젝트명, 설명, 기술 키워드 검색",
    loadingBio: "공개 프로필과 최신 프로젝트 흐름을 불러오는 중입니다.",
    fallbackBio: "AI와 소프트웨어 프로젝트를 빠르게 제품화하고, 공개 저장소로 실행력을 증명하는 포트폴리오입니다.",
    loadingData: "GitHub에서 최신 프로젝트 데이터를 불러오는 중입니다.",
    statusLive: ({ time }) => `GitHub 실시간 데이터 기준입니다. 마지막 동기화: ${time}`,
    statusCached: ({ time }) => `최근 캐시된 GitHub 스냅샷 기준입니다. 마지막 동기화: ${time}`,
    statusStale: ({ time }) => `임시 캐시 스냅샷을 표시 중입니다. 마지막 동기화: ${time}`,
    allLabel: "전체",
    typeOptions: { all: "전체", source: "원본 저장소만", forks: "포크만", archived: "보관 저장소만" },
    sortOptions: { updated: "최신 업데이트", stars: "스타 순", name: "이름 순" },
    featuredLoading: "대표 프로젝트를 선별하는 중입니다.",
    featuredEmpty: "표시할 대표 저장소가 아직 없습니다.",
    resultLoading: "저장소 데이터를 불러오는 중입니다.",
    projectLoading: "최신 저장소 목록을 준비하는 중입니다.",
    resultSummary: ({ count }) => `현재 ${count}개 프로젝트가 조건에 맞습니다.`,
    noResults: "조건에 맞는 저장소가 없습니다. 검색어나 필터를 조정해 보세요.",
    loadMoreDefault: "더 보기",
    loadMore: ({ count }) => `${count}개 더 보기`,
    showingAll: "모든 일치 프로젝트를 표시 중",
    repoUpdated: ({ value }) => `업데이트 ${value}`,
    repoStars: ({ value }) => `스타 ${value}`,
    repoForks: ({ value }) => `포크 ${value}`,
    repoLive: "라이브",
    repoLabel: "소스",
    repoArchived: "보관",
    repoFork: "포크",
    repoFeatured: "핵심",
    repoOtherLanguage: "기타",
    errorRefreshCached: "GitHub 새로고침에 실패해 최근 캐시 스냅샷을 임시로 표시하고 있습니다.",
    errorProfileLoad: "GitHub 데이터를 불러오지 못했습니다. GitHub 저장소에서 최신 프로젝트를 직접 확인할 수 있습니다.",
    errorFreshness: "실시간 로딩에 실패했습니다. 네트워크 상태 또는 GitHub API 제한을 확인해 주세요.",
    errorFeatured: "대표 저장소를 불러오지 못했습니다.",
    errorProject: "저장소 목록을 불러오지 못했습니다.",
    errorProjectLink: "GitHub 저장소 목록",
    errorProjectResult: "저장소 데이터를 불러오지 못했습니다.",
  },
};

const state = {
  locale: detectLocale(),
  profile: null,
  repos: [],
  filteredRepos: [],
  visibleCount: initialVisibleCount,
  syncedAt: null,
  fromCache: false,
  staleCache: false,
};

init();

async function init() {
  elements.currentYear.textContent = String(new Date().getFullYear());
  bindControls();
  applyStaticTranslations();
  renderLoadingState();
  updateStructuredData();

  const cached = readCache();
  if (cached) {
    hydrate(cached.profile, cached.repos, cached.cachedAt, true, cached.isStale);
  }

  try {
    const [profile, repos] = await Promise.all([fetchProfile(username), fetchAllRepos(username)]);
    writeCache(profile, repos);
    hydrate(profile, repos, Date.now(), false, false);
  } catch (error) {
    console.error(error);
    if (!cached) {
      renderErrorState();
    } else {
      elements.dataFreshness.textContent = copy().errorRefreshCached;
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
  elements.localeToggle.addEventListener("click", toggleLocale);
}

function toggleLocale() {
  state.locale = state.locale === "ko" ? "en" : "ko";
  writeLocalePreference(state.locale);
  applyStaticTranslations();

  if (state.profile || state.repos.length) {
    renderProfile();
    populateLanguageFilter();
    applyFilters();
  } else {
    renderLoadingState();
  }

  updateStructuredData();
}

function applyStaticTranslations() {
  const localized = state.locale === "ko";
  document.documentElement.lang = localized ? "ko" : "en";

  for (const node of document.querySelectorAll("[data-i18n]")) {
    const key = node.dataset.i18n;
    node.textContent = localized ? koStaticText[key] || defaultStaticText.get(key) : defaultStaticText.get(key);
  }

  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    const key = node.dataset.i18nPlaceholder;
    node.placeholder = localized ? copy().searchPlaceholder : defaultPlaceholderText.get(key);
  }

  for (const node of document.querySelectorAll("[data-i18n-aria-label]")) {
    const key = node.dataset.i18nAriaLabel;
    node.setAttribute("aria-label", localized ? copy().localeToggleAria : defaultAriaText.get(key));
  }

  renderStaticSelectOptions();
  elements.localeToggle.textContent = copy().localeToggleLabel;
  updateMetaTags();
}

function renderStaticSelectOptions() {
  const selectedType = elements.typeFilter.value || "all";
  const selectedSort = elements.sortSelect.value || "updated";
  const currentCopy = copy();

  elements.typeFilter.innerHTML = renderOptions(currentCopy.typeOptions, selectedType);
  elements.sortSelect.innerHTML = renderOptions(currentCopy.sortOptions, selectedSort);
}

function renderOptions(optionMap, selectedValue) {
  return Object.entries(optionMap)
    .map(([value, label]) => {
      const selected = value === selectedValue ? " selected" : "";
      return `<option value="${escapeAttribute(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function renderLoadingState() {
  const currentCopy = copy();
  elements.profileBio.textContent = currentCopy.loadingBio;
  elements.dataFreshness.textContent = currentCopy.loadingData;
  elements.resultSummary.textContent = currentCopy.resultLoading;
  elements.loadMoreButton.textContent = currentCopy.loadMoreDefault;
  elements.featuredProjects.innerHTML = `<article class="repo-card repo-card-placeholder"><p>${escapeHtml(currentCopy.featuredLoading)}</p></article>`;
  elements.projectGrid.innerHTML = `<article class="repo-card repo-card-placeholder"><p>${escapeHtml(currentCopy.projectLoading)}</p></article>`;
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

  while (page <= 10) {
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
    if (batch.length < perPage) {
      break;
    }
    page += 1;
  }

  return repos;
}

function hydrate(profile, repos, timestamp, fromCache, isStale) {
  state.profile = profile;
  state.repos = repos
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      description: repo.description || "",
      rawLanguage: repo.language || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      archived: Boolean(repo.archived),
      fork: Boolean(repo.fork),
      pushedAt: repo.pushed_at,
    }))
    .sort((left, right) => new Date(right.pushedAt) - new Date(left.pushedAt));
  state.syncedAt = timestamp;
  state.fromCache = fromCache;
  state.staleCache = isStale;

  renderProfile();
  populateLanguageFilter();
  applyFilters();
  updateMetaTags();
  updateStructuredData();
}

function renderProfile() {
  const currentCopy = copy();
  const profile = state.profile || {};
  const totalStars = state.repos.reduce((sum, repo) => sum + repo.stars, 0);
  const languageCount = new Set(state.repos.map((repo) => getRepoLanguage(repo))).size;
  const latestPush = state.repos[0]?.pushedAt;
  const syncedAt = state.syncedAt ? formatDateTime(state.syncedAt) : "-";

  if (profile.avatar_url) {
    elements.profileAvatar.src = profile.avatar_url;
    elements.profileAvatar.alt = `${profile.login || username} GitHub avatar`;
  }

  elements.profileName.textContent = profile.name || profile.login || username;
  elements.profileBio.textContent = profile.bio || currentCopy.fallbackBio;
  elements.publicRepoCount.textContent = formatNumber(profile.public_repos ?? state.repos.length);
  elements.totalStars.textContent = formatNumber(totalStars);
  elements.languageCount.textContent = formatNumber(languageCount);
  elements.lastPushDate.textContent = latestPush ? formatShortDate(latestPush) : "-";

  if (!state.fromCache) {
    elements.dataFreshness.textContent = currentCopy.statusLive({ time: syncedAt });
  } else if (state.staleCache) {
    elements.dataFreshness.textContent = currentCopy.statusStale({ time: syncedAt });
  } else {
    elements.dataFreshness.textContent = currentCopy.statusCached({ time: syncedAt });
  }
}

function populateLanguageFilter() {
  const currentValue = elements.languageFilter.value || "all";
  const currentCopy = copy();
  const languages = [...new Set(state.repos.map((repo) => getRepoLanguage(repo)))].sort((a, b) =>
    a.localeCompare(b),
  );

  elements.languageFilter.innerHTML = "";
  elements.languageFilter.append(new Option(currentCopy.allLabel, "all"));
  for (const language of languages) {
    elements.languageFilter.append(new Option(language, language));
  }

  elements.languageFilter.value = languages.includes(currentValue) ? currentValue : "all";
}

function applyFilters() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const language = elements.languageFilter.value;
  const type = elements.typeFilter.value;
  const sort = elements.sortSelect.value;
  let filtered = [...state.repos];

  if (query) {
    filtered = filtered.filter((repo) => {
      const haystack = [repo.name, repo.description || copy().fallbackBio, getRepoLanguage(repo)].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }

  if (language !== "all") {
    filtered = filtered.filter((repo) => getRepoLanguage(repo) === language);
  }

  if (type === "source") {
    filtered = filtered.filter((repo) => !repo.fork && !repo.archived);
  } else if (type === "forks") {
    filtered = filtered.filter((repo) => repo.fork);
  } else if (type === "archived") {
    filtered = filtered.filter((repo) => repo.archived);
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
    elements.featuredProjects.innerHTML = `<article class="repo-card repo-card-placeholder"><p>${escapeHtml(copy().featuredEmpty)}</p></article>`;
    return;
  }

  elements.featuredProjects.innerHTML = featured.map((repo) => renderRepoCard(repo, true)).join("");
}

function renderProjectGrid() {
  const currentCopy = copy();
  const total = state.filteredRepos.length;
  const visible = state.filteredRepos.slice(0, state.visibleCount);

  elements.resultSummary.textContent = currentCopy.resultSummary({ count: formatNumber(total) });

  if (!visible.length) {
    elements.projectGrid.innerHTML = `<article class="repo-card repo-card-placeholder"><p>${escapeHtml(currentCopy.noResults)}</p></article>`;
  } else {
    elements.projectGrid.innerHTML = visible.map((repo) => renderRepoCard(repo, false)).join("");
  }

  const hasMore = total > visible.length;
  elements.loadMoreButton.hidden = !hasMore;
  elements.loadMoreButton.textContent = hasMore
    ? currentCopy.loadMore({ count: formatNumber(Math.min(loadIncrement, total - visible.length)) })
    : currentCopy.showingAll;
}

function renderRepoCard(repo, featured) {
  const currentCopy = copy();
  const language = getRepoLanguage(repo);
  const description = repo.description || currentCopy.fallbackBio;
  const badges = [
    language ? `<span class="repo-badge repo-badge-language">${escapeHtml(language)}</span>` : "",
    repo.archived ? `<span class="repo-badge repo-badge-muted">${escapeHtml(currentCopy.repoArchived)}</span>` : "",
    repo.fork ? `<span class="repo-badge repo-badge-muted">${escapeHtml(currentCopy.repoFork)}</span>` : "",
  ]
    .filter(Boolean)
    .join("");
  const featuredTag = featured ? `<span class="repo-tag">${escapeHtml(currentCopy.repoFeatured)}</span>` : "";
  const homepageLink = repo.homepage
    ? `<a class="repo-link" href="${escapeAttribute(repo.homepage)}" target="_blank" rel="noreferrer">${escapeHtml(currentCopy.repoLive)}</a>`
    : "";

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
      <p class="repo-description">${escapeHtml(description)}</p>
      <div class="repo-footer">
        <div class="repo-meta">
          <span>${escapeHtml(currentCopy.repoUpdated({ value: formatShortDate(repo.pushedAt) }))}</span>
          <span>${escapeHtml(currentCopy.repoStars({ value: formatNumber(repo.stars) }))}</span>
          <span>${escapeHtml(currentCopy.repoForks({ value: formatNumber(repo.forks) }))}</span>
        </div>
        <div class="repo-links">
          ${homepageLink}
          <a class="repo-link" href="${escapeAttribute(repo.htmlUrl)}" target="_blank" rel="noreferrer">${escapeHtml(currentCopy.repoLabel)}</a>
        </div>
      </div>
    </article>
  `;
}

function renderErrorState() {
  const currentCopy = copy();
  elements.profileBio.textContent = currentCopy.errorProfileLoad;
  elements.dataFreshness.textContent = currentCopy.errorFreshness;
  elements.featuredProjects.innerHTML = `<article class="repo-card repo-card-placeholder"><p>${escapeHtml(currentCopy.errorFeatured)}</p></article>`;
  elements.projectGrid.innerHTML = `
    <article class="repo-card repo-card-placeholder">
      <p>${escapeHtml(currentCopy.errorProject)} <a class="repo-link" href="https://github.com/${username}?tab=repositories" target="_blank" rel="noreferrer">${escapeHtml(currentCopy.errorProjectLink)}</a></p>
    </article>
  `;
  elements.resultSummary.textContent = currentCopy.errorProjectResult;
  elements.loadMoreButton.hidden = true;
  updateMetaTags();
  updateStructuredData();
}

function updateMetaTags() {
  const meta = copy().meta;
  document.title = meta.title;
  elements.metaDescription.content = meta.description;
  elements.metaKeywords.content = meta.keywords;
  elements.ogLocale.content = state.locale === "ko" ? "ko_KR" : "en_US";
  elements.ogTitle.content = meta.title;
  elements.ogDescription.content = meta.description;
  elements.twitterTitle.content = meta.title;
  elements.twitterDescription.content = meta.description;

  if (state.profile?.avatar_url) {
    elements.ogImage.content = state.profile.avatar_url;
    elements.twitterImage.content = state.profile.avatar_url;
  }
}

function updateStructuredData() {
  const currentCopy = copy();
  const profile = state.profile || {};
  const topRepos = [...state.repos]
    .filter((repo) => !repo.fork)
    .sort((left, right) => featuredScore(right) - featuredScore(left))
    .slice(0, 10);
  const topLanguages = [...new Set(topRepos.map((repo) => getRepoLanguage(repo)).filter(Boolean))].slice(0, 8);
  const profileName = profile.name || profile.login || username;
  const profileDescription = profile.bio || currentCopy.fallbackBio;
  const faqEntries = [
    {
      question: state.locale === "ko" ? koStaticText["faq.q1"] : defaultStaticText.get("faq.q1"),
      answer: state.locale === "ko" ? koStaticText["faq.a1"] : defaultStaticText.get("faq.a1"),
    },
    {
      question: state.locale === "ko" ? koStaticText["faq.q2"] : defaultStaticText.get("faq.q2"),
      answer: state.locale === "ko" ? koStaticText["faq.a2"] : defaultStaticText.get("faq.a2"),
    },
    {
      question: state.locale === "ko" ? koStaticText["faq.q3"] : defaultStaticText.get("faq.q3"),
      answer: state.locale === "ko" ? koStaticText["faq.a3"] : defaultStaticText.get("faq.a3"),
    },
  ];

  elements.structuredData.textContent = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://hkjang.github.io/#website",
          url: "https://hkjang.github.io/",
          name: "hkjang GitHub Portfolio",
          description: currentCopy.meta.description,
          inLanguage: ["en", "ko"],
          about: {
            "@id": "https://hkjang.github.io/#person",
          },
        },
        {
          "@type": "ProfilePage",
          "@id": "https://hkjang.github.io/#profile",
          url: "https://hkjang.github.io/",
          name: currentCopy.meta.title,
          description: currentCopy.meta.description,
          inLanguage: state.locale,
          isPartOf: {
            "@id": "https://hkjang.github.io/#website",
          },
          mainEntity: {
            "@id": "https://hkjang.github.io/#person",
          },
        },
        {
          "@type": "Person",
          "@id": "https://hkjang.github.io/#person",
          name: profileName,
          alternateName: username,
          url: "https://github.com/hkjang",
          image: profile.avatar_url || "https://avatars.githubusercontent.com/u/0?v=4",
          description: profileDescription,
          sameAs: ["https://github.com/hkjang", "https://hkjang.github.io/"],
          knowsAbout: topLanguages,
        },
        {
          "@type": "ItemList",
          "@id": "https://hkjang.github.io/#projects",
          name: state.locale === "ko" ? koStaticText["explorer.title"] : defaultStaticText.get("explorer.title"),
          numberOfItems: state.repos.length,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          itemListElement: topRepos.map((repo, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: repo.htmlUrl,
            item: {
              "@type": "SoftwareSourceCode",
              name: repo.name,
              codeRepository: repo.htmlUrl,
              url: repo.homepage || repo.htmlUrl,
              description: repo.description || currentCopy.fallbackBio,
              programmingLanguage: getRepoLanguage(repo),
              dateModified: repo.pushedAt,
            },
          })),
        },
        {
          "@type": "FAQPage",
          "@id": "https://hkjang.github.io/#faq",
          inLanguage: state.locale,
          mainEntity: faqEntries.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    },
    null,
    2,
  );
}

function getRepoLanguage(repo) {
  return repo.rawLanguage || copy().repoOtherLanguage;
}

function featuredScore(repo) {
  const ageInDays = Math.max(1, Math.round((Date.now() - new Date(repo.pushedAt).getTime()) / 86400000));
  return Math.max(0, 120 - ageInDays) + repo.stars * 6 + repo.forks * 2 + (repo.description ? 18 : 0);
}

function compareDates(left, right) {
  return new Date(left).getTime() - new Date(right).getTime();
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      isStale: Date.now() - parsed.cachedAt > cacheTtlMs,
    };
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

function detectLocale() {
  try {
    const saved = window.localStorage.getItem(localeKey);
    if (saved === "ko" || saved === "en") {
      return saved;
    }
  } catch (error) {
    console.error(error);
  }

  const preferred = navigator.languages?.[0] || navigator.language || "en";
  return preferred.toLowerCase().startsWith("ko") ? "ko" : "en";
}

function writeLocalePreference(locale) {
  try {
    window.localStorage.setItem(localeKey, locale);
  } catch (error) {
    console.error(error);
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat(getIntlLocale()).format(value);
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(getIntlLocale(), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getIntlLocale() {
  return state.locale === "ko" ? "ko-KR" : "en-US";
}

function copy() {
  return dynamicCopy[state.locale];
}

function captureTextMap(attributeName) {
  const map = new Map();
  for (const node of document.querySelectorAll(`[${attributeName}]`)) {
    map.set(node.getAttribute(attributeName), node.textContent);
  }
  return map;
}

function captureAttributeMap(attributeName, targetAttribute) {
  const map = new Map();
  for (const node of document.querySelectorAll(`[${attributeName}]`)) {
    map.set(node.getAttribute(attributeName), node.getAttribute(targetAttribute) || "");
  }
  return map;
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
