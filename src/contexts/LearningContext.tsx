"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LearningContextType {
  courseTitle: string | null;
  lessonTitle: string | null;
  transcript: string | null;
  lessonId: string | null;
  setContext: (data: {
    courseTitle: string | null;
    lessonTitle: string | null;
    transcript: string | null;
    lessonId: string | null;
  }) => void;
  clearContext: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  const setContext = (data: {
    courseTitle: string | null;
    lessonTitle: string | null;
    transcript: string | null;
    lessonId: string | null;
  }) => {
    setCourseTitle(data.courseTitle);
    setLessonTitle(data.lessonTitle);
    setTranscript(data.transcript);
    setLessonId(data.lessonId);
  };

  const clearContext = () => {
    setCourseTitle(null);
    setLessonTitle(null);
    setTranscript(null);
    setLessonId(null);
  };

  return (
    <LearningContext.Provider value={{ courseTitle, lessonTitle, transcript, lessonId, setContext, clearContext }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearningContext() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error("useLearningContext must be used within a LearningProvider");
  }
  return context;
}
