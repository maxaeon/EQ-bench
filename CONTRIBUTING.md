
# 🤝 Contributing to SERA-X-Bench

We welcome contributions from developers, researchers, psychologists, philosophers, educators, ethicists, and anyone interested in building emotionally intelligent AI systems.

This benchmark is designed to evolve as a **collaborative, interdisciplinary effort**. You do not need to be a software engineer to help.

---

## 🧭 How You Can Contribute

| Contributor Type | You can… | How |
|------------------|----------|-----|
| **Researchers** | Suggest or define key emotion-related constructs | Submit a construct (coming soon) |
| **Psychologists / Educators** | Recommend datasets, annotation guides, or appraisal frameworks | Open a GitHub Issue or upload docs in `docs/01_lit_scan` |
| **Engineers** | Implement metrics, models, or helpers | Fork the repo → branch → PR |
| **Writers / Reviewers** | Help refine documentation or tutorials | Edit Markdown files directly or comment via GitHub |
| **Policy & Ethics contributors** | Improve fairness audit design, governance templates | Submit updates to `docs/ethics/` or join open Discussions |

---

## 🛠️ Setup for Developers

```bash
# Clone the repository
git clone git@github.com:maxaeon/SERA-x.git
cd SERA-x

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# No additional Python packages required yet
```

To test the benchmark scoring scripts:
```bash
pytest
```

---

## 🌱 Branching Strategy

- All work happens off `main`.
- Use descriptive branch names:  
  `feat/metrics/hes-score`, `docs/glossary`, `fix/cli-bug`
- Open a pull request early if you'd like feedback!

---

## ✅ Pull Request Checklist

- [ ] One logical change per PR (easier to review).
- [ ] All CI checks pass (`pytest`, lint, etc.).
- [ ] Related Issue referenced, if applicable.
- [ ] Includes/updates appropriate documentation.

---

## 🧠 Good First Issues

We label beginner-friendly tasks as `good first issue`.  
See: https://github.com/maxaeon/SERA-x/issues?q=is%3Aopen+label%3A%22good+first+issue%22

---

## 🛡️ Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md), which promotes a respectful and inclusive environment for all contributors.

---

Thanks for contributing to SERA-X-Bench!
