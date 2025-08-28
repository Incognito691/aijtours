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

// Function to convert image to base64
async function getLogoBase64(): Promise<string> {
  try {
    const response = await fetch('/images/logo.jpg')
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading logo:', error)
    return ''
  }
}

export async function generateInvoicePDF(booking: BookingData) {
  const doc = new jsPDF()

  // Enhanced color palette
  const brandBlue: [number, number, number] = [8, 145, 178] // Professional blue
  const accentGold: [number, number, number] = [255, 193, 7] // Gold accent
  const darkGray: [number, number, number] = [33, 37, 41] // Professional dark
  const lightGray: [number, number, number] = [248, 249, 250] // Light background
  const textDark: [number, number, number] = [52, 58, 64] // Readable text
  const success: [number, number, number] = [40, 167, 69] // Success green

  // Get logo
  const logoBase64 = await getLogoBase64()

  // --- CLEAN HEADER SECTION ---
  // Header background
  doc.setFillColor(...brandBlue)
  doc.rect(0, 0, 210, 40, "F")
  
  // Circular logo (if available)
  if (logoBase64) {
    try {
      // Add logo in a circular frame
      const logoX = 15
      const logoY = 6
      const logoSize = 28
      
      // Add white circular background
      doc.setFillColor(255, 255, 255)
      doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 'F')
      
      // Add logo image
      doc.addImage(logoBase64, 'JPEG', logoX + 2, logoY + 2, logoSize - 4, logoSize - 4)
      
      // Add circular border
      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(2)
      doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 'S')
      
    } catch (error) {
      console.error('Error adding logo to PDF:', error)
    }
  }
  
  // Company branding - aligned with logo
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text("AFI TRAVEL AND TOURISM", 50, 18)
  
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.text("Your Gateway to Extraordinary Adventures", 50, 24)
  
  // Dynamic invoice title based on type
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...accentGold)
  const invoiceTitle = booking.type === 'package' ? 'TRAVEL PACKAGE INVOICE' : 'EVENT INVOICE'
  doc.text(invoiceTitle, 50, 32)

  // --- CUSTOMER INFORMATION SECTION ---
  let yPos = 48
  doc.setFillColor(...darkGray)
  doc.rect(15, yPos, 180, 8, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("CUSTOMER INFORMATION", 20, yPos + 5.5)

  yPos += 12
  doc.setFillColor(...lightGray)
  doc.rect(15, yPos, 180, 20, "F")
  
  doc.setTextColor(...textDark)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Full Name: ${booking.customerName}`, 20, yPos + 6)
  doc.text(`Email Address: ${booking.customerEmail}`, 20, yPos + 12)
  doc.text(`Contact Number: ${booking.contactNumber}`, 20, yPos + 18)

  // --- BOOKING DETAILS SECTION ---
  yPos += 25
  doc.setFillColor(...brandBlue)
  doc.rect(15, yPos, 180, 8, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text(booking.type === "package" ? "TRAVEL PACKAGE DETAILS" : "ACTIVITY DETAILS", 20, yPos + 5.5)

  yPos += 12
  doc.setFillColor(...lightGray)
  doc.rect(15, yPos, 180, booking.type === "package" ? 28 : 22, "F")
  
  doc.setTextColor(...textDark)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)

  if (booking.type === "package") {
    doc.text(`Package Name: ${booking.packageName}`, 20, yPos + 6)
    doc.text(`Destination: ${booking.destination}`, 20, yPos + 12)
    doc.text(`Duration: ${booking.duration}`, 20, yPos + 18)
    doc.text(`Travel Date: ${new Date(booking.date).toLocaleDateString('en-GB')}`, 20, yPos + 24)
    yPos += 32
  } else {
    doc.text(`Activity Name: ${booking.eventName}`, 20, yPos + 6)
    doc.text(`Location: ${booking.location}`, 20, yPos + 12)
    doc.text(`Booking Date: ${new Date(booking.date).toLocaleDateString('en-GB')}`, 20, yPos + 18)
    yPos += 26
  }

  doc.text(`Number of Travelers: ${booking.travelers}`, 20, yPos)
  
  if (booking.specialRequests && booking.specialRequests.trim()) {
    yPos += 6
    doc.text(`Special Requests: ${booking.specialRequests}`, 20, yPos)
  }

  // --- PAYMENT BREAKDOWN ---
  yPos += 15
  doc.setFillColor(...success)
  doc.rect(15, yPos, 180, 8, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("PAYMENT BREAKDOWN", 20, yPos + 5.5)

  yPos += 12
  doc.setFillColor(...lightGray)
  doc.rect(15, yPos, 180, 20, "F")
  
  doc.setTextColor(...textDark)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  
  const pricePerPerson = booking.totalAmount / booking.travelers
  doc.text(`Price per Person: AED ${pricePerPerson.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`, 20, yPos + 6)
  doc.text(`Number of Travelers: ${booking.travelers}`, 20, yPos + 12)
  doc.text(`Subtotal: AED ${booking.totalAmount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`, 20, yPos + 18)

  // --- TOTAL AMOUNT HIGHLIGHT ---
  yPos += 25
  doc.setFillColor(...accentGold)
  doc.rect(15, yPos, 180, 12, "F")
  
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.text(`TOTAL AMOUNT: AED ${booking.totalAmount.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`, 20, yPos + 8)

  // --- IMPORTANT NOTICE ---
  yPos += 18
  doc.setFillColor(255, 248, 220) // Light amber
  doc.setDrawColor(255, 193, 7) // Gold border
  doc.rect(15, yPos, 180, 12, "FD")
  
  doc.setTextColor(133, 77, 14) // Dark amber text
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("IMPORTANT NOTICE:", 20, yPos + 5)
  doc.setFont("helvetica", "normal")
  doc.text("Final prices may vary during payment processing. Please retain this invoice for your records.", 20, yPos + 9)

  // --- PROFESSIONAL FOOTER ---
  // Position footer at the absolute bottom of the page
  const footerY = 262 // Fixed position at bottom of A4 page (297mm - 35mm)
  doc.setFillColor(...darkGray)
  doc.rect(0, footerY, 210, 35, "F")
  
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Thank you for choosing AFI Travel & Tourism!", 20, footerY + 10)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(200, 200, 200)
  doc.text("Customer Support: +971 564995248  |  Email: sales@afitravelandtourism.com", 20, footerY + 18)
  doc.text("Website: www.afitravelandtourism.com  |  Dubai, United Arab Emirates", 20, footerY + 23)
  
  doc.setTextColor(160, 160, 160)
  doc.setFontSize(6)
  doc.text("Terms & Conditions apply. Please read our cancellation policy on our website.", 20, footerY + 28)
  doc.text("This is a computer-generated invoice. No signature required.", 20, footerY + 32)

  return doc
}
