"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import emailjs from "emailjs-com";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Globe,
  LucideIcon,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  interface ContactInfo {
    icon: LucideIcon;
    title: string;
    details: string;
    subDetails?: string;
    description: string;
    gradient: string;
  }

  const contactInfo: ContactInfo[] = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: "C101, 1st Floor - Al Bateen Tower",
      subDetails: "(Abu Dhabi Islamic Bank)",
      description: "Abu Dhabi, United Arab Emirates",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+971564995248",
      description: "Available during business hours",
      gradient: "from-blue-500 to-sky-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "sales@afitravelandtourism.com",
      description: "We'll respond within 24 hours",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // ✅ Store in DB via API
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Show success message
      toast({
        title: "✅ Message Sent",
        description: "Thank you! We'll reply within 24 hours.",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "❌ Failed to send",
        description:
          "Please check your internet connection or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[url('/images/contact-hero.png')] bg-cover bg-center py-32">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white px-6 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Get in Touch with Us
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Have questions about our travel packages or need help planning your
            perfect trip? We're here to assist you every step of the way.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <Clock className="h-5 w-5 text-sky-300" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <Globe className="h-5 w-5 text-emerald-300" />
              <span className="text-sm">Worldwide Travel</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Contact Cards */}
      <section className="relative z-10 -mt-16 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-black/5 dark:ring-white/10 h-full">
                  <CardContent className="p-6 flex flex-col min-h-[200px]">
                    <div
                      className={`bg-gradient-to-r ${info.gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg flex-shrink-0`}
                    >
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {info.details}
                      </p>
                      {info.subDetails && (
                        <p className="text-gray-900 dark:text-gray-100 font-medium">
                          {info.subDetails}
                        </p>
                      )}
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-auto pt-4">
                        {info.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-black/5 dark:ring-white/10 h-full">
                <CardContent className="p-8">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Input
                            placeholder="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="h-11 bg-gray-50 dark:bg-gray-800/50"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Your Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-11 bg-gray-50 dark:bg-gray-800/50"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div>
                        <Input
                          placeholder="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="h-11 bg-gray-50 dark:bg-gray-800/50"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="Your Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="min-h-[180px] bg-gray-50 dark:bg-gray-800/50 resize-none"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white shadow-lg font-medium rounded-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Card className="overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-gray-800 h-full">
                <CardContent className="p-0">
                  <div className="aspect-square w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.8398719280376!2d54.338590499999995!3d24.4563403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e65bcf909ac9b%3A0x77a580562978d0a4!2sAFI%20Travel%20and%20Tourism%20-%20AFI%20Holidays!5e0!3m2!1sen!2snp!4v1755723764086!5m2!1sen!2snp"
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
