import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function FindDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search doctors by name or specialization
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/doctors", {
        params: {
          name: searchTerm,
          specialization: specialization
        }
      });
      setDoctors(res.data);
    } catch {
      setDoctors([]);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
          <p className="text-gray-600 mt-1">Search and book appointments with qualified doctors</p>
        </div>

        {/* Search Inputs */}
        <div className="mb-6 flex gap-4">
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Search by specialization"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor: any) => (
              <Card key={doctor._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{doctor.name}</CardTitle>
                  <Badge variant="secondary">{doctor.specialization}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600 mb-2">
                    Experience: {doctor.experience || "N/A"} years
                  </div>
                  <div className="text-gray-600 mb-2">
                    Email: {doctor.email}
                  </div>
                  {/* Add more doctor info if needed */}
                  <Button className="w-full mt-2" disabled>
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {doctors.length === 0 && !loading && (
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