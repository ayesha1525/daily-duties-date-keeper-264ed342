import { Card } from "@/components/ui/card";
import { Cake, Calendar } from "lucide-react";

interface Birthday {
  id: string;
  name: string;
  date: string;
  age?: number;
  daysUntil: number;
}

interface BirthdayCardProps {
  birthday: Birthday;
}

export const BirthdayCard = ({ birthday }: BirthdayCardProps) => {
  const isToday = birthday.daysUntil === 0;
  const isUpcoming = birthday.daysUntil <= 7 && birthday.daysUntil > 0;

  return (
    <Card className={`p-3 transition-all duration-300 ${
      isToday ? 'bg-primary-light border-primary shadow-md' : 
      isUpcoming ? 'bg-warning/10 border-warning/30' : ''
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <Cake className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{birthday.name}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {birthday.date}
            {birthday.age && ` (${birthday.age} years)`}
          </div>
        </div>
        <div className="text-right">
          {isToday ? (
            <span className="text-sm font-medium text-primary">Today!</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {birthday.daysUntil} day{birthday.daysUntil !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};