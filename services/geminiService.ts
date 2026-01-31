
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, OptimizedContent, InterviewPrep, PracticeSession, PracticeFeedback, UserProfile, SupportResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Contextual Memory: Global or Session-based Chat instance
let activeChat: Chat | null = null;

const getChatSession = (systemInstruction: string) => {
  if (!activeChat) {
    const ai = getAI();
    activeChat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction,
      },
    });
  }
  return activeChat;
};

export const parseProfileFromResume = async (
  resumeFile: { data: string; mimeType: string }
): Promise<{ name: string; email: string; profile: UserProfile }> => {
  const ai = getAI();

  const prompt = `
    Extract the candidate's basic profile information from this resume.
    Focus on name, email, a short professional headline, a summary of their career, and their top technical/soft skills.
    
    Provide output in strict JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: resumeFile.mimeType,
            data: resumeFile.data
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          email: { type: Type.STRING },
          profile: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experienceYears: { type: Type.NUMBER }
            },
            required: ["headline", "summary", "skills"]
          }
        },
        required: ["name", "email", "profile"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeResume = async (
  resumeFile: { data: string; mimeType: string },
  coverLetterFile: { data: string; mimeType: string } | null,
  jobDescription: string,
  company: string,
  title: string
): Promise<AnalysisResult> => {
  const ai = getAI();

  const prompt = `
    As a Resume AI Agent, evaluate the attached resume ${coverLetterFile ? "and cover letter" : ""} against the job description for ${title} at ${company}.
    
    Job Description: ${jobDescription}
    
    Adhere strictly to these logic rules:
    1. Overall Alignment Score is weighted: Skills Match (40%), Role Responsibility (25%), Keyword/ATS (15%), Experience (10%), Company Targeting (10%).
       ${coverLetterFile ? "Use the cover letter to evaluate the Company Targeting score." : ""}
    2. Pass conditions: Score >= 70%, <= 1 page (assume text length > 3000 chars is > 1 page), Company addressed.
    
    Provide output in strict JSON format.
  `;

  const parts: any[] = [
    {
      inlineData: {
        mimeType: resumeFile.mimeType,
        data: resumeFile.data
      }
    }
  ];

  if (coverLetterFile) {
    parts.push({
      inlineData: {
        mimeType: coverLetterFile.mimeType,
        data: coverLetterFile.data
      }
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: parts
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          status: { type: Type.STRING },
          checks: {
            type: Type.OBJECT,
            properties: {
              pageLength: { type: Type.BOOLEAN },
              formatPreserved: { type: Type.BOOLEAN },
              companyTargeted: { type: Type.BOOLEAN }
            },
            required: ["pageLength", "formatPreserved", "companyTargeted"]
          },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              skillsMatch: { type: Type.NUMBER },
              responsibilityMatch: { type: Type.NUMBER },
              keywordMatch: { type: Type.NUMBER },
              experienceFit: { type: Type.NUMBER },
              targeting: { type: Type.NUMBER }
            },
            required: ["skillsMatch", "responsibilityMatch", "keywordMatch", "experienceFit", "targeting"]
          },
          feedback: {
            type: Type.OBJECT,
            properties: {
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              atsNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["missingSkills", "suggestions", "atsNotes"]
          }
        },
        required: ["score", "status", "checks", "breakdown", "feedback"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const summarizeJob = async (description: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize this job description in 3 concise bullet points for a quick scan:\n\n${description}`,
  });
  return response.text || "Summary unavailable.";
};

export const generatePracticeQuestion = async (userContext?: string): Promise<PracticeSession> => {
  const ai = getAI();
  const prompt = `Generate a challenging technical interview question ${userContext ? `related to: ${userContext}` : "for a Software Engineer role"}. 
  The response should be in JSON format with 'question', 'category', and 'difficulty' (Easy, Medium, Hard).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          category: { type: Type.STRING },
          difficulty: { type: Type.STRING }
        },
        required: ["question", "category", "difficulty"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const evaluatePracticeAnswer = async (question: string, answer: string): Promise<PracticeFeedback> => {
  const ai = getAI();
  const prompt = `Evaluate the following interview answer for the question: "${question}"
  
  Answer: "${answer}"
  
  Provide feedback in JSON format with 'score' (0-100), 'strengths' (array), 'improvements' (array), and 'sampleAnswer' (string).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          sampleAnswer: { type: Type.STRING }
        },
        required: ["score", "strengths", "improvements", "sampleAnswer"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getSupportAdvice = async (
  resumeText: string | null,
  roleTitle: string | null
): Promise<SupportResponse> => {
  const ai = getAI();

  const prompt = `
    As a Career Support Agent, provide resume feedback and interview preparation guidance based on the following inputs.
    
    Resume Text: ${resumeText || "NOT PROVIDED"}
    Target Role: ${roleTitle || "NOT PROVIDED"}
    
    Instructions:
    1. If resume text or role is missing, indicate it in the "errors" array.
    2. Provide 3-5 specific suggestions for the resume.
    3. Generate a suggested "editable_output" which is a rewritten, improved version of the summary or core experience section of the resume.
    4. Provide 5-8 role-specific interview questions. 
    5. Group questions by "topic" and sort them by difficulty (easy < medium < hard).
    6. Provide feedback on general and role-specific preparation strategies.
    
    Return the response strictly in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resume_feedback: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    section: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                  },
                  required: ["text", "section", "severity"]
                }
              },
              editable_output: { type: Type.STRING }
            },
            required: ["suggestions", "editable_output"]
          },
          interview_preparation: {
            type: Type.OBJECT,
            properties: {
              role_specific_questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] }
                  },
                  required: ["question", "difficulty"]
                }
              },
              feedback: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["general", "role-specific"] }
                  },
                  required: ["text", "type"]
                }
              }
            },
            required: ["role_specific_questions", "feedback"]
          },
          errors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                message: { type: Type.STRING }
              },
              required: ["message"]
            }
          }
        },
        required: ["resume_feedback", "interview_preparation", "errors"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  
  // Enforce difficulty sorting: easy < medium < hard
  const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
  if (parsed.interview_preparation?.role_specific_questions) {
    parsed.interview_preparation.role_specific_questions.sort((a: any, b: any) => {
      const topicA = a.topic || '';
      const topicB = b.topic || '';
      if (topicA < topicB) return -1;
      if (topicA > topicB) return 1;
      return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
    });
  }

  return parsed;
};
