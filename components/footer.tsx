import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Plane,
  Compass,
  Globe2,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/images/world-map.png')] opacity-[0.08] dark:opacity-[0.15] bg-no-repeat bg-center bg-cover mix-blend-multiply dark:mix-blend-soft-light" />
      {/* Wave Pattern */}
      <div className="absolute top-0 inset-x-0">
        {/* <div className="h-12 bg-[url('/images/wave-pattern.svg')] bg-repeat-x bg-blue-500/10 dark:bg-blue-400/10" /> */}
      </div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-950" />{" "}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo + About */}
          <div className="col-span-1 lg:col-span-5">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/30 to-sky-400/30 rounded-xl blur-xl animate-pulse" />
                <img
                  src="/images/logo.jpg"
                  alt="AFI Travel and Tourism"
                  className="relative h-14 w-auto object-contain rounded-xl shadow-lg bg-white"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
                  AFI Travel and Tourism
                </h2>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
              Discover the world with AFI Travel and Tourism. We create
              unforgettable travel experiences with carefully curated packages
              and exceptional service.
            </p>

            <div className="space-y-6">
              {/* Social Links */}
              <div className="flex items-center space-x-5">
                <a
                  href="https://www.facebook.com/afiholidays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Follow us on Facebook"
                >
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Facebook className="relative h-6 w-6 text-blue-500 hover:text-blue-600 transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/afitravelandtourism/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Follow us on Instagram"
                >
                  <div className="absolute -inset-2 bg-pink-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Instagram className="relative h-6 w-6 text-pink-500 hover:text-pink-600 transition-colors" />
                </a>
                <a
                  href="https://www.tiktok.com/@afiholidays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Follow us on TikTok"
                >
                  <div className="absolute -inset-2 bg-gray-900/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="relative h-6 w-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z" />
                  </svg>
                </a>
                <a
                  href="https://www.threads.com/@afitravelandtourism"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label="Follow us on Threads"
                >
                  <div className="absolute -inset-2 bg-gray-900/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src="/images/threads.png"
                    alt="Threads"
                    width={24}
                    height={24}
                    className="relative h-6 w-6 rounded-full"
                  />
                </a>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    Accepted Payment Methods
                  </span>
                </div>
                <div className="dark:bg-gray-900/80 rounded-xl">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                      <Image
                        src="/images/visa.svg"
                        alt="Visa"
                        width={100}
                        height={50}
                        className="h-10 w-auto dark:invert"
                      />
                    </div>
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                      <Image
                        src="/images/masterCard.svg"
                        alt="Mastercard"
                        width={100}
                        height={50}
                        className="h-10 w-auto"
                      />
                    </div>
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                      <Image
                        src="/images/tabbytamara.png"
                        alt="Tabby Tamara"
                        width={140}
                        height={50}
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                      <Image
                        src="/images/applePay.svg"
                        alt="Apple Pay"
                        width={100}
                        height={50}
                        className="h-10 w-auto dark:invert"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Compass className="h-5 w-5 mr-2 text-blue-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/destinations"
                  className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Globe2 className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  Destinations
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Plane className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  Packages
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Globe2 className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  UAE Activities
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Globe2 className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  About Us
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Globe2 className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  Contact
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 lg:col-span-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-2xl blur-xl" />
              <div className="relative">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-500" />
                  Get in Touch
                </h3>
                <ul className="space-y-6">
                  <li className="group">
                    <div className="relative bg-white/50 dark:bg-gray-900/50 rounded-xl p-4 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-start space-x-3">
                        <div className="relative mt-1">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-sky-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Mail className="relative h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            Email Us
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            sales@afitravelandtourism.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="group">
                    <div className="relative bg-white/50 dark:bg-gray-900/50 rounded-xl p-4 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-start space-x-3">
                        <div className="relative mt-1">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-sky-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Phone className="relative h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            Call Us
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            +971564995248
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="group">
                    <div className="relative bg-white/50 dark:bg-gray-900/50 rounded-xl p-4 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-start space-x-3">
                        <div className="relative mt-1">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-sky-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                          <MapPin className="relative h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">
                            Visit Us
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            C101, 1st Floor - Al Bateen Tower (Abu Dhabi Islamic
                            Bank)
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-16 pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
          <p className="relative text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} AFI Travel and Tourism. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
