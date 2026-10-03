// Everything that changes from one HVAC client to the next lives here and in hvac.ts.
// This is the demo business: every fact below is sample data, and the site says so.
export const business = {
  name: "Copperline Comfort Co.",
  short: "Copperline",
  tagline: "Heating and air conditioning",
  city: "Phoenix",
  state: "AZ",
  metro: "Phoenix metro",
  phone: "(602) 555-0142",
  tel: "+16025550142",
  email: "service@copperline.example",
  address: { street: "2150 E Thomas Rd, Suite 100", city: "Phoenix", region: "AZ", zip: "85016" },
  hours: [
    { days: "Mon to Fri", time: "7:00 am to 7:00 pm", schema: "Mo-Fr 07:00-19:00" },
    { days: "Saturday", time: "8:00 am to 4:00 pm", schema: "Sa 08:00-16:00" },
  ],
  emergency: "24/7 emergency AC repair",
  license: "ROC #000000",
  founded: 2009,
  laborWarranty: "2-year labor warranty",
  url: "https://hvac.seousingai.com",
  // Who made the demo, and where to get one.
  demo: { by: "SEO Using AI", href: "https://seousingai.com/book-a-call" },
} as const;

export const telHref = `tel:${business.tel}`;
