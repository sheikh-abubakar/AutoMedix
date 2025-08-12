import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Star, Calendar } from "lucide-react";

export default function FindDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Mock doctors data for demo
  const mockDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      experience: 15,
      rating: 4.9,
      totalReviews: 247,
      consultationFee: 150,
      isAvailable: true,
      profileImage: null,
      bio: "Experienced cardiologist with expertise in heart disease prevention and treatment."
    },
    {
      id: "2", 
      name: "Dr. Michael Chen",
      specialization: "Dermatology",
      experience: 8,
      rating: 4.8,
      totalReviews: 189,
      consultationFee: 120,
      isAvailable: true,
      profileImage: null,
      bio: "Specialized in skin conditions and cosmetic dermatology procedures."
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrics", 
      experience: 12,
      rating: 4.7,
      totalReviews: 324,
      consultationFee: 130,
      isAvailable: false,
      profileImage: null,
      bio: "Pediatric specialist focusing on child healthcare and development."
    }
  ];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !specialty || doctor.specialization === specialty;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = ["Cardiology", "Dermatology", "Pediatrics", "Neurology", "Orthopedics"];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
          <p className="text-gray-600 mt-1">Search and book appointments with qualified doctors</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search doctors or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-doctors"
            />
          </div>
          
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger data-testid="select-specialty">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Specialties</SelectItem>
              {specialties.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => {setSearchTerm(""); setSpecialty("");}}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`text-doctor-name-${doctor.id}`}>
                      {doctor.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {doctor.specialization}
                    </Badge>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {doctor.experience} years
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {doctor.rating} ({doctor.totalReviews})
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4" data-testid={`text-doctor-bio-${doctor.id}`}>
                  {doctor.bio}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900">${doctor.consultationFee}</span>
                    <span className="text-gray-600 text-sm ml-1">/ consultation</span>
                  </div>
                  <Badge 
                    variant={doctor.isAvailable ? "default" : "secondary"}
                    className={doctor.isAvailable ? "bg-green-100 text-green-800" : ""}
                  >
                    {doctor.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    disabled={!doctor.isAvailable}
                    data-testid={`button-book-appointment-${doctor.id}`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid={`button-view-profile-${doctor.id}`}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </Layout>
  );
}