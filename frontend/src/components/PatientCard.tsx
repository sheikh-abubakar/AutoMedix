import { Button } from "@/components/ui/button";
import { Eye, Video, Check, X } from "lucide-react";

interface PatientCardProps {
  appointment: {
    id: string;
    status: string;
    appointmentTime: string;
    type: string;
    patient?: {
      name?: string;
    };
  };
  onView: () => void;
  onStartConsultation?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const statusColors = {
  confirmed: "bg-green-50 border-green-200 text-green-800",
  in_progress: "bg-blue-50 border-blue-200 text-blue-800", 
  pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
  completed: "bg-gray-50 border-gray-200 text-gray-800",
  cancelled: "bg-red-50 border-red-200 text-red-800",
};

const statusLabels = {
  confirmed: "Confirmed",
  in_progress: "In Progress",
  pending: "Pending",
  completed: "Completed", 
  cancelled: "Cancelled",
};

export default function PatientCard({ 
  appointment, 
  onView, 
  onStartConsultation,
  onApprove,
  onReject 
}: PatientCardProps) {
  const statusClass = statusColors[appointment.status as keyof typeof statusColors] || statusColors.pending;
  const statusLabel = statusLabels[appointment.status as keyof typeof statusLabels] || "Pending";

  return (
    <div 
      className={`flex items-center p-4 rounded-lg border ${statusClass}`}
      data-testid={`card-appointment-${appointment.id}`}
    >
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900" data-testid={`text-patient-name-${appointment.id}`}>
            {appointment.patient?.name || "Patient Name"}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`} data-testid={`status-${appointment.id}`}>
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <span data-testid={`text-appointment-time-${appointment.id}`}>
            {appointment.appointmentTime}
          </span>
          <span className="mx-2">•</span>
          <span data-testid={`text-appointment-type-${appointment.id}`}>
            {appointment.type}
          </span>
        </div>
      </div>
      
      <div className="ml-4 flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onView}
          className="text-blue-600 hover:text-blue-800"
          data-testid={`button-view-${appointment.id}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        {appointment.status === 'confirmed' && onStartConsultation && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onStartConsultation}
            className="text-green-600 hover:text-green-800"
            data-testid={`button-start-consultation-${appointment.id}`}
          >
            <Video className="h-4 w-4" />
          </Button>
        )}
        
        {appointment.status === 'pending' && onApprove && onReject && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onApprove}
              className="text-green-600 hover:text-green-800"
              data-testid={`button-approve-${appointment.id}`}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReject}
              className="text-red-600 hover:text-red-800"
              data-testid={`button-reject-${appointment.id}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
