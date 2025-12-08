
import { HardwareSpecs, UseCase } from './types';
import { 
  MessageSquare, Code, Eye, Image, Video, Mic, 
  Database, Activity, Box, Type, Grid, Layers, 
  Cpu, Globe, Scan, FileText, FlaskConical
} from 'lucide-react';

export const DEFAULT_HARDWARE: HardwareSpecs = {
  gpuVendor: 'NVIDIA',
  vram: 8,
  ram: 16,
  cpuType: 'Intel/AMD',
  os: 'Windows',
  diskSpace: 64,
};

export const USE_CASE_GROUPS = [
  {
    category: "Multimodal",
    icon: Layers,
    items: [
      { id: UseCase.AUDIO_TEXT_TO_TEXT, label: 'Audio-Text-to-Text' },
      { id: UseCase.IMAGE_TEXT_TO_TEXT, label: 'Image-Text-to-Text' },
      { id: UseCase.VISUAL_QUESTION_ANSWERING, label: 'Visual QA' },
      { id: UseCase.DOCUMENT_QUESTION_ANSWERING, label: 'Document QA' },
      { id: UseCase.VIDEO_TEXT_TO_TEXT, label: 'Video-Text-to-Text' },
      { id: UseCase.VISUAL_DOCUMENT_RETRIEVAL, label: 'Visual Doc Retrieval' },
      { id: UseCase.ANY_TO_ANY, label: 'Any-to-Any' },
    ]
  },
  {
    category: "Science & Research",
    icon: FlaskConical,
    items: [
      { id: UseCase.SCIENCE, label: 'General Science' },
      { id: UseCase.PHYSICS, label: 'Physics' },
      { id: UseCase.CHEMISTRY, label: 'Chemistry' },
      { id: UseCase.BIOLOGY, label: 'Biology' },
      { id: UseCase.PROTEIN_BIOLOGY, label: 'Protein Biology' },
      { id: UseCase.MEDICINE, label: 'Medicine' },
      { id: UseCase.GENOMICS, label: 'Genomics' },
      { id: UseCase.ENVIRONMENTAL_SCIENCE, label: 'Environmental Science' },
      { id: UseCase.MATHEMATICS, label: 'Mathematics' },
      { id: UseCase.ASTRONOMY, label: 'Astronomy' },
    ]
  },
  {
    category: "Computer Vision",
    icon: Eye,
    items: [
      { id: UseCase.DEPTH_ESTIMATION, label: 'Depth Estimation' },
      { id: UseCase.IMAGE_CLASSIFICATION, label: 'Image Classification' },
      { id: UseCase.OBJECT_DETECTION, label: 'Object Detection' },
      { id: UseCase.IMAGE_SEGMENTATION, label: 'Image Segmentation' },
      { id: UseCase.TEXT_TO_IMAGE, label: 'Text-to-Image' },
      { id: UseCase.IMAGE_TO_TEXT, label: 'Image-to-Text' },
      { id: UseCase.IMAGE_TO_IMAGE, label: 'Image-to-Image' },
      { id: UseCase.IMAGE_TO_VIDEO, label: 'Image-to-Video' },
      { id: UseCase.TEXT_TO_VIDEO, label: 'Text-to-Video' },
      { id: UseCase.TEXT_TO_3D, label: 'Text-to-3D' },
      { id: UseCase.IMAGE_TO_3D, label: 'Image-to-3D' },
      { id: UseCase.THREE_D_MODELING, label: '3D Modeling' },
      { id: UseCase.VIDEO_CLASSIFICATION, label: 'Video Classification' },
    ]
  },
  {
    category: "Natural Language Processing",
    icon: MessageSquare,
    items: [
      { id: UseCase.TEXT_GENERATION, label: 'Text Generation' },
      { id: UseCase.QUESTION_ANSWERING, label: 'Question Answering' },
      { id: UseCase.SUMMARIZATION, label: 'Summarization' },
      { id: UseCase.TRANSLATION, label: 'Translation' },
      { id: UseCase.TEXT_CLASSIFICATION, label: 'Text Classification' },
      { id: UseCase.TOKEN_CLASSIFICATION, label: 'Token Classification' },
      { id: UseCase.TABLE_QUESTION_ANSWERING, label: 'Table QA' },
      { id: UseCase.SENTENCE_SIMILARITY, label: 'Sentence Similarity' },
    ]
  },
  {
    category: "Audio",
    icon: Mic,
    items: [
      { id: UseCase.TEXT_TO_SPEECH, label: 'Text-to-Speech' },
      { id: UseCase.AUTOMATIC_SPEECH_RECOGNITION, label: 'Speech Recognition' },
      { id: UseCase.AUDIO_CLASSIFICATION, label: 'Audio Classification' },
    ]
  },
  {
    category: "Tabular & RL",
    icon: Grid,
    items: [
      { id: UseCase.TABULAR_CLASSIFICATION, label: 'Tabular Classification' },
      { id: UseCase.REINFORCEMENT_LEARNING, label: 'Reinforcement Learning' },
      { id: UseCase.ROBOTICS, label: 'Robotics' },
      { id: UseCase.GRAPH_MACHINE_LEARNING, label: 'Graph ML' },
    ]
  }
];

export const MOCK_RECOMMENDATIONS = [];
