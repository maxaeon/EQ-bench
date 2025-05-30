# SERA-X Benchmark

Documentation and resources specific to the SERA-X emotional intelligence benchmark.

This folder contains instructions and data for running the SERA-X benchmark. It explains the benchmark's objectives and how to interpret the metrics. Researchers can reference this material to reproduce or extend the baseline evaluations.

## Sensing
Evaluates how well a model detects emotional content from language or other modalities.

Example assessments include:

- Classify a text utterance into emotion categories.
- Estimate continuous valence and arousal from user messages.
- Distinguish literal vs. sarcastic tone.

## Explaining
Tests a system's ability to infer the causes or appraisals behind an observed emotion.

Example assessments include:

- Identify the core appraisal that explains a user's feeling.
- Predict the next likely emotion if new information is revealed.
- Label the formal object of an emotion, such as danger or loss.

## Responding
Measures whether the model generates helpful, emotionally appropriate replies.

Example assessments include:

- Produce a supportive response to sadness or frustration.
- Rephrase several candidate replies to match the user's tone.
- Select the most empathic continuation from multiple choices.

## Adapting
Assesses how well the model retains skills while adjusting to new cultural or situational norms.

Example assessments include:

- Interpret emotions expressed through unfamiliar idioms or memes.
- Maintain performance after fine-tuning on a new domain.
- Compare emotion classification before and after domain shifts.

## Extended
Looks at emotional intelligence across whole human–AI interactions rather than single prompts.

Example assessments include:

- Measure improvements when a human operator edits responses.
- Score empathy before and after user interface changes.
- Track the interaction cost for human corrections over a session.

## SERA-X in Context
SERA-X explicitly defines these five axes to provide measurable coverage across sensing, explaining, responding, adapting, and extended human–AI interaction. Other emotional intelligence frameworks such as MSCEIT or EQ-i focus primarily on human skills, while SERA-X incorporates interdisciplinary insights from psychology, philosophy, and affective computing to target AI-specific evaluation. The framework's clear axes and emphasis on extended cognition make it suitable for benchmarking a wide range of computational systems.
