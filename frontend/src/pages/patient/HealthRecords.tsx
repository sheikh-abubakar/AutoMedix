import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Upload, Download, Eye, Plus, Calendar, User } from "lucide-react";

export default function HealthRecords() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  // Mock medical records for demo
  const mockRecords = [
    {
      id: "1",
      title: "Blood Test Results",
      description: "Complete Blood Count and Lipid Profile",
      fileUrl: "#",
      fileType: "application/pdf",
      uploadedAt: "2024-01-15T10:30:00Z",
      doctor: { name: "Dr. Sarah Johnson" },
    },
    {
      id: "2", 
      title: "X-Ray Report",
      description: "Chest X-Ray examination",
      fileUrl: "#",
      fileType: "image/png",
      uploadedAt: "2024-01-10T14:15:00Z",
      doctor: { name: "Dr. Michael Chen" },
    },
    {
      id: "3",
      title: "Prescription",
      description: "Medication for hypertension",
      fileUrl: "#",
      fileType: "application/pdf",
      uploadedAt: "2024-01-08T09:45:00Z",
      doctor: { name: "Dr. Sarah Johnson" },
    },
  ];

  const uploadRecordMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("/api/medical-records", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medical record uploaded successfully!",
      });
      setUploadForm({ title: "", description: "", file: null });
      setIsUploadModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload record. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("description", uploadForm.description);
    formData.append("file", uploadForm.file);
    formData.append("patientId", "mock-patient-id"); // Would be actual patient ID

    uploadRecordMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg", 
        "image/png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, JPG, PNG, or DOCX files only.",
          variant: "destructive",
        });
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size should not exceed 10MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadForm({ ...uploadForm, file });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("document")) return "📝";
    return "📎";
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
            <p className="text-gray-600 mt-1">Manage your medical documents and reports</p>
          </div>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-upload-record">
                <Plus className="h-4 w-4 mr-2" />
                Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl shadow-2xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#25d7eb] text-xl font-bold">Upload Medical Record</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleUpload} className="space-y-5">
                <div>
                  <Label htmlFor="title" className="font-semibold text-gray-700">Title *</Label>
                  <Input
                    id="title"
                    className="mt-1 rounded-lg border-gray-300 focus:border-[#25d7eb] focus:ring-[#25d7eb]"
                    placeholder="e.g., Blood Test Results"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    data-testid="input-record-title"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    className="mt-1 rounded-lg border-gray-300 focus:border-[#25d7eb] focus:ring-[#25d7eb]"
                    placeholder="Brief description of the document"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    data-testid="textarea-record-description"
                  />
                </div>
                <div>
                  <Label htmlFor="file" className="font-semibold text-gray-700">File * (PDF, JPG, PNG, DOCX - Max 10MB)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    className="mt-1 rounded-lg border-gray-300 focus:border-[#25d7eb] focus:ring-[#25d7eb]"
                    onChange={handleFileChange}
                    data-testid="input-record-file"
                  />
                  {uploadForm.file && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {uploadForm.file.name}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#25d7eb] hover:bg-[#1cb6c4] text-white font-semibold rounded-lg shadow"
                    disabled={uploadRecordMutation.isPending}
                    data-testid="button-upload-submit"
                  >
                    {uploadRecordMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 rounded-lg"
                    onClick={() => setIsUploadModalOpen(false)}
                    data-testid="button-upload-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecords.map(record => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getFileIcon(record.fileType)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base" data-testid={`text-record-title-${record.id}`}>
                        {record.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1" data-testid={`text-record-description-${record.id}`}>
                        {record.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span data-testid={`text-record-date-${record.id}`}>
                      {formatDate(record.uploadedAt)}
                    </span>
                  </div>
                  
                  {record.doctor && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span data-testid={`text-record-doctor-${record.id}`}>
                        {record.doctor.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      data-testid={`button-view-record-${record.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      data-testid={`button-download-record-${record.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
            <p className="text-gray-600 mb-4">Upload your medical documents to keep them organized and accessible.</p>
            <Button onClick={() => setIsUploadModalOpen(true)} data-testid="button-upload-first-record">
              <Upload className="h-4 w-4 mr-2" />
              Upload First Record
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}