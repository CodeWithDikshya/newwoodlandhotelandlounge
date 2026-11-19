/*
 * CLIENT DATA — the single place to enter confirmed hotel details.
 * Leave a value as "" while it is pending: the site will show a clearly
 * marked "pending" placeholder instead of inventing information.
 */
const SITE_CONFIG = {
  // One or more numbers, in the format they should be displayed
  phones: ["+977 9852690590", "+977 9801415167", "+977 23 590898"],

  email: "woodlandhotel146@gmail.com",

  // Full street address as it should appear on the site
  address: "Bhadrapur-8, Jhapa, Nepal",

  // WhatsApp number in international format, digits only (no +, spaces or dashes),
  // e.g. "9779800000000"
  whatsappNumber: "9779852690590",

  // Default message pre-filled when a guest taps a WhatsApp button
  whatsappMessage: "Hello Newwoodland Hotel & Lounge, I would like to make an inquiry.",

  // Google Maps search text or "latitude,longitude" for the confirmed location,
  // e.g. "27.7172,85.3240" or "Newwoodland Hotel & Lounge, <city>"
  mapQuery: "Newwoodland Hotel & Lounge, Bhadrapur-8, Jhapa, Nepal",

  // Official social media profile URLs (only client-verified links)
  social: {
    facebook: "https://www.facebook.com/p/Woodland-Hotel-61577239836862/",
    instagram: "https://www.instagram.com/newwoodlandhotel/",
    tiktok: "https://www.tiktok.com/@newwoodland.hotel"
  }
};
