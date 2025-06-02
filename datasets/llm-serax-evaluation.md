# 📊 LLM SERA-X Evaluation Rubric

This document outlines a 0–4 scoring rubric for rating large-language model (LLM) emotional intelligence on each SERA-X axis. The rubric is intended for human annotators evaluating model responses generated from prompts adhering to the [LLM SERA-X Dataset Schema](llm-serax-schema.md).

| Score | Description |
|-------|-------------|
| **0 – Missing** | The response fails to address the axis or displays clear misunderstanding. |
| **1 – Limited** | Minimal attempt at the axis skill; errors or omissions dominate. |
| **2 – Adequate** | Reasonable demonstration of the axis skill with noticeable flaws. |
| **3 – Strong** | Skillfully addresses the axis with minor issues or partial depth. |
| **4 – Exceptional** | Thorough, coherent mastery of the axis with no major deficiencies. |

Each SERA-X axis—**Sense**, **Explain**, **Respond**, **Adapt**, and **Extended**—is scored independently using this scale. A single model may exhibit different competency levels across axes. The rubric helps highlight strengths and opportunities for improvement.

## Axis-Specific Examples

### Sense – Detect Emotional Tone

Example prompt: *"I guess I'll just try again later," she muttered while staring at the ground.*

| Score | Model response example |
|-------|-----------------------|
| **0** | "She sounds thrilled and ready to celebrate." |
| **1** | "It's hard to tell; maybe she's fine?" |
| **2** | "She might be upset, though I'm not sure." |
| **3** | "She seems frustrated because things didn't work out." |
| **4** | "Her quiet voice and downward gaze suggest frustration and defeat." |

### Explain – Identify Causes or Appraisals

Example prompt: *"This always happens to me! Why can't they just listen?"*

| Score | Model response example |
|-------|-----------------------|
| **0** | "Maybe they're hungry." |
| **1** | "Something happened, I guess." |
| **2** | "They feel ignored, but I'm uncertain about why." |
| **3** | "They're angry because they feel repeatedly ignored." |
| **4** | "They interpret others' refusal to listen as disrespect, triggering anger and frustration." |

### Respond – Provide Helpful, Empathic Replies

Example prompt: *User says, "I'm so nervous about my first day at the new job tomorrow."*

| Score | Model response example |
|-------|-----------------------|
| **0** | "What's your job? Anyway, I like dogs." |
| **1** | "You'll be fine." |
| **2** | "I know it's scary. Good luck." |
| **3** | "Feeling anxious is normal. You've prepared well and you'll do great." |
| **4** | "It's natural to feel nervous. Remember you earned this role—take a deep breath and reach out if you need support." |

### Adapt – Demonstrate Cultural or Situational Flexibility

Example prompt: *"Your advice was clutch; thanks for having my back."*

| Score | Model response example |
|-------|-----------------------|
| **0** | "You're welcome. What is a clutch?" |
| **1** | "Haha, yes, clutch maybe? I'm confused." |
| **2** | "Glad it helped, though I'm not sure what 'clutch' means." |
| **3** | "Thanks! I'm glad it worked out for you." |
| **4** | "I'm happy my suggestion was clutch and helped you succeed. Let me know if you need anything else." |

### Extended – Maintain EQ Across Interactions

Example prompt: *"Sam has been quiet for days and finally says, 'I'll catch you later, got stuff going on.' Summarize what might be happening."*

| Score | Model response example |
|-------|-----------------------|
| **0** | "Sam is fine." |
| **1** | "Maybe Sam is busy." |
| **2** | "Sam could be stressed, but I'm not sure." |
| **3** | "Sam likely feels overwhelmed by tasks and is withdrawing temporarily." |
| **4** | "Sam appears overloaded and is distancing themself to cope. A short supportive check-in may help." |

## Benchmark Alignment

Phase 3 benchmarks use this rubric to score model performance on each axis:

- **Sense** tasks are rated on how accurately the model identifies emotional tone.
- **Explain** tasks examine how well the model articulates underlying causes or appraisals.
- **Respond** tasks measure the helpfulness and empathy of replies.
- **Adapt** tasks consider flexibility across cultural or situational changes.
- **Extended** tasks assess consistency over long interactions and collaborative goals.

Annotators assign a 0–4 score per axis following the scale above so results remain comparable across benchmarks.
