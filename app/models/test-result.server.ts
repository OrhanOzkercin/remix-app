export interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  correctWords: number;
  totalTypedWords: number;
  difficulty: string;
  createdAt: string;
}

const STORAGE_KEY = 'typing_test_results';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const createTestResult = (data: Omit<TestResult, 'id' | 'createdAt'>) => {
  const newResult: TestResult = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  // Get existing results
  const existingResults = getTestResults();
  
  // Add new result
  const updatedResults = [newResult, ...existingResults];
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  }

  return newResult;
};

export const getTestResults = () => {
  if (typeof window === 'undefined') return [];
  
  const results = localStorage.getItem(STORAGE_KEY);
  return results ? JSON.parse(results) as TestResult[] : [];
};

export const getRecentTestResults = (limit = 10) => {
  const results = getTestResults();
  return results
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getBestResults = () => {
  const results = getTestResults();
  return results
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 5);
};

export const getTopResults = (limit = 10) => {
  const results = getTestResults();
  return results
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, limit);
}; 