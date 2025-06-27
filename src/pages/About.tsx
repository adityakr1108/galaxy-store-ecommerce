
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Zap, Shield, Users, Award, Rocket } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '50K+' },
    { icon: Star, label: 'Products Sold', value: '100K+' },
    { icon: Award, label: 'Years Experience', value: '10+' },
    { icon: Rocket, label: 'Countries Served', value: '25+' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Delivery',
      description: 'Experience cosmic speed with our premium delivery service across the galaxy.'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your data and transactions are protected by galactic-level security protocols.'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only the finest cosmic technology makes it to our stellar collection.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          About <span className="text-gradient">Galaxy Store</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Welcome to Galaxy Store, where premium cosmic technology meets exceptional shopping experience. 
          We're not just a store – we're your gateway to the universe of cutting-edge innovation.
        </p>
      </section>

      {/* Story Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Cosmic Journey</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Founded in the depths of space exploration, Galaxy Store emerged from a simple vision: 
                to bring the most advanced technology from across the cosmos to passionate enthusiasts 
                and professionals alike.
              </p>
              <p>
                What started as a small collection of premium gaming peripherals has evolved into 
                a comprehensive marketplace featuring everything from cutting-edge smartphones to 
                professional-grade audio equipment.
              </p>
              <p>
                Today, we serve over 50,000 satisfied customers across 25 countries, with our 
                premium membership program offering exclusive access to the latest innovations 
                before they reach the general market.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80"
                alt="Galaxy Store Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-galaxy-gradient rounded-full animate-float opacity-20"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="galaxy-card text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-galaxy-gold mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose <span className="text-gradient">Galaxy Store</span>?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're committed to providing an exceptional shopping experience with premium products 
            and stellar customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="galaxy-card text-center hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <feature.icon className="w-12 h-12 text-galaxy-gold mx-auto mb-6 animate-float" />
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="galaxy-card">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize access to premium technology by curating the finest products from across 
              the galaxy and delivering them with exceptional service, competitive pricing, and the 
              innovation that drives human progress forward.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-16 h-1 bg-galaxy-gradient rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Values Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Innovation First',
              description: 'We constantly seek out the latest and most advanced technology to bring to our customers.'
            },
            {
              title: 'Quality Assurance',
              description: 'Every product undergoes rigorous testing to ensure it meets our premium standards.'
            },
            {
              title: 'Customer Obsession',
              description: 'Your satisfaction is our top priority, from browsing to delivery and beyond.'
            },
            {
              title: 'Transparency',
              description: 'We believe in honest communication and clear information about our products and services.'
            },
            {
              title: 'Sustainability',
              description: 'We are committed to environmentally responsible practices in all our operations.'
            },
            {
              title: 'Community',
              description: 'Building lasting relationships with our customers and contributing to the tech community.'
            }
          ].map((value, index) => (
            <Card key={index} className="galaxy-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
