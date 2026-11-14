import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export type Attempt = { id: string; at: string; topic: string; total: number; correct: number; seconds: number; breakdown?: Array<{ topic: string; total: number; correct: number }> };
type State = {
  completedLessons: number[]; attempts: Attempt[]; answered: number; correct: number; streak: number;
  markLesson: (id: number) => void; addAttempt: (attempt: Attempt) => void; reset: () => void;
  importData: (data: Partial<Pick<State,'completedLessons'|'attempts'|'answered'|'correct'|'streak'>>) => void;
};
export const useProgress = create<State>()(persist((set) => ({
  completedLessons:[], attempts:[], answered:0, correct:0, streak:0,
  markLesson:(id)=>set(s=>({completedLessons:s.completedLessons.includes(id)?s.completedLessons.filter(x=>x!==id):[...s.completedLessons,id]})),
  addAttempt:(attempt)=>set(s=>({attempts:[attempt,...s.attempts].slice(0,100),answered:s.answered+attempt.total,correct:s.correct+attempt.correct,streak:attempt.correct===attempt.total?s.streak+1:0})),
  reset:()=>set({completedLessons:[],attempts:[],answered:0,correct:0,streak:0}),
  importData:(data)=>set({
    completedLessons:Array.isArray(data.completedLessons)?data.completedLessons.filter(x=>Number.isInteger(x)&&x>=1&&x<=17):[],
    attempts:Array.isArray(data.attempts)?data.attempts.slice(0,100):[],
    answered:Number.isFinite(data.answered)?Math.max(0,Number(data.answered)):0,
    correct:Number.isFinite(data.correct)?Math.max(0,Number(data.correct)):0,
    streak:Number.isFinite(data.streak)?Math.max(0,Number(data.streak)):0
  })
}),{name:'adabx-v2-progress',version:2,storage:createJSONStorage(()=>localStorage)}));