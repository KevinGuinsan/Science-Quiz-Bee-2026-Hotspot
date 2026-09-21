export const questions = [
  {
    id: 1,
    category: "EASY",
    timeLimit: 10,
    points: 1,
    type: "MULTIPLE_CHOICE",
    question: "Which part of the compound microscope controls the amount of light that reaches the specimen?",
    options: [
      "Eyepiece",
      "Stage clips",
      "Iris diaphragm",
      "Coarse adjustment knob"
    ],
    answer: 2 // Option C: "Iris diaphragm"
  },
  {
    id: 2,
    category: "EASY",
    timeLimit: 10,
    points: 1,
    type: "MULTIPLE_CHOICE",
    question: "Which organelle is known as the powerhouse of the cell?",
    options: [
      "Nucleus",
      "Mitochondria",
      "Ribosome",
      "Endoplasmic Reticulum"
    ],
    answer: 1 // Option B: "Mitochondria"
  },
  {
    id: 3,
    category: "EASY",
    timeLimit: 10,
    points: 1,
    type: "MULTIPLE_CHOICE",
    question: "What basic unit of life makes up all living organisms?",
    options: [
      "Tissue",
      "Organ",
      "Cell",
      "Organ System"
    ],
    answer: 2 // Option C: "Cell"
  },
  {
    id: 4,
    category: "MODERATE",
    timeLimit: 15,
    points: 2,
    type: "MULTIPLE_CHOICE",
    question: "Which level of biological organization consists of all the living organisms of the same species in a specific area?",
    options: [
      "Community",
      "Population",
      "Ecosystem",
      "Biosphere"
    ],
    answer: 1 // Option B: "Population"
  },
  {
    id: 5,
    category: "MODERATE",
    timeLimit: 15,
    points: 2,
    type: "IDENTIFICATION",
    question: "What type of reproduction involves only one parent and produces offspring genetically identical to the parent?",
    options: [],
    answer: "Asexual reproduction"
  },
  {
    id: 6,
    category: "DIFFICULT",
    timeLimit: 20,
    points: 3,
    type: "MULTIPLE_CHOICE",
    question: "In an ecosystem, which group of organisms breaks down dead organic matter and returns nutrients to the soil?",
    options: [
      "Producers",
      "Primary Consumers",
      "Secondary Consumers",
      "Decomposers"
    ],
    answer: 3 // Option D: "Decomposers"
  },
  {
    id: 7,
    category: "CLINCHER",
    timeLimit: 15,
    points: 5,
    type: "IDENTIFICATION",
    question: "What green pigment in plant cells absorbs sunlight during photosynthesis?",
    options: [],
    answer: "Chlorophyll"
  }
];

/**
 * Returns a sanitized question object (without revealing correct answer) to send to client/player
 */
export function getSanitizedQuestionForClient(index) {
  const q = questions[index];
  if (!q) return null;
  return {
    id: q.id,
    category: q.category,
    timeLimit: q.timeLimit,
    type: q.type,
    question: q.question,
    options: q.options || []
  };
}

/**
 * Helper to verify student answer on the host side
 */
export function verifyAnswer(index, studentAnswer) {
  const q = questions[index];
  if (!q || studentAnswer === undefined || studentAnswer === null) return false;

  if (q.type === 'MULTIPLE_CHOICE') {
    return Number(studentAnswer) === Number(q.answer);
  } else if (q.type === 'IDENTIFICATION') {
    return String(studentAnswer).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
  }
  return false;
}
