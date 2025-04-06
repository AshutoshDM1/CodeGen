import { toast } from 'sonner';
import axios from 'axios';

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const errorHandler = (err: unknown) => {
  if (err instanceof Error) {
    toast.info(err.name as string, {
      description: err.message,
    });
  } else {
    toast.info('An unknown error occurred view in console.');
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

export { enhancePromptApi };
