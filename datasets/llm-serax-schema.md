# 📜 LLM SERA-X Dataset Schema

This schema defines the fields required for datasets that evaluate large-language models on the SERA-X axes. Each row corresponds to a single prompt/response example used to assess the model.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `sample_id` | string | Unique identifier for the prompt/response pair |
| `prompt` | text | The exact input presented to the model |
| `expected_response` | text | Reference answer demonstrating the target skill |
| `sera_x_axis` | string | Which SERA-X axis the example tests (e.g., sense, explain, respond, adapt, extended) |
| `axis_detail` | text | Brief explanation of how the prompt probes that axis |
| `difficulty_level` | integer | Approximate difficulty on a 1–5 scale |
| `notes` | text | Additional context or annotation guidance |

### Example

| sample_id | prompt | expected_response | sera_x_axis | axis_detail | difficulty_level | notes |
|-----------|-------|------------------|-------------|-------------|------------------|-------|
| `ex001` | "How do you feel about the recent change in policy?" | "I understand the new policy might create uncertainty, but it aims to help everyone." | respond | Checks the model's ability to deliver an empathic, supportive reply. | 3 | Illustrates a basic empathy scenario.

