interface TypingText {
  id: string;
  text: string[];  // Array of strings for line-by-line display
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'technology' | 'science' | 'literature' | 'general';
}

const typingTexts: TypingText[] = [
  {
    id: "tech-1",
    text: [
      "Programming is the art of telling a computer what to do through carefully written instructions.",
      "It requires logical thinking, problem-solving skills, and attention to detail.",
      "Good programmers write code that is not only functional but also maintainable and readable.",
      "They understand that code is read more often than it is written.",
      "The best code is often the simplest solution to a complex problem."
    ],
    difficulty: "easy",
    category: "technology"
  },
  {
    id: "tech-2",
    text: [
      "The internet has revolutionized how we share information and connect with others.",
      "It is a vast network of interconnected computers spanning the entire globe.",
      "Through standardized protocols, these computers can communicate seamlessly.",
      "This global network has transformed business, education, and social interaction.",
      "It continues to evolve with new technologies and innovations every day."
    ],
    difficulty: "easy",
    category: "technology"
  },
  {
    id: "science-1",
    text: [
      "Quantum computing represents a fundamental shift in how we process information.",
      "Unlike classical computers that use bits, quantum computers utilize quantum bits or qubits.",
      "These qubits can exist in multiple states simultaneously, thanks to quantum mechanics.",
      "This property allows quantum computers to solve certain problems exponentially faster.",
      "However, maintaining quantum states is incredibly challenging due to environmental interference.",
      "Scientists are working to overcome these challenges through various error correction methods.",
      "The potential applications of quantum computers range from cryptography to drug discovery."
    ],
    difficulty: "medium",
    category: "science"
  },
  {
    id: "literature-1",
    text: [
      "The art of storytelling has been an essential part of human culture since ancient times.",
      "Through narratives, we share experiences and preserve our collective history.",
      "Stories help us explore the depths of human imagination and emotion.",
      "They can transport us to different worlds and help us understand diverse perspectives.",
      "From oral traditions to digital media, storytelling continues to evolve.",
      "Yet its fundamental purpose remains the same: to connect and inspire."
    ],
    difficulty: "medium",
    category: "literature"
  },
  {
    id: "general-1",
    text: [
      "Touch typing is a skill that allows you to type without looking at the keyboard.",
      "The home row keys - ASDF for the left hand and JKL; for the right hand - are the foundation.",
      "With practice, your fingers develop muscle memory for each key's location.",
      "This technique significantly increases typing speed and reduces fatigue.",
      "Professional typists can achieve speeds of over 100 words per minute.",
      "Regular practice and proper posture are essential for developing this skill."
    ],
    difficulty: "easy",
    category: "general"
  },
  {
    id: "tech-3",
    text: [
      "Artificial Intelligence is transforming how we interact with technology.",
      "Machine Learning algorithms can analyze vast amounts of data to find patterns.",
      "These patterns help computers make intelligent decisions and predictions.",
      "From recommendation systems to autonomous vehicles, AI is everywhere.",
      "The field continues to evolve with new breakthroughs in neural networks.",
      "Ethical considerations are becoming increasingly important in AI development.",
      "The future promises even more exciting applications of this technology."
    ],
    difficulty: "medium",
    category: "technology"
  },
  {
    id: "science-2",
    text: [
      "The human brain is perhaps the most complex structure in the known universe.",
      "It processes information through billions of neurons connected by trillions of synapses.",
      "This intricate network enables us to think, feel, and control our actions.",
      "Every thought and memory emerges from patterns of neural activity.",
      "Scientists are still discovering new aspects of brain function and organization.",
      "Understanding the brain could help us treat neurological disorders.",
      "It might also inspire new approaches to artificial intelligence."
    ],
    difficulty: "hard",
    category: "science"
  },
  {
    id: "general-2",
    text: [
      "Effective communication is essential in both professional and personal life.",
      "It involves not only speaking and writing clearly but also listening actively.",
      "Understanding different perspectives helps build stronger relationships.",
      "Non-verbal cues often convey more meaning than words alone.",
      "Digital communication has added new dimensions to how we interact.",
      "Developing these skills requires practice and self-awareness.",
      "The best communicators adapt their style to their audience."
    ],
    difficulty: "easy",
    category: "general"
  }
];

// Helper function to get a random text
function getRandomText(): TypingText {
  return typingTexts[Math.floor(Math.random() * typingTexts.length)];
}

// Helper function to get text by difficulty
function getTextsByDifficulty(difficulty: TypingText['difficulty']): TypingText[] {
  return typingTexts.filter(text => text.difficulty === difficulty);
}

// Helper function to get text by category
function getTextsByCategory(category: TypingText['category']): TypingText[] {
  return typingTexts.filter(text => text.category === category);
}

// Single export statement at the end
export type { TypingText };
export { 
  typingTexts,
  getRandomText,
  getTextsByDifficulty,
  getTextsByCategory
}; 