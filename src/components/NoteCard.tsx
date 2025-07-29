import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-foreground line-clamp-1">{note.title}</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
        <div className="text-xs text-muted-foreground">
          {note.updatedAt !== note.createdAt ? `Updated ${note.updatedAt}` : `Created ${note.createdAt}`}
        </div>
      </div>
    </Card>
  );
};