import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ id, text, completed, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
      />
      <span className={`flex-1 ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {text}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(id)}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};