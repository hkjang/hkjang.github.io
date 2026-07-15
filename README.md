# HKJANG LAB

Live GitHub portfolio for **Hyeongkuk Jang (장형국, hkjang)**, focused on AI, cloud-native operations, data platforms, DevSecOps, and developer productivity projects.

The site reads public GitHub repositories in the browser, highlights flagship work first, and keeps the full project explorer searchable and filterable without manually editing a static project list.

## Features

- **Live GitHub sync**: loads the GitHub profile and public repositories from the GitHub REST API.
- **Flagship project pinning**: prioritizes strategic projects such as `vibe-coders`, `clustara`, `jayu`, `dataworks`, `ArgosAISecurity`, and `signal-hub` before automatic scoring fills the remaining featured slots.
- **Search and filters**: supports keyword search, language filtering, repository type filtering, and sorting by update date, stars, or name.
- **Bilingual copy**: detects Korean browsers by default and provides a Korean/English toggle.
- **SEO and AEO basics**: includes canonical metadata, Open Graph/Twitter Card metadata, JSON-LD structured data, `sitemap.xml`, `robots.txt`, and `llms.txt`.
- **Offline resilience**: caches the latest GitHub API response in `localStorage` to keep the portfolio useful during temporary API or network failures.

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- GitHub Pages
- GitHub REST API
- JSON-LD structured data
- Browser `localStorage` cache

## Local Development

Because this is a static site, any local HTTP server is enough:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Data Flow

```text
GitHub REST API → browser fetch → normalized repository model → localStorage cache → featured cards and project explorer
```

## Configuration

Primary site behavior is currently configured in `site.js`:

- `username`: GitHub user to load.
- `pinnedProjectNames`: strategic featured projects shown before automatic recommendations.
- `cacheTtlMs`: local cache freshness window.
- `initialVisibleCount` and `loadIncrement`: project explorer pagination behavior.

SEO defaults are defined in `index.html` and updated by `site.js` when the language changes or GitHub profile data becomes available.

## Deployment

The repository is designed for GitHub Pages. Push changes to the configured Pages branch and GitHub Pages serves the static files directly.

## Roadmap

- Generate static `data/repositories.json` during GitHub Actions builds.
- Add project detail pages under `/projects/<name>/`.
- Generate project-specific OG images.
- Add topic/category filters for Enterprise AI, Cloud Native, Data Platform, DevSecOps, Developer Tools, and FinTech.
- Add technical articles and case studies connected to flagship projects.
- Add privacy-friendly analytics for project views, GitHub clicks, share clicks, and collaboration CTA clicks.

## Contributing

Issues and pull requests are welcome when they improve portfolio clarity, accessibility, SEO, performance, or project discoverability.
