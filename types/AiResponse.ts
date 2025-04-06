// This file is used to define the types of the AI response which is used in Chat-Input.tsx file
// Its for Pracer the data from the AI response.

export interface AIMessage {
  beforeMsg: string;
  boltArtifact: {
    title: string;
    fileActions: Array<{
      type: 'file';
      filePath?: string;
      content: string;
    }>;
    shellActions: Array<{
      type: 'shell';
      content: string;
    }>;
  };
  afterMsg: string;
}
