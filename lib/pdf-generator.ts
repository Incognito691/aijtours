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

  // Colors
  const primary: [number, number, number] = [59, 130, 246] // Blue
  const secondary: [number, number, number] = [107, 114, 128] // Gray
  const accent: [number, number, number] = [239, 68, 68] // Red
  const lightBg: [number, number, number] = [248, 250, 252] // Light grayish

  // --- HEADER ---
  doc.setFillColor(...primary)
  doc.rect(0, 0, 210, 40, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text("AFI Travel and Tourism", 20, 20)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("Travel & Tours", 20, 30)

  // --- TITLE ---
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BOOKING INVOICE", 20, 55)

  // Invoice Metadata
  doc.setFontSize(10)
  doc.setTextColor(...secondary)
  const currentDate = new Date().toLocaleDateString()
  doc.text(`Invoice Date: ${currentDate}`, 150, 20)
  doc.text(`Booking ID: ${booking.bookingId}`, 150, 28)

  // --- CUSTOMER INFO BOX ---
  doc.setFillColor(...lightBg)
  doc.rect(20, 70, 170, 35, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Customer Information", 25, 80)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...secondary)
  doc.text(`Name: ${booking.customerName}`, 25, 90)
  doc.text(`Email: ${booking.customerEmail}`, 25, 97)
  doc.text(`Phone: ${booking.contactNumber}`, 25, 104)

  // --- BOOKING DETAILS BOX ---
  let y = 120
  doc.setFillColor(...lightBg)
  doc.rect(20, y, 170, 50, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Booking Details", 25, y + 10)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...secondary)

  let dy = y + 20
  if (booking.type === "package") {
    doc.text(`Package: ${booking.packageName}`, 25, dy); dy += 7
    doc.text(`Destination: ${booking.destination}`, 25, dy); dy += 7
    doc.text(`Duration: ${booking.duration}`, 25, dy); dy += 7
  } else {
    doc.text(`Event: ${booking.eventName}`, 25, dy); dy += 7
    doc.text(`Location: ${booking.location}`, 25, dy); dy += 7
  }
  doc.text(`Travel Date: ${new Date(booking.date).toLocaleDateString()}`, 25, dy); dy += 7
  doc.text(`Number of Travelers: ${booking.travelers}`, 25, dy); dy += 7
  if (booking.specialRequests) {
    doc.text(`Special Requests: ${booking.specialRequests}`, 25, dy)
  }

  // --- PAYMENT SUMMARY BOX ---
  const py = 190
  doc.setFillColor(...lightBg)
  doc.rect(20, py, 170, 35, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Payment Summary", 25, py + 10)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...secondary)
  doc.text(`${booking.travelers} × $${(booking.totalAmount / booking.travelers).toFixed(2)}`, 25, py + 20)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(...accent)
  doc.text(`Total: $${booking.totalAmount.toFixed(2)}`, 25, py + 28)

  // --- FOOTER ---
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondary)
  doc.text("Thank you for choosing AFI Travel and Tourism.", 20, 270)
  doc.text("For support: info@aijholidays.com | +1 (555) 123-4567", 20, 276)
  doc.text("Terms & Conditions apply. Please read our cancellation policy on our website.", 20, 284)

  return doc
}
