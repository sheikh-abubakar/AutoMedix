import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: any) => void;
}

export default function AppointmentModal({ isOpen, onClose, onSubmit }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      patientId: "",
      date: "",
      time: "",
      type: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select 
              value={formData.patientId} 
              onValueChange={(value) => setFormData({...formData, patientId: value})}
            >
              <SelectTrigger data-testid="select-patient">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient1">Emily Rodriguez</SelectItem>
                <SelectItem value="patient2">Michael Chen</SelectItem>
                <SelectItem value="patient3">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                data-testid="input-appointment-date"
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                data-testid="input-appointment-time"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value})}
            >
              <SelectTrigger data-testid="select-appointment-type">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general-checkup">General Checkup</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="video-call">Video Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              data-testid="textarea-appointment-notes"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              data-testid="button-schedule-appointment"
            >
              Schedule
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel-appointment"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
