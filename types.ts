
export interface HardwareSpecs {
  gpuVendor: string;
  vram: number; // in GB
  ram: number; // in GB
  cpuType: string;
  os: string;
  diskSpace: number; // in GB
}

export enum UseCase {
  // Multimodal
  AUDIO_TEXT_TO_TEXT = 'Audio-Text-to-Text',
  IMAGE_TEXT_TO_TEXT = 'Image-Text-to-Text',
  VISUAL_QUESTION_ANSWERING = 'Visual Question Answering',
  DOCUMENT_QUESTION_ANSWERING = 'Document Question Answering',
  VIDEO_TEXT_TO_TEXT = 'Video-Text-to-Text',
  VISUAL_DOCUMENT_RETRIEVAL = 'Visual Document Retrieval',
  ANY_TO_ANY = 'Any-to-Any',

  // Computer Vision
  DEPTH_ESTIMATION = 'Depth Estimation',
  IMAGE_CLASSIFICATION = 'Image Classification',
  OBJECT_DETECTION = 'Object Detection',
  IMAGE_SEGMENTATION = 'Image Segmentation',
  TEXT_TO_IMAGE = 'Text-to-Image',
  IMAGE_TO_TEXT = 'Image-to-Text',
  IMAGE_TO_IMAGE = 'Image-to-Image',
  IMAGE_TO_VIDEO = 'Image-to-Video',
  UNCONDITIONAL_IMAGE_GEN = 'Unconditional Image Generation',
  VIDEO_CLASSIFICATION = 'Video Classification',
  TEXT_TO_VIDEO = 'Text-to-Video',
  ZERO_SHOT_IMAGE_CLASSIFICATION = 'Zero-Shot Image Classification',
  MASK_GENERATION = 'Mask Generation',
  ZERO_SHOT_OBJECT_DETECTION = 'Zero-Shot Object Detection',
  TEXT_TO_3D = 'Text-to-3D',
  IMAGE_TO_3D = 'Image-to-3D',
  THREE_D_MODELING = '3D Modeling',
  IMAGE_FEATURE_EXTRACTION = 'Image Feature Extraction',
  KEYPOINT_DETECTION = 'Keypoint Detection',
  VIDEO_TO_VIDEO = 'Video-to-Video',

  // NLP
  TEXT_CLASSIFICATION = 'Text Classification',
  TOKEN_CLASSIFICATION = 'Token Classification',
  TABLE_QUESTION_ANSWERING = 'Table Question Answering',
  QUESTION_ANSWERING = 'Question Answering',
  ZERO_SHOT_CLASSIFICATION = 'Zero-Shot Classification',
  TRANSLATION = 'Translation',
  SUMMARIZATION = 'Summarization',
  FEATURE_EXTRACTION = 'Feature Extraction',
  TEXT_GENERATION = 'Text Generation',
  FILL_MASK = 'Fill-Mask',
  SENTENCE_SIMILARITY = 'Sentence Similarity',
  TEXT_RANKING = 'Text Ranking',

  // Audio
  TEXT_TO_SPEECH = 'Text-to-Speech',
  TEXT_TO_AUDIO = 'Text-to-Audio',
  AUTOMATIC_SPEECH_RECOGNITION = 'Automatic Speech Recognition',
  AUDIO_TO_AUDIO = 'Audio-to-Audio',
  AUDIO_CLASSIFICATION = 'Audio Classification',
  VOICE_ACTIVITY_DETECTION = 'Voice Activity Detection',

  // Tabular
  TABULAR_CLASSIFICATION = 'Tabular Classification',
  TABULAR_REGRESSION = 'Tabular Regression',
  TIME_SERIES_FORECASTING = 'Time Series Forecasting',

  // Reinforcement Learning
  REINFORCEMENT_LEARNING = 'Reinforcement Learning',
  ROBOTICS = 'Robotics',

  // Other
  GRAPH_MACHINE_LEARNING = 'Graph Machine Learning',

  // Scientific
  SCIENCE = 'Science',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  MEDICINE = 'Medicine',
  PROTEIN_BIOLOGY = 'Protein Biology',
  GENOMICS = 'Genomics',
  ENVIRONMENTAL_SCIENCE = 'Environmental Science',
  MATHEMATICS = 'Mathematics',
  ASTRONOMY = 'Astronomy',
}

export interface ModelRecommendation {
  id: string;
  name: string;
  publisher: string;
  provider: string; // New field
  repo: string; // HuggingFace Repo ID
  sizeParams: string;
  vramReq: number;
  recommendedQuantization: string;
  description: string;
  reason: string;
  score: number;
  pinokioLink?: string;
  ollamaCommand?: string;
  lmStudioCommand?: string;
  llamaCppCommand?: string;
  hfUrl?: string;     // Main HF Repo Link
  hfGGUF?: string;    // Direct GGUF Download Link
  installCommand?: string;
  type?: string;
  license: string;
  tags: string[];
  inferenceSpeed: string;
  backend: 'mlx' | 'gguf' | 'onnx' | 'pytorch' | 'other';
  appleSiliconOptimized: boolean;
  libraries?: string[];
  providers?: string[]; // Cloud providers
  benchmarks: {
    name: string;
    score: number;
    maxScore: number;
  }[];
}

export interface RecommendationResponse {
  models: ModelRecommendation[];
  summary: string;
  hardwareNotes: string;
}

// Internal DB Types
export interface LocalModelDB {
  name: string;
  repo: string; // HuggingFace Repo ID
  params_b: number;
  type: string;
  license: string;
  formats: string[];
  backend: 'mlx' | 'gguf' | 'onnx' | 'pytorch' | 'other';
  quantization: string;
  apple_silicon_optimized: boolean;
  min_hardware: {
    cpu: string;
    ram_gb: number;
    gpu_vram_gb: number;
  };
  tasks: string[];
  pinokio: boolean;
  text_to_video_prompt: boolean;
  text_to_image_prompt: boolean;
  description: string;
  publisher: string;
  provider: string; // New field
  libraries?: string[];
  providers?: string[]; // Cloud providers
}
