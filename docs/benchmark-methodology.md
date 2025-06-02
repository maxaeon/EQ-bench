---
layout: default
title: Phase 3 Benchmark Methodology
---

# Phase 3 Benchmark Methodology

This document summarizes how Phase&nbsp;3 organizes benchmarks for the SERA-X framework and how tasks map to the [LLM SERA-X Evaluation Rubric](../datasets/llm-serax-evaluation.md).

## Benchmark Structure

Phase&nbsp;3 introduces scenario-based tests for each SERA-X axis:

1. **Sense** – prompts require a model to recognize expressed emotion from text, audio, or multimodal input.
2. **Explain** – scenarios ask the model to justify perceived emotions or appraisals.
3. **Respond** – dialogues evaluate whether a model can craft empathic, contextually appropriate replies.
4. **Adapt** – tests measure cultural or situational flexibility across turns.
5. **Extended** – long‑horizon tasks assess consistent EQ in collaborative settings.

Each benchmark includes example prompts, expected responses, and a difficulty rating. Human annotators score model outputs on a 0–4 scale using the rubric. The rubric’s categories—Missing, Limited, Adequate, Strong, and Exceptional—correspond directly to how well a model demonstrates each axis skill.

## Alignment with the Scoring Rubric

Evaluators use the rubric table in `datasets/llm-serax-evaluation.md` to rate outputs:

- **0 – Missing**: response ignores the emotional cue or misinterprets it.
- **1 – Limited**: attempt at the skill but with clear errors.
- **2 – Adequate**: some understanding with noticeable flaws.
- **3 – Strong**: addresses the axis competently with minor issues.
- **4 – Exceptional**: coherent mastery of the axis with no major deficiencies.

Benchmark items explicitly reference these levels in their scoring instructions so annotations remain consistent across axes.

## Guidance from *Humanity’s Last Exam*

"Humanity’s Last Exam" advocates scenario-driven evaluation to measure whether advanced systems behave safely under pressure. Inspired by this, Phase&nbsp;3 benchmarks favor realistic situations that require nuanced emotional reasoning. Scenarios are designed to probe for failures of empathy or adaptability in high‑stakes interactions and to measure reliability over extended conversations. By mirroring the exam’s emphasis on comprehensive, stress‑testing assessments, we ensure that each axis is evaluated under conditions likely to reveal weaknesses.

## Measuring Outcomes

For every scenario, evaluators document:

- The relevant SERA-X axis and construct.
- The prompt and any contextual notes.
- Expected behaviors or responses.
- Annotator scores for the axis using the rubric.

Aggregated scores across tasks provide an overall picture of a model’s emotional intelligence and reveal which axes need further attention.

