
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send, Star, MessageCircle, Headphones } from 'lucide-react';

const Contact: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully! 🚀",
        description: "We'll get back to you within 24 hours. Thank you for contacting Galaxy Store!",
      });
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@galaxystore.com',
      description: 'Get help via email',
      badge: '24/7 Support'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (555) 123-GALAXY',
      description: 'Speak with our team',
      badge: 'Premium Only'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Available Now',
      description: 'Instant messaging support',
      badge: 'Online'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      value: 'tech@galaxystore.com',
      description: 'Product & technical issues',
      badge: 'Expert Help'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM EST' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM EST' },
    { day: 'Sunday', hours: '12:00 PM - 5:00 PM EST' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Contact <span className="text-gradient">Galaxy Store</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Need help with your cosmic shopping experience? Our stellar support team is here to assist you 
          across the galaxy.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="cosmic-input mt-2"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="cosmic-input mt-2"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What can we help you with?"
                    className="cosmic-input mt-2"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="cosmic-input w-full h-32 mt-2 resize-none"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-lg py-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Contact Methods */}
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-galaxy-purple/10 hover:bg-galaxy-purple/20 transition-colors">
                  <method.icon className="w-6 h-6 text-galaxy-gold flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{method.title}</h4>
                      <Badge variant="outline" className="bg-galaxy-gold/20 text-galaxy-gold border-galaxy-gold/30 text-xs">
                        {method.badge}
                      </Badge>
                    </div>
                    <p className="text-galaxy-gold text-sm font-medium">{method.value}</p>
                    <p className="text-gray-400 text-xs">{method.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {officeHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-galaxy-purple-light/20 last:border-b-0">
                  <span className="text-gray-400">{schedule.day}</span>
                  <span className="text-white font-medium">{schedule.hours}</span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-lg bg-galaxy-gold/10 border border-galaxy-gold/20">
                <div className="flex items-center space-x-2 text-galaxy-gold text-sm">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">Premium Support</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Premium members get priority support and extended hours
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="galaxy-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Our Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-300">
                <p className="font-medium text-white">Galaxy Store Headquarters</p>
                <p>123 Cosmic Avenue</p>
                <p>Space District, Universe 12345</p>
                <p>Milky Way Galaxy</p>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-galaxy-purple/10">
                <p className="text-xs text-gray-400">
                  🚀 We operate across multiple galaxies with local distribution centers 
                  for faster delivery to your cosmic location.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <Card className="galaxy-card">
            <CardContent className="p-6 text-center">
              <h4 className="text-white font-semibold mb-2">Need Quick Answers?</h4>
              <p className="text-gray-400 text-sm mb-4">
                Check out our comprehensive FAQ section for instant solutions.
              </p>
              <Button className="btn-secondary w-full">
                Browse FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Help Section */}
      <section className="mt-16">
        <Card className="galaxy-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              For urgent matters or technical emergencies, our premium support team is available 24/7. 
              Premium members get priority handling and direct access to our senior support specialists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">
                <Phone className="w-4 h-4 mr-2" />
                Call Premium Support
              </Button>
              <Button className="btn-secondary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Contact;
