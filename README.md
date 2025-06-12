# AI EQ Research Hub

**Note:** This repository is the initial public release (tagged `ai-eq-bench-public`) and may later migrate under the ML Commons umbrella.


Welcome to the **AI EQ Research Hub**. We are committed to collaboratively developing, refining, and promoting standardized benchmarks for assessing emotional intelligence in artificial intelligence systems. You can find our deployed page [here](https://maxaeon.github.io/EQ-bench/). 

<p align="center">
  <img src="https://github.com/user-attachments/assets/55f96859-efec-477a-8189-90d9831a2636" width="400" alt="Image" />
</p>

GitHub Discussions are enabled for open dialogue and interdisciplinary collaboration.

This website serves as the foundational resource and single source of truth for all project collaborators.

This benchmark is organized as a **community-led initiative**. Once the framework is stable, long-term stewardship will transition to **ML Commons** to ensure broad, vendor-neutral oversight.

Although funding and resources may come from a range of academic and industry partners, the research team retains full independence in methodology and analysis. Our goal is to produce an unbiased, gold‑standard EQ benchmark through open, interdisciplinary collaboration.

Status: *early scaffold* (v0.0.1) - layout may change

New to these terms? See the [Glossary](docs/glossary.md) for quick definitions.
Missing a term? [Open a Glossary term request](https://github.com/maxaeon/EQ-bench/issues/new?template=glossary-term-request.yml) to propose an addition.

## 1  Project Snapshot
We are developing a collaborative benchmark for evaluating emotional intelligence in AI systems. This repository collects design documents and sample datasets as they become available. Authorized visitors can sign in using the **Login** button at the top right of the project website and submit new sources or constructs directly through the provided forms. Use the same button to log out when finished. These entries are stored in our Supabase tables (`literature` and `constructs`) and mirrored JSON files under `data/`. For guidance, see [docs/persisting_constructs.md](docs/persisting_constructs.md) and the [Research Hub Contribution Guide](docs/quick_github_guide.md).

<p align="center">
  <img src="https://github.com/user-attachments/assets/d25e1df5-df25-405d-a3b8-4424fc9f3408" width="600" alt="Image" />
</p>

| Project Attribute | Short description |
|-------------------------|---------------------|
| **Goal** | Provide an open, reproducible framework that measures how well large-language models (and, later, multimodal systems) *sense*, *explain*, *respond* to, and *adapt* around human emotions. |
| **Status** | `v0.1-alpha` – folder skeleton, pilot metric stubs, and sample data only. |
| **Pilot window** | **Day 0 – Day 90** (see roadmap) |
| **Inspiration** | *Humanity’s-Last-Exam*, HELM, EQ-Bench, ETHOS, EmpatheticDialogues |
| **Lead org** | Community-led project (future stewardship by ML Commons) |
| **Contact** | Max Parks – project lead and coordination point <maxaeonparks@gmail.com> |

---

## 2  Why this Framework?
Emotional intelligence in AI should not be judged by a single pass/fail label.  
We tentatively model it as four independent, graded skills, along with an extended perspective:

| Axis | Short description | Possible Pilot metric |
|------|-------------------|--------------------------|
| [**Sense**](https://maxaeon.github.io/EQ-bench/sense.html) | Detect user emotion from language | Macro-F1 on 10 emotion labels |
| [**Explain**](https://maxaeon.github.io/EQ-bench/explain.html) | Infer probable causes / appraisals | Cause-Inference Accuracy |
| [**Respond**](https://maxaeon.github.io/EQ-bench/respond.html) | Generate helpful, empathic replies | Human Empathy Score (HES 1-5) |
| [**Adapt**](https://maxaeon.github.io/EQ-bench/adapt.html) | Retain performance on new cultures & slang | Δ-F1 across “Experience Packs” |
| [**Extended**](https://maxaeon.github.io/EQ-bench/extended.html) | Evaluates AI's performance across diverse human-AI interaction levels. | Composite score from multi-modal interaction assessments. |

### Theoretical Foundations
Underlying this interdisciplinary methodology are several Theoretical Foundations, essential to guiding and informing our approach to emotional intelligence assessment. These foundations provide crucial context and ensure conceptual coherence by defining the ethical considerations, methodological principles, and disciplinary frameworks that inform how emotional intelligence constructs are identified, understood, measured, and interpreted within the SERA-X project. Understanding these theoretical foundations is vital to appreciating the comprehensive, responsible, and rigorous nature of our emotional intelligence benchmarks.

---

## 3  Repository Layout
This repository is organized as an AI EQ Research Hub. Major sections include:

- [**Benchmarks/**](Benchmarks/) – details of the SERA-X benchmark and comparisons to alternative models (see [docs/alternative-models.html](docs/alternative-models.html)).
- [**Resources-and-Tools/**](Resources-and-Tools/) – datasets, scripts, and utilities for running EQ evaluations.
- [**Community-and-Collaboration/**](Community-and-Collaboration/) – information on participating via GitHub Discussions or chat channels.
- [**Contributor-Hub/**](Contributor-Hub/) – guidelines and Markdown templates for submitting new constructs, datasets, and publications.
- [**datasets/**](datasets/) – sample conversation data for building baseline metrics.
- [**data/**](data/) – JSON snapshots mirrored from the project database.
- [**metrics/**](metrics/) – metric descriptions and baseline reports.
- [**docs/ethics/**](docs/ethics/) – frameworks that guide responsible research.
- 🔗 [Ethics and Inclusivity Standards](docs/ethics/inclusivity.md)
- [**scripts/**](scripts/) – helper scripts for data conversion and upload.
- [**updates.md**](updates.md) – log of recent news and milestones.


---

## 4  Quick Start   *(developers)*

**Prerequisites:**
- Python ≥3.8
- Git
- virtualenv or venv

bash

git clone https://github.com/maxaeon/EQ-bench.git

cd EQ-bench

---

## 5 Quick Start (non-technical contributors)

**Prerequisites:**
- GitHub account
- Modern web browser

See the [Research Hub Contribution Guide](docs/quick_github_guide.md) for step-by-step screenshots.

---

### Project website

The `docs/` folder doubles as a GitHub Pages site.
Visit <https://maxaeon.github.io/EQ-bench/> for a short overview of the project and direct forms for submitting constructs or literature references. Entries submitted through these forms are stored in `data/construct_submissions.json` and `data/literature.json` and mirrored in our Supabase tables. See [docs/persisting_constructs.md](docs/persisting_constructs.md) and the [Research Hub Contribution Guide](docs/quick_github_guide.md) for details. Selected references can be downloaded as a BibTeX file, or uploaded/pasted back into the database. If you have a DOI, you can convert it to a BibTeX entry using online tools such as [bibtex.com](https://www.bibtex.com/c/doi-to-bibtex-converter/). Each submission now includes an **entry type** dropdown and a freeform **type** field so references can be tagged by category.
When exporting, extra fields such as the construct name, supported methodology, or SERA-X axis are omitted to keep the BibTeX file portable. Any keywords are written to the standard `keywords` tag and relevance notes appear under `note`. During import the site prompts for any missing required values.
For a walkthrough of the import/export buttons, see the [quick guide section on BibTeX files](docs/quick_github_guide.md#importing-and-exporting-bib-files).

---

## 6 Contributing
We welcome pull requests, issues, and Discussions from developers, psychologists, ethicists, educators, and end-users.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

<p align="center">
  <img src="https://github.com/user-attachments/assets/cabc0e0a-a39d-431f-baee-660085de01e1" width="600" alt="Image" />
</p>


---
## 7 Flexible Roadmap (v0 → v1)

1. **M-1 (Weeks&nbsp;1–3)** — Literature briefs & construct sheets consolidated
2. **M-1 (Week&nbsp;4)** — Axes & pilot metrics frozen (`design_dossier_v1`)
3. **M-2** — Pilot data (≈300 dialogue turns) annotated & baselines published
4. **M-3** — Day-90 deliverables:
   - Pilot report (`reports/`)
   - Full-scale data-collection plan
   - System-card template
   - v0.2 tag
5. **Post-pilot** — Expand to multimodal clips; public leaderboard; “Experience Pack&nbsp;01”

<p align="center">
  <img src="docs/assets/images/gantt.png" width="600" alt="Gantt chart of first 90 days">
</p>

## License
- **Code and documentation**: Released under the [MIT License](LICENSE). See [LICENSE-NOTES.md](LICENSE-NOTES.md) for details on the private evaluation rubric.
