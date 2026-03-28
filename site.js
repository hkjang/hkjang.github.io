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
  "nav.approach": "방식",
  "nav.faq": "FAQ",
  "nav.contact": "연락",
  "hero.eyebrow": "라이브 GitHub 포트폴리오",
  "hero.title": "계속 만들고, 빠르게 배포하고, 공개적으로 증명합니다.",
  "hero.lede":
    "이 사이트는 hkjang의 공개 GitHub 저장소를 실시간으로 읽어와 실제로 검토할 수 있는 포트폴리오로 정리합니다. 정적인 자기소개가 아니라 현재 결과물을 보여주기 위해 설계했습니다.",
  "hero.ctaPrimary": "프로젝트 전체 보기",
  "hero.ctaSecondary": "GitHub 프로필 열기",
  "hero.point1": "최신 공개 저장소 자동 반영",
  "hero.point2": "100개 이상 프로젝트 탐색 가능",
  "hero.point3": "검색, 필터, 정렬 지원",
  "profile.kicker": "GitHub 스냅샷",
  "profile.stats.publicRepos": "공개 저장소",
  "profile.stats.totalStars": "전체 스타",
  "profile.stats.languages": "언어 수",
  "profile.stats.lastPush": "최근 푸시",
  "answers.eyebrow": "빠른 답변",
  "answers.title": "방문자나 검색엔진이 바로 이해해야 하는 내용은 무엇인가요?",
  "answers.body":
    "이 페이지는 hkjang이 무엇을 만들고 있는지, 작업이 얼마나 최신인지, 어디서 바로 검증할 수 있는지를 빠르게 답하도록 구성했습니다.",
  "answers.card1.title": "이 페이지는 무엇인가요?",
  "answers.card1.body":
    "공개 GitHub 활동, 대표 저장소, 검색 가능한 프로젝트 이력을 한 번에 보여주는 라이브 포트폴리오 홈페이지입니다.",
  "answers.card2.title": "콘텐츠는 얼마나 최신인가요?",
  "answers.card2.body":
    "저장소 목록을 브라우저에서 GitHub REST API로 불러오기 때문에 공개 저장소 변화가 프로젝트 그리드에 계속 반영됩니다.",
  "answers.card3.title": "여기서 무엇을 검증할 수 있나요?",
  "answers.card3.body":
    "저장소 이름, 설명, 사용 언어, 스타 수, 최근 푸시 날짜, 소스 링크와 라이브 링크를 바로 확인할 수 있습니다.",
  "impact.eyebrow": "왜 이 사이트인가",
  "impact.title": "흔한 소개 템플릿이 아니라 최근 결과물을 증명하는 포트폴리오",
  "impact.body":
    "오래된 원페이지 템플릿 대신, 최근 저장소와 작업량, 프로젝트를 유지해 나가는 방식을 보여주도록 최적화했습니다.",
  "impact.card1.title": "실시간 신뢰도",
  "impact.card1.body":
    "저장소 데이터를 GitHub에서 직접 가져오기 때문에 새 프로젝트가 생겨도 포트폴리오를 매번 손으로 수정할 필요가 없습니다.",
  "impact.card2.title": "대량 프로젝트 대응",
  "impact.card2.body":
    "검색, 언어 필터, 정렬을 제공해 100개가 넘는 저장소도 긴 목록에 묻히지 않고 실용적으로 탐색할 수 있습니다.",
  "impact.card3.title": "홍보 가능한 스토리",
  "impact.card3.body":
    "무엇이 있는지만 나열하지 않고, 어떤 방식으로 만들고 배포하는 사람인지까지 레이아웃과 카피로 전달합니다.",
  "featured.eyebrow": "대표 프로젝트",
  "featured.title": "최신성, 설명 밀도, 관심도를 함께 반영한 대표 저장소",
  "featured.body": "방문자가 어디부터 봐야 할지 고민하지 않도록, 신호가 강한 프로젝트를 자동으로 우선 노출합니다.",
  "explorer.eyebrow": "프로젝트 탐색기",
  "explorer.title": "최신 공개 저장소를 한 곳에서 탐색",
  "explorer.body":
    "최신순, 스타순, 이름순으로 정렬하고 검색과 언어 필터로 빠르게 좁혀서 관련 작업을 찾을 수 있습니다.",
  "explorer.searchLabel": "검색",
  "explorer.languageLabel": "언어",
  "explorer.typeLabel": "구성",
  "explorer.sortLabel": "정렬",
  "approach.eyebrow": "작업 방식",
  "approach.title": "만드는 방식도 포트폴리오의 일부입니다",
  "approach.body":
    "페이지를 한 번 만들고 멈추는 것이 아니라, 저장소 이력과 공개 결과물, 배포 가능한 소개를 계속 맞춰 갑니다.",
  "approach.card1.title": "빠르게 배포",
  "approach.card1.body": "초기 프로토타입을 빠르게 공개하고, 아이디어를 검토 가능한 공개 결과물로 바꿉니다.",
  "approach.card2.title": "계속 개선",
  "approach.card2.body": "최근 푸시와 저장소 관리 상태로 첫 버전 이후에도 실험과 개선이 이어지고 있음을 보여줍니다.",
  "approach.card3.title": "작업을 공개",
  "approach.card3.body": "소스 링크와 메타데이터, 직접 열어볼 수 있는 저장소로 주장보다 검증이 쉬운 상태를 만듭니다.",
  "faq.eyebrow": "FAQ",
  "faq.title": "이 포트폴리오가 명확히 답해야 하는 질문",
  "faq.body": "사람과 답변 엔진이 모두 짧고 직접적인 문맥을 얻을 수 있도록 질문과 답변을 정리했습니다.",
  "faq.q1": "hkjang은 어떤 프로젝트를 만드나요?",
  "faq.a1": "이 포트폴리오는 소프트웨어 도구, 실험, 배포 가능한 앱, 지속적으로 발전 중인 공개 개발 작업을 담은 GitHub 저장소를 중심으로 소개합니다.",
  "faq.q2": "이 페이지는 어떻게 최신 상태를 유지하나요?",
  "faq.a2": "저장소 목록을 브라우저에서 GitHub REST API로 불러오기 때문에 새 공개 저장소와 최근 업데이트가 페이지를 수동 수정하지 않아도 반영됩니다.",
  "faq.q3": "프로젝트 세부 정보는 어디서 확인해야 하나요?",
  "faq.a3": "각 저장소 카드는 GitHub로 직접 연결되며, 홈페이지가 있는 프로젝트는 라이브 배포나 데모 링크도 함께 제공합니다.",
  "cta.eyebrow": "협업 가능",
  "cta.title": "프로젝트 검토, 기술 확인, 협업은 GitHub에서 바로 시작할 수 있습니다.",
  "cta.body":
    "가장 최신 정보는 항상 GitHub에 있습니다. 저장소를 열고 코드를 확인한 뒤, 이슈나 토론, 협업으로 바로 이어가면 됩니다.",
  "cta.primary": "전체 저장소 보기",
  "cta.secondary": "프로필 방문",
  "footer.builtWith": "GitHub Pages용으로 구성했고, GitHub REST API의 라이브 데이터와 검색용 구조화 메타데이터를 함께 사용합니다.",
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
      title: "hkjang | GitHub 프로젝트 포트폴리오와 개발자 소개",
      description: "hkjang의 최신 GitHub 저장소, 대표 프로젝트, 개발 방식, 공개 작업 흐름을 한 번에 살펴볼 수 있는 라이브 포트폴리오입니다.",
      keywords: "hkjang, GitHub 포트폴리오, 개발자 포트폴리오, 오픈소스, 공개 저장소, 소프트웨어 프로젝트, GitHub 프로젝트",
    },
    localeToggleLabel: "English",
    localeToggleAria: "페이지 언어 전환",
    searchPlaceholder: "프로젝트 이름, 설명, 언어로 검색",
    loadingBio: "공개 프로필과 저장소 문맥을 불러오는 중입니다.",
    fallbackBio: "최근 공개 저장소와 프로젝트 활동을 한 화면에서 검토할 수 있게 정리한 라이브 포트폴리오입니다.",
    loadingData: "실시간 GitHub 데이터를 불러오는 중입니다.",
    statusLive: ({ time }) => `GitHub 실시간 데이터 기준입니다. 마지막 동기화: ${time}`,
    statusCached: ({ time }) => `최근 캐시된 GitHub 스냅샷 기준입니다. 마지막 동기화: ${time}`,
    statusStale: ({ time }) => `임시 캐시 스냅샷을 표시 중입니다. 마지막 동기화: ${time}`,
    allLabel: "전체",
    typeOptions: { all: "전체", source: "원본 프로젝트만", forks: "포크만", archived: "아카이브만" },
    sortOptions: { updated: "최신 업데이트순", stars: "스타순", name: "이름순" },
    featuredLoading: "대표 저장소를 계산하는 중입니다.",
    featuredEmpty: "표시할 대표 저장소가 아직 없습니다.",
    resultLoading: "저장소 데이터를 불러오는 중입니다.",
    projectLoading: "저장소 목록을 준비하는 중입니다.",
    resultSummary: ({ count }) => `현재 ${count}개 프로젝트가 조건에 맞습니다.`,
    noResults: "조건에 맞는 저장소가 없습니다. 검색어나 필터를 조정해 보세요.",
    loadMoreDefault: "더 보기",
    loadMore: ({ count }) => `${count}개 더 보기`,
    showingAll: "모든 일치 프로젝트를 표시 중",
    repoUpdated: ({ value }) => `업데이트 ${value}`,
    repoStars: ({ value }) => `스타 ${value}`,
    repoForks: ({ value }) => `포크 ${value}`,
    repoLive: "라이브",
    repoLabel: "저장소",
    repoArchived: "아카이브",
    repoFork: "포크",
    repoFeatured: "대표",
    repoOtherLanguage: "기타",
    errorRefreshCached: "GitHub 새로고침에 실패해 가장 최근 캐시 스냅샷을 표시하고 있습니다.",
    errorProfileLoad: "GitHub 데이터를 불러오지 못했습니다. GitHub에서 저장소를 직접 검토할 수 있습니다.",
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
