import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'meeting' | 'personal' | 'health' | 'other';
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const typeColors = {
  meeting: 'border-l-info',
  personal: 'border-l-primary',
  health: 'border-l-success',
  other: 'border-l-warning'
};

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  return (
    <Card className={`p-3 border-l-4 ${typeColors[appointment.type]} hover:shadow-md transition-shadow`}>
      <div className="space-y-2">
        <h4 className="font-medium text-foreground">{appointment.title}</h4>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {appointment.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {appointment.time}
          </div>
          {appointment.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {appointment.location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};