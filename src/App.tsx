// Utils
import { useState } from 'react';
import './App.css';

// Types
export type Idea = {
  title: string;
  content: string;
  contentLength?: number;
  createdAt: Date;
  updatedAt?: Date;
};
// Components
import { Button } from '@/components/ui/button';
import IdeaCard from '@/components/idea-card';

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const handleAddIdea = () => {
    const newIdea: Idea = {
      title: 'Add a title',
      content: 'Add a content',
      createdAt: new Date(),
    };
    setIdeas((prev) => [...prev, newIdea]);
  };

  const handleRemoveIdea = (time: number) => {
    const ideaIndex = ideas.findIndex(
      (idea) => idea.createdAt.getTime() === time
    );
    if (ideaIndex !== -1) {
      setIdeas((prev) => [
        ...prev.slice(0, ideaIndex),
        ...prev.slice(ideaIndex + 1),
      ]);
    }
  };

  return (
    <>
      <div className='max-w-md mx-auto my-4'>
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.createdAt.toLocaleString()}
            idea={idea}
            removeIdea={handleRemoveIdea}
          />
        ))}
      </div>

      <Button onClick={handleAddIdea}>Create your idea</Button>
    </>
  );
}

export default App;
