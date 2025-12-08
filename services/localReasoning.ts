
import { MODEL_DB } from '../data/localModels';
import { HardwareSpecs, ModelRecommendation, RecommendationResponse, UseCase, LocalModelDB } from '../types';

// Map specific granular UI UseCases to internal broad DB tags
const TASK_MAPPING: Record<string, string[]> = {
  // Multimodal
  [UseCase.AUDIO_TEXT_TO_TEXT]: ['audio', 'chat', 'asr'],
  [UseCase.IMAGE_TEXT_TO_TEXT]: ['vision', 'ocr'],
  [UseCase.VISUAL_QUESTION_ANSWERING]: ['vision', 'qa', 'chat'],
  [UseCase.DOCUMENT_QUESTION_ANSWERING]: ['ocr', 'qa', 'vision'],
  [UseCase.VIDEO_TEXT_TO_TEXT]: ['vision', 'video-analysis'],
  [UseCase.VISUAL_DOCUMENT_RETRIEVAL]: ['ocr', 'vision'],
  [UseCase.ANY_TO_ANY]: ['multimodal', 'vision', 'audio'],

  // Scientific
  [UseCase.SCIENCE]: ['science', 'research', 'reasoning'],
  [UseCase.PHYSICS]: ['physics', 'science', 'research'],
  [UseCase.CHEMISTRY]: ['chemistry', 'science', 'research'],
  [UseCase.BIOLOGY]: ['biology', 'medicine', 'science'],
  [UseCase.PROTEIN_BIOLOGY]: ['protein', 'biology', 'science'],
  [UseCase.MEDICINE]: ['medicine', 'biology', 'science'],
  [UseCase.GENOMICS]: ['genomics', 'biology', 'science'],
  [UseCase.ENVIRONMENTAL_SCIENCE]: ['environmental-science', 'research'],
  [UseCase.MATHEMATICS]: ['math', 'reasoning', 'formula'],
  [UseCase.ASTRONOMY]: ['science', 'physics', 'research'],

  // Computer Vision
  [UseCase.DEPTH_ESTIMATION]: ['vision'],
  [UseCase.IMAGE_CLASSIFICATION]: ['vision'],
  [UseCase.OBJECT_DETECTION]: ['vision', 'object-detection'],
  [UseCase.IMAGE_SEGMENTATION]: ['vision'],
  [UseCase.TEXT_TO_IMAGE]: ['text-to-image'],
  [UseCase.IMAGE_TO_TEXT]: ['vision', 'ocr'],
  [UseCase.IMAGE_TO_IMAGE]: ['text-to-image', 'vision'],
  [UseCase.IMAGE_TO_VIDEO]: ['text-to-video'],
  [UseCase.TEXT_TO_VIDEO]: ['text-to-video'],
  [UseCase.UNCONDITIONAL_IMAGE_GEN]: ['text-to-image'],
  [UseCase.VIDEO_CLASSIFICATION]: ['vision', 'video-analysis'],
  [UseCase.ZERO_SHOT_IMAGE_CLASSIFICATION]: ['vision'],
  [UseCase.TEXT_TO_3D]: ['vision', 'text-to-3d', '3d'],
  [UseCase.IMAGE_TO_3D]: ['vision', 'image-to-3d', '3d'],
  [UseCase.THREE_D_MODELING]: ['3d', 'vision', 'text-to-3d', 'image-to-3d'],

  // NLP
  [UseCase.TEXT_CLASSIFICATION]: ['chat', 'reasoning'],
  [UseCase.TOKEN_CLASSIFICATION]: ['chat'],
  [UseCase.TABLE_QUESTION_ANSWERING]: ['qa', 'reasoning'],
  [UseCase.QUESTION_ANSWERING]: ['qa', 'chat'],
  [UseCase.ZERO_SHOT_CLASSIFICATION]: ['chat', 'reasoning'],
  [UseCase.TRANSLATION]: ['translation', 'multilingual', 'chat'],
  [UseCase.SUMMARIZATION]: ['chat', 'reasoning'],
  [UseCase.FEATURE_EXTRACTION]: ['chat'],
  [UseCase.TEXT_GENERATION]: ['chat', 'creative'],
  [UseCase.FILL_MASK]: ['chat'],
  [UseCase.SENTENCE_SIMILARITY]: ['chat'],
  [UseCase.TEXT_RANKING]: ['chat'],

  // Audio
  [UseCase.TEXT_TO_SPEECH]: ['audio', 'text-to-speech', 'tts'],
  [UseCase.TEXT_TO_AUDIO]: ['audio', 'text-to-audio', 'tts'],
  [UseCase.AUTOMATIC_SPEECH_RECOGNITION]: ['audio', 'asr', 'transcription'],
  [UseCase.AUDIO_TO_AUDIO]: ['audio', 'audio-to-audio'],
  [UseCase.AUDIO_CLASSIFICATION]: ['audio', 'audio-classification', 'classification'],
  
  // Other
  [UseCase.TABULAR_CLASSIFICATION]: ['coding', 'reasoning'],
  [UseCase.TABULAR_REGRESSION]: ['coding', 'reasoning'],
  [UseCase.REINFORCEMENT_LEARNING]: ['coding', 'reasoning', 'domain-adaptation'],
  [UseCase.ROBOTICS]: ['coding', 'vision'],
  [UseCase.GRAPH_MACHINE_LEARNING]: ['coding', 'reasoning']
};

/**
 * Computes a fit score based on the "FitScore Engine" rules provided.
 * FitScore = HardwareScore + CapabilityScore + LocalityScore + LicenseScore
 */
const calculateFitScore = (
  model: LocalModelDB, 
  hardware: HardwareSpecs, 
  userTasks: Set<string>
): number => {
  let hardwareScore = 0;
  let capabilityScore = 0;
  let localityScore = 0;
  let licenseScore = 0;

  const isAppleSilicon = hardware.gpuVendor === 'Apple Silicon' || hardware.cpuType === 'Apple Silicon';
  const isIntegrated = hardware.gpuVendor === 'Intel'; // Integrated/Shared usually

  // --- HardwareScore ---
  if (isAppleSilicon) {
     // Apple Silicon Unified Memory Logic
     // For M1/M2/M3, VRAM is effectively a partition of System RAM.
     // Check RAM primarily.
     if (hardware.ram >= model.min_hardware.ram_gb) {
        hardwareScore += 40; // Base fit score
     }

     // EFFICIENCY BOOST: Prioritize models with lower RAM requirements first (Headroom)
     // Formula: Score boosts as (Available RAM - Required RAM) increases relative to Total RAM.
     if (hardware.ram > 0) {
        const ramHeadroomRatio = Math.max(0, (hardware.ram - model.min_hardware.ram_gb) / hardware.ram);
        hardwareScore += Math.floor(ramHeadroomRatio * 50);
     }

  } else if (isIntegrated) {
     // Intel / Shared Memory Logic
     // Treat VRAM as flexible, bounded by ~50% of System RAM usually.
     // We assume the user might input '128MB' for VRAM (dedicated) but has 16GB RAM.
     const effectiveVram = Math.max(hardware.vram, hardware.ram * 0.5);
     
     if (effectiveVram >= model.min_hardware.gpu_vram_gb) {
         hardwareScore += 30; // Slightly lower base score than dedicated/apple
     } else {
         hardwareScore -= 10;
     }

     if (hardware.ram >= model.min_hardware.ram_gb) {
         hardwareScore += 10;
     }

  } else {
     // Standard Discrete GPU Logic
     // +40 if VRAM >= vram_required
     if (hardware.vram >= model.min_hardware.gpu_vram_gb) {
        hardwareScore += 40;
     } else if (model.formats.includes("GGUF") && hardware.ram >= model.min_hardware.ram_gb * 1.5) {
        // Fallback: If VRAM low but System RAM high (1.5x req), GGUF can offload to CPU.
        hardwareScore += 20;
     } else {
        // Severe penalty if VRAM is insufficient and no CPU fallback room
        hardwareScore -= 30;
     }
  }

  // +30 if CPU-only possible (We assume GGUF/ONNX capable models are CPU possible)
  if (model.formats.includes("GGUF") || model.formats.includes("ONNX")) {
    hardwareScore += 30;
  }
  
  // +10 if Disk OK
  if (hardware.diskSpace >= 20) {
    hardwareScore += 10;
  }

  // --- CapabilityScore ---
  // Iterate all user tasks and check if model tags match
  userTasks.forEach(task => {
      if (model.tasks.includes(task)) {
          capabilityScore += 20; // 20 points per matched capability
      }
      // Special logic for prompts
      if (task === 'text-to-video' && model.text_to_video_prompt) capabilityScore += 15;
      if (task === 'text-to-image' && model.text_to_image_prompt) capabilityScore += 15;
  });


  // --- LocalityScore ---
  // +40 Pinokio ready
  if (model.pinokio) localityScore += 40;
  // +30 Ollama ready (In our DB, most GGUF models are easily Ollama compatible)
  if (model.type === "LLM") localityScore += 30;
  // +30 GGUF available
  if (model.formats.includes("GGUF")) localityScore += 30;
  
  // CRITICAL: MLX Optimization Logic
  if (isAppleSilicon && model.apple_silicon_optimized) {
    // Huge boost for MLX on Mac to ensure they appear at the top
    localityScore += 120; 
  }

  // --- LicenseScore ---
  // +40 full open weights (Apache/MIT)
  if (model.license.includes("Apache") || model.license.includes("MIT") || model.license.includes("Llama")) {
    licenseScore += 40;
  } else if (model.license.includes("Open") || model.license.includes("Gemma")) {
    // +30 research friendly / other open
    licenseScore += 30;
  } else {
    licenseScore += 20;
  }

  return hardwareScore + capabilityScore + localityScore + licenseScore;
};

export const runLocalQuery = async (
  hardware: HardwareSpecs,
  selectedUseCases: UseCase[]
): Promise<RecommendationResponse> => {
  
  // 1. Flatten requested tasks
  const requestedTasks = new Set<string>();
  selectedUseCases.forEach(uc => {
    const tasks = TASK_MAPPING[uc] || [];
    tasks.forEach(t => requestedTasks.add(t));
  });

  const isAppleSilicon = hardware.gpuVendor === 'Apple Silicon' || hardware.cpuType === 'Apple Silicon';
  const isIntegrated = hardware.gpuVendor === 'Intel';
  const isSharedMemory = isAppleSilicon || isIntegrated;

  // 2. Filter and Score
  const candidates = MODEL_DB.map(model => {
    // Strict Hardware Filter
    
    // RAM Check:
    // If Apple Silicon, we rely heavily on Unified RAM.
    if (model.min_hardware.ram_gb > hardware.ram) {
        return null; 
    }
    
    // Discrete GPU VRAM Check:
    // If NOT shared memory, and model strictly needs GPU (not GGUF/CPU-able), filter by VRAM.
    // If it is GGUF, we are lenient because of CPU offloading.
    if (!isSharedMemory) {
        if (!model.formats.includes("GGUF") && hardware.vram < model.min_hardware.gpu_vram_gb) {
             return null;
        }
        // If it IS GGUF but VRAM is low, we check if there is enough RAM for CPU offload (approx 1.5x model size)
        if (model.formats.includes("GGUF") && hardware.vram < model.min_hardware.gpu_vram_gb) {
             if (hardware.ram < model.min_hardware.ram_gb) {
                 return null; // Can't even fit in RAM
             }
        }
    }
    
    // Use Case Filter (At least one must match)
    // Note: If the user selected lots of tasks, we just want to see if the model helps with AT LEAST one.
    // OR, if it's a prompt generator for a selected creative task.
    const matchesTask = model.tasks.some(t => requestedTasks.has(t));
    
    let isPromptHelper = false;
    if (requestedTasks.has('text-to-video') && model.text_to_video_prompt) isPromptHelper = true;
    if (requestedTasks.has('text-to-image') && model.text_to_image_prompt) isPromptHelper = true;

    if (!matchesTask && !isPromptHelper && selectedUseCases.length > 0) {
        return null;
    }
    
    const score = calculateFitScore(model, hardware, requestedTasks);
    return { model, score };
  })
  .filter((item): item is { model: LocalModelDB, score: number } => item !== null && item.score > 0)
  .sort((a, b) => b.score - a.score);

  // 3. Select Top 5
  const topMatches = candidates.slice(0, 5);

  // 4. Transform to UI ModelRecommendation
  const recommendedModels: ModelRecommendation[] = topMatches.map(({ model, score }) => {
    
    let reason = "Fits hardware constraints.";
    if (isAppleSilicon && model.apple_silicon_optimized) {
        reason = "Optimized for Apple Silicon (MLX). Runs natively on Neural Engine.";
    } else if (isSharedMemory) {
        reason = "Compatible with Shared Memory architecture.";
    } else if (hardware.vram >= model.min_hardware.gpu_vram_gb) {
        reason = "VRAM sufficient for full offloading.";
    } else if (model.formats.includes("GGUF")) {
        reason = "Can run partially on CPU via GGUF offloading.";
    }

    const safeName = model.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const ollamaName = model.name.split('-')[0].toLowerCase(); 
    
    // Construct HuggingFace Links
    const hfUrl = `https://huggingface.co/${model.repo}`;
    // Heuristic: If MLX, usually just repo link. If GGUF, look for .gguf
    const hfGGUF = model.backend === 'gguf' ? `${hfUrl}/resolve/main/${model.name}.gguf` : undefined;

    return {
      id: model.name,
      name: model.name,
      publisher: model.publisher,
      provider: model.provider, // New field mapped
      repo: model.repo,
      sizeParams: `${model.params_b}B`,
      vramReq: model.min_hardware.gpu_vram_gb,
      recommendedQuantization: model.quantization,
      description: model.description,
      reason: reason,
      score: score,
      pinokioLink: model.pinokio ? `pinokio://install/github.com/pinokiofactory/ollama` : undefined,
      ollamaCommand: model.backend === 'gguf' ? `ollama pull ${ollamaName}` : undefined,
      lmStudioCommand: `Search "${model.name}"`,
      llamaCppCommand: model.backend === 'gguf' ? `./main -m ${safeName}.gguf -p "User:"` : undefined,
      hfUrl: hfUrl,
      hfGGUF: hfGGUF,
      installCommand: model.backend === 'mlx' ? `pip install mlx-lm && python -m mlx_lm.generate --model ${model.repo} --prompt "Hello"` : undefined,
      type: model.type,
      license: model.license,
      tags: model.tasks,
      inferenceSpeed: "N/A", 
      backend: model.backend,
      appleSiliconOptimized: model.apple_silicon_optimized,
      libraries: model.libraries,
      providers: model.providers,
      benchmarks: [
        { name: "Fit Score", score: Math.min(score, 300) / 3, maxScore: 100 }
      ]
    };
  });

  return {
    models: recommendedModels,
    summary: `Found ${recommendedModels.length} optimized models. Top match: ${topMatches[0]?.model.name}.`,
    hardwareNotes: isAppleSilicon ? "Apple Silicon detected. Prioritizing MLX models & Efficiency." : isIntegrated ? "Shared Graphics Memory detected. Prioritizing RAM-efficient models." : "Discrete GPU detected. Prioritizing GGUF/Ollama."
  };
};
