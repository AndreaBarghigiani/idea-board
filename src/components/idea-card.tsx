// Utils
import { useReducer, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types
import { Idea } from '@/App';
type ActionWithText = 'editingTitle' | 'editingContent';

type Action =
  | {
      type: ActionWithText;
      text: string;
    }
  | { type: 'update'; updateFn?: (idea: Idea) => void };

// Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const reducer = (state: Idea, action: Action) => {
  switch (action.type) {
    case 'editingTitle':
      return { ...state, title: action.text };
    case 'editingContent': {
      if (action.text.length >= 140) return state;

      return {
        ...state,
        content: action.text,
        contentLength: action.text.length,
      };
    }
    case 'update': {
      const newState = { ...state, updatedAt: new Date() };

      // Workaround for race condition
      setTimeout(() => {
        if (action.updateFn) action.updateFn(newState);
      }, 200);

      return newState;
    }
    default:
      return state;
  }
};

const IdeaCard = ({
  idea,
  removeIdea,
  updateIdea,
}: {
  idea: Idea;
  removeIdea: (time: number) => void;
  updateIdea: (idea: Idea) => void;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [state, dispatch] = useReducer(reducer, idea);

  // Auto height for textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [state.content]);

  // Send update back to parent

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const actionType = `editing${
      name.charAt(0).toUpperCase() + name.slice(1)
    }` as ActionWithText;
    dispatch({ type: actionType, text: value });
  };

  const handleUpdate = () => {
    dispatch({ type: 'update', updateFn: updateIdea });
    toast('The idea has been updated.');
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center pb-2 space-y-0 gap-x-2'>
        <CardTitle>
          <Input
            name='title'
            value={state.title}
            className='text-3xl font-bold border-none'
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            onBlur={handleUpdate}
            autoFocus
          />
        </CardTitle>

        <Button
          size='icon'
          variant='destructive'
          onClick={() => removeIdea(idea.createdAt.getTime())}
        >
          <Trash className='size-4' />
        </Button>
      </CardHeader>

      <CardContent className='pb-2'>
        <Textarea
          name='content'
          value={state.content}
          className='min-h-0 border-none resize-none peer'
          onChange={handleChange}
          ref={textAreaRef}
          onFocus={(e) => e.target.select()}
          onBlur={handleUpdate}
          rows={1}
        />

        {state.contentLength > 100 && (
          <p
            className={cn(
              'h-0 mt-1 text-xs text-right transition-all opacity-0 peer-focus:opacity-100 peer-focus:h-auto',
              {
                'text-red-400': state.contentLength > 100,
                'text-red-600': state.contentLength > 115,
                'text-red-800': state.contentLength > 130,
              }
            )}
          >
            {state.contentLength}/140
          </p>
        )}
      </CardContent>

      <CardFooter>
        <p className='px-3 text-xs'>
          {state?.updatedAt ? (
            <>
              <strong>Updated at: </strong>
              <span className='text-slate-600'>
                {state.updatedAt.toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <strong>Created at: </strong>
              <span className='text-slate-600'>
                {state.createdAt.toLocaleString()}
              </span>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
