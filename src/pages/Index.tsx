import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { AppointmentCard } from "@/components/AppointmentCard";
import { TodoItem } from "@/components/TodoItem";
import { BirthdayCard } from "@/components/BirthdayCard";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, CheckSquare, Cake, StickyNote, Plus, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleAppointments = [
  { id: '1', title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', location: 'Conference Room A', type: 'meeting' as const },
  { id: '2', title: 'Doctor Appointment', date: '2024-01-16', time: '2:30 PM', location: 'Medical Center', type: 'health' as const },
  { id: '3', title: 'Coffee with Sarah', date: '2024-01-17', time: '11:00 AM', location: 'Downtown Café', type: 'personal' as const },
];

const sampleBirthdays = [
  { id: '1', name: 'John Smith', date: 'Jan 15', age: 32, daysUntil: 0 },
  { id: '2', name: 'Emma Wilson', date: 'Jan 18', age: 28, daysUntil: 3 },
  { id: '3', name: 'Mike Johnson', date: 'Jan 22', age: 35, daysUntil: 7 },
];

const Index = () => {
  // ALL HOOKS MUST BE AT THE TOP
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [todos, setTodos] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string; createdAt: string; updatedAt: string }>>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Effects after all state hooks
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Fetch user's todos and notes when logged in
  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchNotes();
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    setLoadingTodos(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: "Failed to fetch todos", variant: "destructive" });
    } else {
      setTodos(data || []);
    }
    setLoadingTodos(false);
  };

  const fetchNotes = async () => {
    if (!user) return;
    setLoadingNotes(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error", description: "Failed to fetch notes", variant: "destructive" });
    } else {
      // Map database fields to component expected format
      const mappedNotes = (data || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content || '',
        createdAt: new Date(note.created_at).toLocaleDateString(),
        updatedAt: new Date(note.updated_at).toLocaleDateString()
      }));
      setNotes(mappedNotes);
    }
    setLoadingNotes(false);
  };

  // CONDITIONAL LOGIC AFTER ALL HOOKS
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const toggleTodo = async (id: string) => {
    if (!user) return;
    
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update todo", variant: "destructive" });
    } else {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete todo", variant: "destructive" });
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !user) return;

    const { error } = await supabase
      .from('todos')
      .insert([{
        text: newTodo.trim(),
        user_id: user.id,
        completed: false
      }]);

    if (error) {
      toast({ title: "Error", description: "Failed to add todo", variant: "destructive" });
    } else {
      setNewTodo('');
      fetchTodos(); // Refresh the list
    }
  };

  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim() || !user) return;

    const { error } = await supabase
      .from('notes')
      .insert([{
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        user_id: user.id
      }]);

    if (error) {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } else {
      setNewNote({ title: '', content: '' });
      setIsNoteDialogOpen(false);
      fetchNotes(); // Refresh the list
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete note", variant: "destructive" });
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const editNote = (note: any) => {
    // Simple implementation - just log for now
    console.log('Edit note:', note);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src="/lovable-uploads/9b80bb51-801a-45bc-bcb5-7c618112a7b8.png" 
                alt="Ayesha AI Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent mb-2">
              Welcome back, {profile?.display_name || 'User'}!
            </h1>
            <p className="text-lg font-medium text-muted-foreground mb-2">Automate the ordinary. Focus on the extraordinary.</p>
            <p className="text-muted-foreground">Manage your appointments, tasks, birthdays, and notes all in one place</p>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="flex items-center gap-2 absolute top-6 right-6"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Appointments */}
          <DashboardCard title="Upcoming Appointments" icon={Calendar} className="lg:col-span-2">
            <div className="space-y-3">
              {sampleAppointments.slice(0, 3).map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </DashboardCard>

          {/* Birthdays */}
          <DashboardCard title="Upcoming Birthdays" icon={Cake}>
            <div className="space-y-3">
              {sampleBirthdays.map(birthday => (
                <BirthdayCard key={birthday.id} birthday={birthday} />
              ))}
            </div>
          </DashboardCard>

          {/* To-Do List */}
          <DashboardCard title="To-Do List" icon={CheckSquare}>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  className="flex-1"
                />
                <Button onClick={addTodo} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {todos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    {...todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Notes Section */}
        <DashboardCard title="Recent Notes" icon={StickyNote} className="lg:col-span-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Notes</h3>
              <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Note title..."
                      value={newNote.title}
                      onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    />
                    <Textarea
                      placeholder="Write your note here..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      rows={4}
                    />
                    <Button onClick={addNote} className="w-full">
                      Save Note
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={editNote}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Index;
