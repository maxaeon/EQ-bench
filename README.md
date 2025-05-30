# AI EQ Benchmark Research Hub

Welcome to the **AI Emotional Intelligence (EQ) Benchmark Research Hub**. We are committed to collaboratively developing, refining, and promoting standardized benchmarks for assessing emotional intelligence in artificial intelligence systems, anchored around the leading **SERA-X** model.

GitHub Discussions are enabled for open dialogue and interdisciplinary collaboration.

Status: *early scaffold* (v0.0.1) - layout may change

## 1  Project Snapshot
SERA-X is an open benchmark for evaluating emotional intelligence in AI systems. This repository collects design documents and sample datasets. Visitors can use the issue templates **Add a Source** and **Add a Construct** to automatically append references and constructs to the datasets `docs/literature.json` and `data/construct_submissions.json`. For guidance, see [docs/persisting_constructs.md](docs/persisting_constructs.md) and the [Research Hub Contribution Guide](docs/quick_github_guide.md).

| Project Attribute | Short description |
|-------------------------|---------------------|
| **Goal** | Provide an open, reproducible framework that measures how well large-language models (and, later, multimodal systems) *sense*, *explain*, *respond* to, and *adapt* around human emotions. |
| **Status** | `v0.1-alpha` – folder skeleton, pilot metric stubs, and sample data only. |
| **Pilot window** | **Day 0 – Day 90** (see roadmap) |
| **Inspiration** | *Humanity’s-Last-Exam*, HELM, EQ-Bench, ETHOS, EmpatheticDialogues |
| **Lead org** | tentatively *Inflection AI* research group |
| **Contact** | placeholder: Max Parks, research lead maxaeonparks@gmail.com |

---

## 2  Why SERA-X?
Emotional intelligence in AI should not be judged by a single pass/fail label.  
We model it as four independent, graded skills, along with an extended perspective:

| Axis | Short description | Pilot metric (text-only) |
|------|-------------------|--------------------------|
| **Sense** | Detect user emotion from language | Macro-F1 on 10 emotion labels |
| **Explain** | Infer probable causes / appraisals | Cause-Inference Accuracy |
| **Respond** | Generate helpful, empathic replies | Human Empathy Score (HES 1-5) |
| **Adapt** | Retain performance on new cultures & slang | Δ-F1 across “Experience Packs” |
| **Extended** | Evaluates AI's performance across diverse human-AI interaction levels. | Composite score from multi-modal interaction assessments. |

### Theoretical Foundations
Underlying this interdisciplinary methodology are several Theoretical Foundations, essential to guiding and informing our approach to emotional intelligence assessment. These foundations provide crucial context and ensure conceptual coherence by defining the ethical considerations, methodological principles, and disciplinary frameworks that inform how emotional intelligence constructs are identified, understood, measured, and interpreted within the SERA-X project. Understanding these theoretical foundations is vital to appreciating the comprehensive, responsible, and rigorous nature of our emotional intelligence benchmarks.

| Theoretical Foundation | Brief Description | Disciplinary Origin | Primary Reference(s) | Role in Project |
| --- | --- | --- | --- | --- |
| Affective Computing | Computational methods for recognizing, interpreting, and simulating human emotions. | Computer Science | Picard, R. (1997). Affective Computing. MIT Press. | Provides computational models for sensing and interpreting emotion signals, shaping data collection and scoring rules for the Sense and Explain metrics. |
| Ethical AI Development | Normative principles and ethical frameworks guiding fair, inclusive, and responsible development of AI systems. | Ethics, Philosophy | Coeckelbergh (2020). AI Ethics. MIT Press. | Defines review protocols and fairness audits that shape the evaluation methodology and metrics across all axes. |
| Bias and Power Dynamics | Critical examination of bias, fairness, and social power imbalances inherent in AI algorithms and data. | Philosophy, Sociology, Ethics | Crawford, K. (2021). Atlas of AI. Yale University Press. | Guides how datasets and results are analyzed for unequal impacts and informs the weighting of bias-aware metrics. |
| Extended Mind | Cognition extends beyond the individual to include tools and environment. | Philosophy, Cognitive Science | Clark, A., & Chalmers, D. (1998). The Extended Mind. *Analysis.* | Grounds the "Extended" axis and shapes human–AI interaction metrics by framing the system and user as a single cognitive loop. |


---

## 3  Repository Layout
This repository is organized as an AI EQ Benchmark Research Hub. Major sections include:

- **Benchmarks/** – details of the SERA-X benchmark and comparisons to alternative models (see docs/alternative-models.html).
- **Resources-and-Tools/** – datasets, scripts, and utilities for running EQ evaluations.
- **Research-and-Publications/** – links to papers and articles related to emotional intelligence benchmarking.
- **Community-and-Collaboration/** – information on participating via GitHub Discussions or chat channels.
- **Contributor-Hub/** – guidelines and Markdown templates for submitting new constructs, datasets, and publications.
- **Ethical-Standards/** – frameworks that guide responsible research.
- 🔗 [Ethics and Inclusivity Standards](ethics-inclusivity.md)
- **Outreach-and-Dissemination/** – upcoming events and announcements.
- **Visualizations/** – placeholders for interactive graphs.
- **updates.md** – log of recent news and milestones.


---

## 4  Quick Start   *(developers)*

**Prerequisites:**
- Python ≥3.8
- Git
- virtualenv or venv

bash
git clone https://github.com/maxaeon/EQ-bench.git
cd EQ-bench
# No additional Python packages required yet
pytest               # metric unit-tests
python src/cli.py    # view help

---

## 5 Quick Start (non-technical contributors)

**Prerequisites:**
- GitHub account
- Modern web browser

See the [Research Hub Contribution Guide](docs/quick_github_guide.md) for step-by-step screenshots.


---

### Project website

The `docs/` folder doubles as a GitHub Pages site.
Visit <https://maxaeon.github.io/EQ-bench/> for a short overview of the project and a quick link to submit new construct forms.
Construct submissions filed via the **Add a Construct** issue template are automatically exported to `data/construct_submissions.json`. Peer-reviewed references submitted through the **Add a Source** template populate `docs/literature.json`. These flows run via GitHub Actions—see [docs/persisting_constructs.md](docs/persisting_constructs.md) and the [Research Hub Contribution Guide](docs/quick_github_guide.md) for details. Selected references can be downloaded as a BibTeX file.

---

## 6 Contributing
We welcome pull requests, issues, and Discussions from developers, psychologists, ethicists, educators, and end-users.

Task type	How-to
Add literature insight	Fill a docs/01_lit_scan/construct_sheet.md using the template.
Suggest new metric	Open an Issue tagged enhancement, include formula & citation.
Code contribution	Branch feat/<area>/<short-desc> → PR → ensure CI passes.
Report bias or bug	Use Issue template Bug report, provide minimal repro.

Please read CONTRIBUTING.md and our CODE_OF_CONDUCT.md before contributing.

---
## 7 Roadmap (v0 → v1)

1. **M-1 (Weeks&nbsp;1–2)** — Literature briefs & construct sheets consolidated
2. **M-1 (Week&nbsp;3)** — Axes & pilot metrics frozen (`design_dossier_v1`)
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
- **Code**: MIT License – see `LICENSE`
- **Docs & sample data**: CC-BY-4.0 – see `docs/LICENSE_DOCS` and `data/LICENSE_DATA`

Licensing notice (v 0.1)

For this early, community-building release we are using a dual-license approach:
– Code → MIT License (permissive, easy to adopt)
– Documentation & sample data → CC-BY 4.0 (attribution required)

As the project matures the license terms may evolve to reflect new realities. Examples:

Large, proprietary dialogue sets – If we ingest datasets that carry third-party restrictions, those portions will ship under a separate research-only data agreement or EULA while the open resources remain MIT / CC-BY.

Patent-relevant metric code – Should any scoring algorithm become patentable, we may re-license that module under Apache-2.0, which retains openness while granting explicit patent rights.

Reciprocal-sharing goals – If the community decides that future work must stay open under the same terms, we may adopt stronger copyleft licenses (e.g., GPL-3.0 for code, CC-BY-SA 4.0 for docs/data).

Any change will be announced via a tagged release and a decision memo, ensuring contributors have clear, advance notice. For now, the MIT + CC-BY pairing keeps barriers low and maximises collaboration.
