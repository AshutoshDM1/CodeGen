import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { AIResponse } from '@/store/chatStore';

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const errorHandler = (err: unknown) => {
  if (err instanceof Error) {
    console.log(err.name, err.message);
    toast.success(err.name as string, {
      description: err.message,
    });
  }
  if (err instanceof AxiosError) {
    toast.error('Axios error occurred view in console.');
    console.error(err);
  } else {
    toast.error('An unknown error occurred view in console.');
    console.error(err);
  }
};

const enhancePromptApi = async (inputValue: string) => {
  try {
    const response: Response = await fetch(`${URL}/api/v1/ai/refinePrompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: inputValue }),
    });
    return response;
  } catch (err) {
    errorHandler(err);
  }
};

const createProject = async (userEmail: string, projectName: string) => {
  try {
    const response = await axios.post(`${URL}/api/v1/project/createProject`, {
      userEmail,
      projectName,
      projectDescription: 'this is a react project',
    });
    console.log(response.data);
    toast.success('Project created successfully');
    return response.data;
  } catch (err) {
    errorHandler(err);
  }
};
const getALLProject = async (userEmail: string) => {
  try {
    let response: Response = await axios.post(`${URL}/api/v1/project/getAllProject`, {
      userEmail,
    });
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    errorHandler(err);
  }
};

const createMessage = async (
  message: string | AIResponse,
  role: 'user' | 'assistant',
  projectId: number | null,
) => {
  try {
    console.log(message, role, projectId);
    const response: Response = await axios.post(`${URL}/api/v1/message/createMessage`, {
      message: { role: role, content: message },
      projectId,
    });
    return response;
  } catch (err) {
    errorHandler(err);
  }
};

// AI endpoints
export { enhancePromptApi };

// Project endpoints
export { createProject, getALLProject };

// Message endpoints
export { createMessage };
