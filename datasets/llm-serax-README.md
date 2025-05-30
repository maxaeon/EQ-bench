# 📑 Preparing LLM-Focused Datasets

This guide describes how to contribute datasets that specifically evaluate language models on the SERA-X axes.

## 1. Follow the Schema
- Structure your data using the fields defined in [`llm-serax-schema.md`](llm-serax-schema.md).
- Provide each prompt/response pair as a row in a CSV file.
- Clearly annotate the `sera_x_axis`, `difficulty_level`, and any `notes`.

## 2. Submit Through GitHub
- Upload your CSV file to a public location (e.g., repository fork or cloud link).
- Create a dataset submission issue using the template below:
  📎 [New Dataset Issue](https://github.com/maxaeon/SERA-X/issues/new?assignees=&labels=new-dataset&template=dataset-submission.yml&title=New+Dataset+Submission)

## 3. Peer Review Steps
- Submissions are reviewed for schema compliance and annotation quality.
- Feedback will be provided via the issue thread for any required revisions.
- Once approved, your dataset will be merged into the repository.
