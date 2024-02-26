// Utils
import { useReducer, useRef, useEffect } from 'react';

// Types
import { Idea } from '@/App';
type ActionWithText = 'editingTitle' | 'editingContent';

type Action =
  | {
      type: ActionWithText;
      text: string;
    }
  | { type: 'update' };

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
      if (action.text.length >= 140) {
        return state;
      }

      return {
        ...state,
        content: action.text,
        contentLength: action.text.length,
      };
    }
    case 'update':
      return { ...state, updatedAt: new Date() };
    default:
      return state;
  }
};

const IdeaCard = ({
  idea,
  removeIdea,
}: {
  idea: Idea;
  removeIdea: (time: number) => void;
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
    dispatch({ type: 'update' });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center pb-2 space-y-0 gap-x-2'>
        <CardTitle>
          <Input
            value={state.title}
            name='title'
            className='text-3xl font-bold border-none'
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
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
          onChange={handleChange}
          value={state.content}
          ref={textAreaRef}
          onFocus={(e) => e.target.select()}
          onBlur={handleUpdate}
          rows={1}
          className='min-h-0 border-none resize-none peer'
        />

        <p className='h-0 mt-1 text-xs text-right transition-opacity opacity-0 peer-focus:opacity-100 peer-focus:h-auto'>
          {state.contentLength}/140
        </p>
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
