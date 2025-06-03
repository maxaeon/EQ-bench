# 📂 Emotional Intelligence Dataset Schema
To ensure consistency and reliability, please adhere strictly to the following standardized schemas for submitting and annotating Emotional Intelligence (EI) datasets.

## 🎙 Audio Dataset Schema
| Field Name | Data Type | Description                            |
|------------|-----------|----------------------------------------|
| audio_id   | string    | Unique identifier for audio sample     |
| duration   | float     | Length in seconds                      |
| emotion_label | string | Primary emotion annotated              |
| intensity  | integer   | Emotion intensity (1-10 scale)         |
| annotator_notes | text | Qualitative annotator observations     |

## 📝 Text Dataset Schema
| Field Name | Data Type | Description                            |
|------------|-----------|----------------------------------------|
| text_id    | string    | Unique identifier for text sample      |
| content    | text      | Textual content                        |
| emotion_label | string | Primary emotion annotated              |
| intensity  | integer   | Emotion intensity (1-10 scale)         |
| context_notes | text   | Context or metadata about source       |

## 📽 Video Dataset Schema
| Field Name | Data Type | Description                            |
|------------|-----------|----------------------------------------|
| video_id   | string    | Unique identifier for video sample     |
| duration   | float     | Video length in seconds                |
| emotion_label | string | Primary emotion annotated              |
| intensity  | integer   | Emotion intensity (1-10 scale)         |
| modality_notes | text  | Observations (facial, vocal, gesture)  |

## 🌐 Multimodal Dataset Schema
| Field Name | Data Type | Description                                   |
|------------|-----------|-----------------------------------------------|
| sample_id  | string    | Unique identifier for multimodal sample       |
| modalities | array     | List of included modalities (audio, text, video) |
| emotion_label | string | Primary emotion annotated                     |
| intensity  | integer   | Emotion intensity (1-10 scale)                |
| integration_notes | text | Notes on interaction between modalities     |

## 📝 Annotation Guidelines
- Clearly label emotions using a consistent taxonomy (e.g., Ekman\u2019s basic emotions: happiness, sadness, anger, fear, disgust, surprise).
- Ensure annotators explicitly note uncertainty or ambiguity in annotations clearly in the `annotator_notes` or corresponding notes fields.
