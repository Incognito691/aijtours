"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Award,
  Globe,
  Heart,
  Calendar,
  Star,
  Compass,
  Camera,
  Plane,
  Target,
  Eye,
  ChevronRight,
  Quote,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stats = [
    {
      icon: Users,
      label: "Happy Travelers",
      value: "100+",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Globe,
      label: "Amazing Destinations",
      value: "20+",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Award,
      label: "Years of Excellence",
      value: "1+",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Heart,
      label: "Satisfaction Rate",
      value: "99%",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
  ];

  const team = [
    {
      name: "Noa Gabayan",
      role: "Administrative",
      image: "/images/noa.jpg",
      description:
        "Visionary leader with 5+ years in the travel industry, passionate about creating life-changing experiences.",
      specialty: "Luxury Travel & Adventure Tours",
      social: {
        linkedin:
          "https://www.linkedin.com/in/noa-gabayan-37951a369?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app ",
        twitter: "#",
      },
    },
    {
      name: "Divyam Thakur",
      role: "Head of Operations",
      image: "/images/divyam.jpg",
      description:
        "Operations mastermind ensuring every journey is seamless and memorable from start to finish.",
      specialty: "Logistics & Customer Experience",
      social: {
        linkedin:
          "https://www.linkedin.com/in/divyam-prakash-thakur-424a6b330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app ",
        twitter: "#",
      },
    },
    {
      name: "Almir Huko ",
      role: "Travel Experience Designer",
      image: "/images/almir.jpg",
      description:
        "Creative curator crafting unique experiences that connect travelers with local cultures and hidden gems.",
      specialty: "Cultural Immersion & Custom Itineraries",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Beginning",
      description:
        "AFI Travel & Tourism was established with a vision to bring unique travel experiences to customers.",
      icon: Compass,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
    {
      year: "Mid-2024",
      title: "First International Tour",
      description:
        "Launched our Bosnia Tour Package, marking our first step into international travel services.",
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      year: "Mid-2025",
      title: "Growing Success",
      description:
        "Successfully operated multiple Bosnia tour groups, creating memorable journeys for our travelers.",
      icon: Globe,
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    {
      year: "2025",
      title: "Serving 100+ Happy Customers",
      description:
        "Reached our first milestone of delighting 100+ travelers through our Bosnia tour packages.",
      icon: Camera,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      year: " June 2025",
      title: "Becoming a Full-Fledged Travel Agency",
      description:
        "Expanded our services beyond Bosnia, establishing ourselves as a complete travel and tourism company.",
      icon: Heart,
      color: "bg-gradient-to-br from-teal-500 to-green-600",
    },
  ];

  const values = [
    {
      title: "Adventure First",
      description:
        "We believe every journey should be an adventure that pushes boundaries and creates stories.",
      icon: "🗻",
      bgColor: "bg-gradient-to-br from-orange-100 to-red-100",
    },
    {
      title: "Cultural Connection",
      description:
        "Authentic experiences that connect you with local cultures and communities.",
      icon: "🌍",
      bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100",
    },
    {
      title: "Sustainable Travel",
      description:
        "Responsible tourism that protects destinations for future generations.",
      icon: "🌱",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
    },
    {
      title: "Personal Touch",
      description:
        "Every trip is crafted with personal attention and care for your unique preferences.",
      icon: "💫",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section with Interactive Elements */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        {/* Enhanced Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
          {/* More Animated Circles for depth */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-cyan-500/8 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-indigo-500/8 rounded-full blur-2xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 left-1/6 w-32 h-32 bg-pink-500/8 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm border border-white/20">
                <Compass className="h-6 w-6 text-cyan-400 mr-3" />
                <span className="text-lg font-medium text-white">
                  Established 2024
                </span>
                <Star className="h-6 w-6 text-yellow-400 ml-3" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-bold mb-8"
            >
              <span className="text-white">Discover the World with</span>
              <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                AFI Travel
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-blue-100 mb-16 leading-relaxed"
            >
              Where every journey becomes a story, and every destination opens
              new horizons. Join us in creating memories that last a lifetime.
            </motion.p>

            {/* Enhanced Interactive Travel Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              {/* Enhanced Animated Travel Icons with More Variety */}
              <div className="relative h-40 mb-8 overflow-hidden">
                {[
                  // Original icons
                  {
                    icon: "✈️",
                    delay: 0,
                    x: "10%",
                    y: "20%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🏔️",
                    delay: 1,
                    x: "25%",
                    y: "60%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🏝️",
                    delay: 2,
                    x: "45%",
                    y: "30%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🗼",
                    delay: 0.5,
                    x: "65%",
                    y: "70%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🚢",
                    delay: 1.5,
                    x: "80%",
                    y: "40%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🎒",
                    delay: 2.5,
                    x: "35%",
                    y: "10%",
                    size: "text-4xl",
                  },
                  {
                    icon: "📸",
                    delay: 3,
                    x: "70%",
                    y: "15%",
                    size: "text-4xl",
                  },
                  {
                    icon: "🌍",
                    delay: 0.8,
                    x: "15%",
                    y: "75%",
                    size: "text-4xl",
                  },

                  // New additional icons for more richness
                  {
                    icon: "🚁",
                    delay: 1.2,
                    x: "5%",
                    y: "45%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🏖️",
                    delay: 2.8,
                    x: "55%",
                    y: "85%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎡",
                    delay: 1.8,
                    x: "90%",
                    y: "20%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🚂",
                    delay: 3.2,
                    x: "20%",
                    y: "35%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🏰",
                    delay: 0.3,
                    x: "85%",
                    y: "65%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎭",
                    delay: 2.2,
                    x: "40%",
                    y: "80%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🍜",
                    delay: 1.7,
                    x: "75%",
                    y: "50%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎪",
                    delay: 3.5,
                    x: "12%",
                    y: "15%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🚠",
                    delay: 0.7,
                    x: "60%",
                    y: "5%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🏛️",
                    delay: 2.1,
                    x: "30%",
                    y: "55%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎨",
                    delay: 1.4,
                    x: "8%",
                    y: "65%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🌺",
                    delay: 2.7,
                    x: "88%",
                    y: "35%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🚤",
                    delay: 0.9,
                    x: "50%",
                    y: "65%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎷",
                    delay: 3.1,
                    x: "22%",
                    y: "90%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🗺️",
                    delay: 1.6,
                    x: "78%",
                    y: "8%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🦋",
                    delay: 2.4,
                    x: "42%",
                    y: "48%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎋",
                    delay: 0.4,
                    x: "95%",
                    y: "75%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🌸",
                    delay: 1.9,
                    x: "38%",
                    y: "22%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🎯",
                    delay: 2.9,
                    x: "68%",
                    y: "88%",
                    size: "text-3xl",
                  },
                  {
                    icon: "🚡",
                    delay: 0.6,
                    x: "18%",
                    y: "52%",
                    size: "text-3xl",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                      opacity: [0, 1, 0.8, 1],
                      scale: [0, 1.2, 0.9, 1],
                      rotate: 0,
                      y: [0, -10, 0],
                    }}
                    transition={{
                      delay: item.delay,
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 5,
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }}
                    className={`absolute ${item.size} cursor-pointer hover:scale-125 transition-transform duration-300`}
                    style={{
                      left: item.x,
                      top: item.y,
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: 360,
                      transition: { duration: 0.3 },
                    }}
                  >
                    {item.icon}
                  </motion.div>
                ))}

                {/* Floating particles for extra magic */}
                {[...Array(12)].map((_, i) => {
                  // Use deterministic values based on index to avoid hydration issues
                  const positions = [
                    { left: "15%", top: "20%", moveX: 80, moveY: -60 },
                    { left: "85%", top: "30%", moveX: -70, moveY: 90 },
                    { left: "25%", top: "70%", moveX: 120, moveY: -40 },
                    { left: "70%", top: "15%", moveX: -90, moveY: 110 },
                    { left: "45%", top: "85%", moveX: 60, moveY: -80 },
                    { left: "10%", top: "50%", moveX: 140, moveY: 30 },
                    { left: "90%", top: "60%", moveX: -110, moveY: -70 },
                    { left: "35%", top: "25%", moveX: 90, moveY: 100 },
                    { left: "65%", top: "75%", moveX: -60, moveY: -90 },
                    { left: "20%", top: "40%", moveX: 100, moveY: 50 },
                    { left: "80%", top: "80%", moveX: -80, moveY: -60 },
                    { left: "50%", top: "10%", moveX: 70, moveY: 120 },
                  ];
                  const pos = positions[i];

                  return (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 bg-white/40 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: [0, pos.moveX],
                        y: [0, pos.moveY],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut",
                      }}
                      style={{
                        left: pos.left,
                        top: pos.top,
                      }}
                    />
                  );
                })}
              </div>

              {/* Interactive Action Buttons with Hover Effects */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every number tells a story of trust, adventure, and dreams
              fulfilled
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <Card
                  className={`text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${stat.bgColor} overflow-hidden relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story with Video */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <span className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Quote className="h-4 w-4 mr-2" />
                  Our Story
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  From Dream to
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {" "}
                    Reality
                  </span>
                </h2>
              </div>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At AFI Travel & Tourism, we believe that travel is more than
                  just moving from one place to another —it’s about creating
                  moments, stories, and connections that last a lifetime.
                </p>
                <p>
                  "Empowered by the strength and legacy of Al Falah Group — a
                  renowned leader inreal estate, hospitality, healthcare,
                  sports, petrochemicals, and shipping —we standas a dynamic,
                  competitive, and trusted name in the global travel
                </p>
                <p>
                  Our team of passionate travel experts is dedicated to turning
                  your travel dreams into reality. Whether you’re planning a
                  relaxing beach escape, a thrilling adventure, a cultural
                  exploration, or a seamless business trip, we handle every
                  detail so you can focus on enjoying the experience.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <Link href={"/contact"}>
                  <Button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                    <Calendar className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Start Your Journey
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  className="w-full h-full object-cover"
                  src="/images/logo.jpg"
                  alt="Story"
                />
                {/* <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div> */}
                {/* <button
                  onClick={toggleVideo}
                  className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:bg-white transition-colors duration-300">
                    {isVideoPlaying ? (
                      <Pause className="h-8 w-8 text-gray-900" />
                    ) : (
                      <Play className="h-8 w-8 text-gray-900 ml-1" />
                    )}
                  </div>
                </button> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white">
                      <Target className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      Our Mission
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To create extraordinary travel experiences that inspire,
                    educate, and transform lives. We make travel accessible and
                    unforgettable while promoting sustainable tourism that
                    preserves the beauty of our destinations for future
                    generations.
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                    <span>Inspiring journeys since 2019</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl text-white">
                      <Eye className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      Our Vision
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To be the world's most trusted travel partner, connecting
                    people with cultures and experiences that broaden
                    perspectives. We envision a world where travel creates
                    understanding, builds bridges between communities, and
                    fosters global harmony.
                  </p>
                  <div className="mt-6 flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors duration-300">
                    <span>Building connections worldwide</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape every
              experience we create
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <Card
                  className={`text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${value.bgColor} h-full overflow-hidden relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="pt-8 pb-8 relative z-10">
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Journey Through Time
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that shaped us into the travel company we are today
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-green-400 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } flex-col`}
                >
                  <div
                    className={`lg:w-5/12 ${
                      index % 2 === 0
                        ? "lg:text-right lg:pr-8"
                        : "lg:text-left lg:pl-8"
                    } mb-8 lg:mb-0`}
                  >
                    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-105">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <div
                            className={`p-3 rounded-xl text-white ${milestone.color}`}
                          >
                            <milestone.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              {milestone.year}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                              {milestone.title}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative lg:w-2/12 flex justify-center mb-8 lg:mb-0">
                    <div
                      className={`w-4 h-4 rounded-full ${milestone.color} shadow-lg ring-4 ring-white`}
                    ></div>
                  </div>

                  <div className="lg:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate team behind your unforgettable adventures
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white hover:border-blue-200 relative">
                  {/* Profile Image */}
                  <div className="flex justify-center mt-8">
                    <div className="relative w-44 h-44 rounded-full overflow-hidden ring-4 ring-indigo-100 group-hover:ring-blue-200 transition-all duration-300">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  <CardContent className="p-8 text-center">
                    {/* Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mt-6 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>

                    {/* Role */}
                    <p className="text-blue-600 font-medium mb-4">
                      {member.role}
                    </p>

                    {/* Specialty Badge */}
                    <div className="inline-block mb-4">
                      <span className="text-xs font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {member.specialty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {member.description}
                    </p>

                    {/* Connect Button */}
                    <div className="flex justify-center">
                      <Link href={member.social.linkedin} target="_blank">
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors duration-300"
                        >
                          Connect
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden rounded-t-[3rem]">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200&text=Travel+Pattern')] opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/5 rounded-3xl p-12 border border-white/10"
          >
            <div className="mb-8">
              <div className="inline-flex items-center space-x-4 bg-white/10 rounded-full px-6 py-3 mb-6">
                <Compass className="h-6 w-6 text-cyan-400" />
                <span className="text-lg font-medium">Ready to Explore?</span>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Next Adventure
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Starts Here
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Join thousands of happy travelers who have discovered the world
              with AFI Travel and tourism. Let us craft your perfect journey
              today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Plan Your Journey
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/destinations">
                <Button
                  size="lg"
                  variant="outline"
                  className="group border-2 border-white/40 text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Camera className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  View Destinations
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex justify-center items-center space-x-12 text-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">99%</div>
                <div className="text-sm">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">15+</div>
                <div className="text-sm">Years Trust</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
