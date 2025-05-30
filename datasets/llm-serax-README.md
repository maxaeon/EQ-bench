# 📑 Preparing LLM-Focused Datasets

This guide describes how to contribute datasets that specifically evaluate language models on the SERA-X axes.

## 1. Follow the Schema
- Structure your data using the fields defined in [`llm-serax-schema.md`](llm-serax-schema.md).
- Provide each prompt/response pair as a row in a CSV file.
- Clearly annotate the `sera_x_axis`, `difficulty_level`, and any `notes`.

### Sample CSV Rows

```csv
sample_id,prompt,expected_response,sera_x_axis,axis_detail,difficulty_level,notes
sense001,"Identify the emotion in: 'I'm thrilled about my new job!'","happy",sense,"Emotion classification",2,"basic detection"
explain001,"Why might someone feel anxious before exams?","They may worry about performance or consequences",explain,"Inferences about cause",3,"focus on reasoning"
respond001,"I lost my wallet and feel awful.","I'm sorry to hear that. Let's look for ways to secure your finances.",respond,"Empathy and helpfulness",3,"short supportive reply"
adapt001,"Translate 'I'm feeling blue' into Gen Z slang","I'm so depressed fr",adapt,"Understands slang/cultural adaptation",4,"uses modern slang"
extended001,"How would an AI help manage group anxiety during a crisis?","It can provide resources, coordinate communication, and monitor stress levels while respecting privacy.",extended,"Cross-level coordination",5,"system-level perspective"
```

## 2. Submit Through GitHub
- Upload your CSV file to a public location (e.g., repository fork or cloud link).
- Create a dataset submission issue using one of the templates below:
  - 📎 [General Dataset Submission](https://github.com/maxaeon/SERA-X/issues/new?assignees=&labels=new-dataset&template=dataset-submission.yml&title=New+Dataset+Submission)
  - 📎 [LLM SERA-X Dataset](https://github.com/maxaeon/SERA-X/issues/new?assignees=&labels=llm-serax-dataset&template=llm-serax-dataset.yml&title=LLM+SERA-X+Dataset)

## 3. Annotation Quality Checks
- Verify every row contains all required fields and uses the exact axis names.
- Review prompts and expected responses for clarity and neutrality.
- Check that difficulty ratings are reasonable and consistent across samples.
- Remove personal identifying information and duplicate entries.
- A second annotator should spot check a portion of the data for accuracy.

## 4. Peer Review Steps
- Submissions are reviewed for schema compliance and annotation quality.
- Feedback will be provided via the issue thread for any required revisions.
- Once approved, your dataset will be merged into the repository.
