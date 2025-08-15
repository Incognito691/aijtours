import jsPDF from "jspdf"

interface BookingData {
  bookingId: string
  customerName: string
  customerEmail: string
  packageName?: string
  eventName?: string
  destination?: string
  location?: string
  duration?: string
  date: string
  travelers: number
  totalAmount: number
  contactNumber: string
  specialRequests?: string
  type: "package" | "event"
}

export function generateInvoicePDF(booking: BookingData) {
  const doc = new jsPDF()

  // Colors as proper tuples
  const primaryColor: [number, number, number] = [59, 130, 246] // Blue
  const secondaryColor: [number, number, number] = [107, 114, 128] // Gray
  const accentColor: [number, number, number] = [239, 68, 68] // Red

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("AFI Travel and Tourism", 20, 25)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Travel & Tours", 20, 32)

  // Invoice Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("BOOKING INVOICE", 20, 55)

  // Invoice Details
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondaryColor)
  const currentDate = new Date().toLocaleDateString()
  doc.text(`Invoice Date: ${currentDate}`, 20, 65)
  doc.text(`Booking ID: ${booking.bookingId}`, 20, 72)

  // Customer Information
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("CUSTOMER INFORMATION", 20, 90)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondaryColor)
  doc.text(`Name: ${booking.customerName}`, 20, 100)
  doc.text(`Email: ${booking.customerEmail}`, 20, 107)
  doc.text(`Phone: ${booking.contactNumber}`, 20, 114)

  // Booking Details
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BOOKING DETAILS", 20, 135)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondaryColor)

  let yPos = 145
  if (booking.type === "package") {
    doc.text(`Package: ${booking.packageName}`, 20, yPos)
    yPos += 7
    doc.text(`Destination: ${booking.destination}`, 20, yPos)
    yPos += 7
    doc.text(`Duration: ${booking.duration}`, 20, yPos)
    yPos += 7
  } else {
    doc.text(`Event: ${booking.eventName}`, 20, yPos)
    yPos += 7
    doc.text(`Location: ${booking.location}`, 20, yPos)
    yPos += 7
  }

  doc.text(`Travel Date: ${new Date(booking.date).toLocaleDateString()}`, 20, yPos)
  yPos += 7
  doc.text(`Number of Travelers: ${booking.travelers}`, 20, yPos)
  yPos += 7

  if (booking.specialRequests) {
    doc.text(`Special Requests: ${booking.specialRequests}`, 20, yPos)
    yPos += 7
  }

  // Payment Summary
  yPos += 10
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 30, "F")
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("PAYMENT SUMMARY", 25, yPos + 10)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`${booking.travelers} × $${(booking.totalAmount / booking.travelers).toFixed(2)}`, 25, yPos + 20)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...accentColor)
  doc.text(`Total: $${booking.totalAmount.toFixed(2)}`, 25, yPos + 27)

  // Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondaryColor)
  doc.text("Thank you for choosing AFI Travel and Tourism! We look forward to serving you.", 20, 270)
  doc.text("For any queries, contact us at info@aijholidays.com or +1 (555) 123-4567", 20, 277)

  // Terms
  doc.text("Terms & Conditions apply. Please read our cancellation policy on our website.", 20, 287)

  return doc
}
