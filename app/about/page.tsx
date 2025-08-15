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
      value: "10,000+",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Globe,
      label: "Amazing Destinations",
      value: "50+",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Award,
      label: "Years of Excellence",
      value: "15+",
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
      image: "/placeholder.svg?height=400&width=400&text=Sarah+Johnson",
      description:
        "Visionary leader with 15+ years in the travel industry, passionate about creating life-changing experiences.",
      specialty: "Luxury Travel & Adventure Tours",
      social: { linkedin: "#", twitter: "#" },
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
      name: "Emily Rodriguez",
      role: "Travel Experience Designer",
      image: "/placeholder.svg?height=400&width=400&text=Emily+Rodriguez",
      description:
        "Creative curator crafting unique experiences that connect travelers with local cultures and hidden gems.",
      specialty: "Cultural Immersion & Custom Itineraries",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const milestones = [
    {
      year: "2008",
      title: "The Beginning",
      description:
        "AFI Travel and tourism founded with a dream to make travel accessible to everyone",
      icon: Compass,
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
    {
      year: "2012",
      title: "First 1000 Customers",
      description:
        "Celebrated our first milestone of serving 1000 happy travelers",
      icon: Users,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      year: "2016",
      title: "Global Expansion",
      description: "Expanded to 25+ destinations across 4 continents",
      icon: Globe,
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description: "Launched virtual tours and contactless travel experiences",
      icon: Camera,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      year: "2024",
      title: "Sustainable Future",
      description:
        "Leading eco-friendly travel initiatives and carbon-neutral packages",
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

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section with Floating Elements */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-400/30 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="backdrop-blur-sm bg-white/5 rounded-[3rem] p-12 border border-white/10 shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-4 bg-white/10 rounded-full px-6 py-3 mb-8">
                <Plane className="h-6 w-6 text-cyan-400" />
                <span className="text-lg font-medium">Est. 2024</span>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              We Are
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                AFI Travel and Tourism
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Crafting extraordinary journeys and turning travel dreams into
              unforgettable realities since 2024
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <div className="flex items-center space-x-8 text-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm">Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm">Destinations</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
                  className="w-full h-96 object-cover"
                  src="/placeholder.svg?height=400&width=600&text=AIJ+Holidays+Story"
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
                    <span>Inspiring journeys since 2008</span>
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
              Meet Our Travel Experts
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
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50">
                  <div className="relative">
                    <div className="relative w-full h-96 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                        {member.specialty}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4 text-lg">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {member.description}
                    </p>
                    <div className="flex space-x-4">
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
              <Button
                size="lg"
                className="group bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Plane className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Plan Your Journey
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-white/40 text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Camera className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                View Destinations
              </Button>
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
