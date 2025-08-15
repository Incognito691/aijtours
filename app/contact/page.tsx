"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "emailjs-com";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@aijholidays.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Call us during business hours",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Travel Street, City, State 12345",
      description: "Visit our office",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "afitravelandtourism.sales@gmail.com",
          to_name: "AFI Travel and tourism Team",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-teal-400 to-purple-500 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-white px-6"
        >
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Contact AFI Travel and tourism
          </h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            Our travel experts are here to answer your questions and help plan
            your perfect adventure.
          </p>
        </motion.div>

        {/* Floating icons */}
        <motion.div
          className="absolute top-10 left-10 text-white opacity-30"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          ✈️
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 text-white opacity-30"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        >
          🧭
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white opacity-30"
          animate={{ y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          🗺️
        </motion.div>
      </section>

      {/* Contact Form & Info */}
      <section className="mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 flex-1 flex flex-col">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll respond within 24 hours.
              </p>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="rounded-lg border-gray-300 shadow-sm"
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg border-gray-300 shadow-sm"
                  />
                </div>
                <Input
                  placeholder="Subject *"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-gray-300 shadow-sm"
                />
                <Textarea
                  placeholder="Message *"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="rounded-lg border-gray-300 shadow-sm flex-1"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 text-white shadow-lg mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              Have questions or need help planning? Reach out to us anytime.
            </p>

            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-4 bg-white rounded-2xl shadow-lg border border-gray-200 hover:scale-105 transform transition-transform duration-300"
              >
                <div className="bg-gradient-to-tr from-blue-500 to-teal-400 p-3 rounded-full mr-4 text-white">
                  <info.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{info.title}</h3>
                  <p className="text-gray-800 font-medium">{info.details}</p>
                  <p className="text-gray-500 text-sm">{info.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Location
          </h2>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d85.1234567!3d27.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1234567890ab%3A0xabcdef1234567890!2sAIJ%20Holidays!5e0!3m2!1sen!2snp!4v1234567890123!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I book a package?",
                answer: "Browse packages, select one, and click 'Book Now'.",
              },
              {
                question: "What's included in the package price?",
                answer: "Accommodation, meals, guided tours, etc.",
              },
              {
                question: "Can I customize my trip?",
                answer: "Yes! Contact us to discuss customization options.",
              },
              {
                question: "What's your cancellation policy?",
                answer: "Policies vary per package, check during booking.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
