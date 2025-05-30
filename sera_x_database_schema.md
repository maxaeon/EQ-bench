# SERA-X Database Schema

This document outlines the JSON structure used to store SERA-X data. The repository keeps small data files under `data/` or `docs/`, and each file follows a relational pattern that links **constructs**, **axes**, and **benchmarks**. Every record is uniquely identified so the files can be combined into a simple database.

## Constructs

A construct represents a specific concept from the emotional intelligence literature or related disciplines. Constructs are collected from community submissions and referenced by benchmark items.

| Field | Type | Description |
|-------|------|-------------|
| `construct_id` | string | Unique identifier for the construct record. |
| `name` | string | Short name for the construct. |
| `definition` | text | Brief explanation of the construct. |
| `axis_ids` | array | List of `axis_id` values that this construct informs. |
| `references` | text | Citations or links supporting the construct. |
| `category` | string | Broad discipline or topic area. |

Example:

```json
{
  "construct_id": "c001",
  "name": "Cognitive Appraisal Theory",
  "definition": "Emotions are evaluative judgments assessing events or objects as significant to well-being.",
  "axis_ids": ["explain", "respond"],
  "references": "Nussbaum 2001",
  "category": "Philosophy and Ethics"
}
```

## Axes

SERA-X defines five skill axes. Each benchmark item and construct references one or more of these axes.

| Field | Type | Description |
|-------|------|-------------|
| `axis_id` | string | Primary key for an axis (e.g., `sense`, `explain`). |
| `name` | string | Human-friendly axis label. |
| `description` | text | What the axis measures. |
| `order` | integer | Optional display order. |

Example:

```json
{
  "axis_id": "sense",
  "name": "Sense",
  "description": "Detects and recognises emotional content from text, audio, or multimodal signals.",
  "order": 1
}
```

## Benchmarks

Benchmark records describe the individual tasks or items used to evaluate a model. They link to both a construct and an axis so results can be traced back to theory.

| Field | Type | Description |
|-------|------|-------------|
| `benchmark_id` | string | Unique identifier for the benchmark item. |
| `axis_id` | string | References the axis being tested. |
| `construct_id` | string | References the related construct. |
| `prompt` | text | Input presented to the model. |
| `expected_response` | text | Reference answer illustrating the target skill. |
| `difficulty_level` | integer | Approximate difficulty on a 1–5 scale. |
| `notes` | text | Additional guidance for annotators. |

Example:

```json
{
  "benchmark_id": "b001",
  "axis_id": "sense",
  "construct_id": "c001",
  "prompt": "How do you feel about the recent change in policy?",
  "expected_response": "I understand the new policy might create uncertainty, but it aims to help everyone.",
  "difficulty_level": 3,
  "notes": "Checks empathic recognition and support."
}
```

## Relationships

- Each **construct** can relate to multiple **axes** via the `axis_ids` array.
- A **benchmark** references exactly one `axis_id` and typically one `construct_id` to indicate which skill and theoretical concept it measures.
- Axes themselves are independent records that provide consistent labels across the dataset.

By keeping these identifiers consistent, all JSON files in the repository can be combined into a lightweight relational database for analysis or website rendering.
