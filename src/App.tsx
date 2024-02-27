// Utils
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

// Types
export type Idea = {
  title: string;
  content: string;
  contentLength: number;
  createdAt: Date;
  updatedAt: Date;
};

// Components
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import IdeaCard from '@/components/idea-card';

function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const handleAddIdea = () => {
    const newIdea: Idea = {
      title: 'Add a title',
      content: 'Add a content',
      contentLength: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
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

  const handleUpdateIdea = (updatedIdea: Idea) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.createdAt.getTime() === updatedIdea.createdAt.getTime()
          ? updatedIdea
          : idea
      )
    );
  };

  const handleSortIdeas = (value: string) => {
    switch (value) {
      case 'title':
        setIdeas((prev) =>
          [...prev].sort((a, b) => a.title.localeCompare(b.title))
        );
        break;
      case 'date-asc': {
        setIdeas((prev) => {
          return [...prev].sort(
            (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
          );
        });
        break;
      }
      case 'date-desc': {
        setIdeas((prev) => {
          return [...prev].sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
          );
        });
        break;
      }
    }
  };

  return (
    <>
      <div className='flex flex-col items-center max-w-md mx-auto my-4 gap-y-3'>
        <header className='text-center'>
          <h1 className='text-3xl font-bold'>Idea Board</h1>
          <p>Add and manage your ideas here</p>
        </header>

        {ideas.length > 0 ? (
          <section className='space-y-3'>
            {ideas.length > 1 && (
              <Select onValueChange={handleSortIdeas}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='title'>Title</SelectItem>
                  <SelectItem value='date-asc'>Date - ASC</SelectItem>
                  <SelectItem value='date-desc'>Date - DESC</SelectItem>
                </SelectContent>
              </Select>
            )}

            {ideas.map((idea) => (
              <IdeaCard
                key={idea.createdAt.toLocaleString()}
                idea={idea}
                removeIdea={handleRemoveIdea}
                updateIdea={handleUpdateIdea}
              />
            ))}
          </section>
        ) : null}

        <footer>
          <Button onClick={handleAddIdea}>Create your idea</Button>
        </footer>
      </div>

      <Toaster />
    </>
  );
}

export default App;
