# A living benchmark for **Sense - Explain -Respond - Adapt** emotional intelligence in AI systems.
Status: *early scaffold* (v0.0.1) - layout may change

## 1  Project Snapshot
|                         |                     |
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
We model it as four independent, graded skills:

| Axis | Short description | Pilot metric (text-only) |
|------|-------------------|--------------------------|
| **Sense** | Detect user emotion from language | Macro-F1 on 10 emotion labels |
| **Explain** | Infer probable causes / appraisals | Cause-Inference Accuracy |
| **Respond** | Generate helpful, empathic replies | Human Empathy Score (HES 1-5) |
| **Adapt** | Retain performance on new cultures & slang | Δ-F1 across “Experience Packs” |
| **Extended** | Evaluated at different levels of human-AI interaction.

### Theoretical Foundations
Underlying this interdisciplinary methodology are several Theoretical Foundations, essential to guiding and informing our approach to emotional intelligence assessment. These foundations provide crucial context and ensure conceptual coherence by defining the ethical considerations, methodological principles, and disciplinary frameworks that inform how emotional intelligence constructs are identified, understood, measured, and interpreted within the SERA-X project. Understanding these theoretical foundations is vital to appreciating the comprehensive, responsible, and rigorous nature of our emotional intelligence benchmarks.

| Theoretical Foundation | Brief Description | Disciplinary Origin | Primary Reference(s) | Role in Project |
| --- | --- | --- | --- | --- |
| Affective Computing | Computational methods for recognizing, interpreting, and simulating human emotions. | Computer Science | Picard, R. (1997). Affective Computing. MIT Press. | Provides computational models and methods used in EI assessment. |
| Ethical AI Development | Normative principles and ethical frameworks guiding fair, inclusive, and responsible development of AI systems. | Ethics, Philosophy | Coeckelbergh (2020). AI Ethics. MIT Press. | Ensures ethical compliance, fairness, and inclusivity throughout SERA-X evaluation. |
| Bias and Power Dynamics | Critical examination of bias, fairness, and social power imbalances inherent in AI algorithms and data. | Philosophy, Sociology, Ethics | Crawford, K. (2021). Atlas of AI. Yale University Press. | Highlights fairness and inclusivity requirements and informs data and algorithm assessment protocols. |


---

## 3  Repository Layout
SERA-X/
├── Introduction (Home)
├── Project Overview
│   ├── Goals and Purpose
│   └── SERA-X Axes Explained
├── Research and Methodologies
│   ├── Phase 1: Literature Review
│   ├── Phase 2: Construct Refinement
│   ├── Phase 3: Benchmarking Development
│   └── Phase 4: Pilot Testing
├── Constructs
│   ├── Philosophy Constructs
│   ├── Psychology Constructs
│   ├── Neuroscience Constructs
│   ├── Computer Science Constructs
├── Ethical and Methodological Considerations
├── Contributor Guidelines
├── Visual Aids
├── Glossary
├── Literature and References
├── Project Timeline
└── What's New


---

## 4  Quick Start   *(developers)*
bash
git clone https://github.com/maxaeon/SERA-x.git
cd SERA-x
# No additional Python packages required yet
pytest               # metric unit-tests
python src/cli.py    # view help

---

## 5 Quick Start (non-technical contributors)
Click “Fork” (top-right) → edits open in the GitHub web editor.

Browse to any .md file, click “✏️” to propose changes.

GitHub automatically opens a pull request – add a short explanation, hit Create PR.

A maintainer will review, run CI, and merge when ready.
See docs/quick_github_guide.md for screenshots.

---

### Project website

The `docs/` folder doubles as a GitHub Pages site.
Visit <https://maxaeon.github.io/SERA-x/> for a short overview of the project and a quick link to submit new construct forms.
Construct issue submissions are automatically exported to `data/construct_submissions.json` via GitHub Actions. See `docs/persisting_constructs.md` for details.
The website also provides an **Add a source** button to submit peer-reviewed references using a GitHub issue template. Selected references can be downloaded as a BibTeX file.

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
Month	Milestone
M-1 (Weeks 1-2)	Literature briefs & construct sheets consolidated
M-1 (Week 3)	Axes & pilot metrics frozen (design_dossier_v1)
M-2	Pilot data (≈300 dialogue turns) annotated & baselines published
M-3	Day-90 deliverables:
• Pilot report (reports/)
• Full-scale data-collection plan
• System-card template
• v0.2 tag
Post-pilot	Expand to multimodal clips; public leaderboard; “Experience Pack 01”

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
