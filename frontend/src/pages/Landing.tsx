import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, FileText, Video, Shield, Star, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const visibleCards = 3;
const transitionTime = 700;

export default function Landing() {
  const [, setLocation] = useLocation();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  // Repeat testimonials if less than visibleCards
  let repeatedTestimonials = testimonials;
  if (testimonials.length > 0 && testimonials.length < visibleCards + 1) {
    const repeatCount = Math.ceil((visibleCards + 1) / testimonials.length);
    repeatedTestimonials = Array(repeatCount)
      .fill(testimonials)
      .flat();
  }

  // Infinite auto transition
  useEffect(() => {
    if (repeatedTestimonials.length <= visibleCards) return;
    const interval = setInterval(() => {
      setCurrent(prev =>
        prev >= repeatedTestimonials.length - visibleCards ? 0 : prev + 1
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [repeatedTestimonials.length]);

  // Manual next/prev
  const handleNext = () => {
    setCurrent(prev =>
      prev >= repeatedTestimonials.length - visibleCards ? 0 : prev + 1
    );
  };
  const handlePrev = () => {
    setCurrent(prev =>
      prev <= 0 ? repeatedTestimonials.length - visibleCards : prev - 1
    );
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleSignup = () => {
    setLocation("/signup");
  };

  const handlePrevButton = () => {
    setCurrent(current > 0 ? current - 1 : 0);
  };

  const handleNextButton = () => {
    setCurrent(current < testimonials.length - visibleCards ? current + 1 : current);
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/feedback/feedbacks").then(res => {
      if (Array.isArray(res.data)) setTestimonials(res.data);
      else setTestimonials([]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">AutoMedix</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLogin} data-testid="button-login">
                Sign In
              </Button>
              <Button variant="outline" onClick={handleSignup} data-testid="button-signup">
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Healthcare at Your
                <span className="text-primary"> Fingertips</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with qualified doctors instantly. Book appointments, get consultations, 
                and manage your health records - all from the comfort of your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleLogin}
                  className="text-lg px-8 py-3"
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
            
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Video Consultation</h3>
                    <p className="text-gray-500">Available 24/7</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Instant appointments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Secure video calls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Digital prescriptions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed to make medical care accessible and convenient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Online Consultations</h3>
                <p className="text-gray-600">Connect with doctors via secure video calls</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Appointment Booking</h3>
                <p className="text-gray-600">Schedule appointments with your preferred doctors</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-purple-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Health Records</h3>
                <p className="text-gray-600">Secure digital storage of your medical history</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-orange-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600">HIPAA-compliant security for your privacy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with healthcare in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Account</h3>
              <p className="text-gray-600">
                Sign up and complete your profile with basic health information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Find a Doctor</h3>
              <p className="text-gray-600">
                Browse our network of qualified doctors by specialty and availability
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Care</h3>
              <p className="text-gray-600">
                Book appointments, have consultations, and receive digital prescriptions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Qualified Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Consultations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-primary-100">Patient Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from our patients and doctors
            </p>
          </div>
          <div className="relative w-full overflow-hidden group">
            <style>
              {`
                @keyframes testimonial-scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .testimonial-track {
                  animation: testimonial-scroll 30s linear infinite;
                }
                .testimonial-track.paused {
                  animation-play-state: paused;
                }
              `}
            </style>
            <div
              className="flex w-full"
              onMouseEnter={e => {
                (e.currentTarget.querySelector('.testimonial-track') as HTMLDivElement)?.classList.add('paused');
              }}
              onMouseLeave={e => {
                (e.currentTarget.querySelector('.testimonial-track') as HTMLDivElement)?.classList.remove('paused');
              }}
            >
              <div
                className="flex testimonial-track gap-8"
                style={{
                  width: `${testimonials.length * 2 * 350 + testimonials.length * 2 * 32}px`,
                }}
              >
                {[...testimonials, ...testimonials].map((fb, i) => (
                  <div
                    key={i}
                    className="relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center min-w-[350px] max-w-[350px] mx-auto border border-gray-100"
                    style={{
                      borderBottom: `16px solid #25d7eb`,
                      background: "#f9fafb",
                      marginTop: "60px",
                    }}
                  >
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-16 z-20 flex items-center justify-center overflow-hidden"
                      style={{
                        width: "100px",
                        height: "100px",
                        background: "#e3edfd",
                        borderRadius: "50%",
                        border: "4px solid #fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.08)"
                      }}
                    >
                      <img
                        src={fb.profileImageUrl || "/default-user.png"}
                        alt={fb.name}
                        style={{
                          width: "88px",
                          height: "88px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                    <div className="mb-4 mt-16">
                      {/* Symbol  */}
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                        <path d="M7 17a4 4 0 0 1 4-4h1V7a4 4 0 1 0-8 0v6a4 4 0 0 0 4 4zm10 0a4 4 0 0 1 4-4h-1V7a4 4 0 1 0-8 0v6a4 4 0 0 0 4 4z" fill="#25d7eb"/>
                      </svg>
                    </div>
                    <div className="font-bold text-xl text-gray-900 mb-1">{fb.name || "Anonymous"}</div>
                    <div className="text-sm" style={{ color: "#25d7eb" }}>{fb.role}</div>
                    <div className="flex justify-center mb-3">
                      {[...Array(fb.rating || 5)].map((_, idx) => (
                        <span key={idx} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-center italic mb-2">"{fb.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who trust AutoMedix for their healthcare needs. 
            Start your journey to better health today.
          </p>
          <Button 
            size="lg" 
            onClick={handleSignup}
            className="text-lg px-8 py-3 bg-primary hover:bg-primary-600"
            data-testid="button-join-now"
          >
            Join AutoMedix Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">AutoMedix</span>
              </div>
              <p className="text-gray-600">
                Making healthcare accessible and convenient for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Online Consultations</li>
                <li>Appointment Booking</li>
                <li>Health Records</li>
                <li>Prescriptions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 AutoMedix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
