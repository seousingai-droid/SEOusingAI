// HVAC niche content. Prices, times and reviews are samples: a client's real numbers replace them.
export type Faq = { q: string; a: string };
export type Service = {
  slug: string;
  name: string;
  title: string; // the page H1
  metaTitle: string;
  description: string;
  short: string;
  image: string;
  imageAlt: string;
  plate: { time: string; from: string; warranty: string };
  answer: string; // the first paragraph: the direct answer
  signs: { h: string; list: string[] };
  steps: { h: string; p: string }[];
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: "ac-repair",
    name: "AC repair",
    title: "AC repair in Phoenix, usually the same day",
    metaTitle: "AC Repair in Phoenix, Same-Day Service",
    description: "Same-day AC repair across the Phoenix metro. Upfront price before any work, the common parts on the truck, and a 2-year labor warranty.",
    short: "Warm air, no air, strange noises or a unit that will not start.",
    image: "technician-condenser",
    imageAlt: "Technician checking an outdoor AC condenser in a Phoenix backyard",
    plate: { time: "Same day", from: "$89 visit", warranty: "2 yr labor" },
    answer: "We repair every make of central air conditioner across the Phoenix metro, usually on the day you call. You get a written price before any work starts, and the common parts, such as capacitors, contactors and fan motors, are on the truck so most repairs are finished in one visit.",
    signs: { h: "Call us when your AC", list: ["blows warm or barely cool air", "runs constantly but the house will not cool down", "makes buzzing, grinding or banging noises", "trips the breaker or will not start", "has ice on the copper line or the indoor coil", "leaks water around the indoor unit"] },
    steps: [
      { h: "Diagnose", p: "A technician tests the electrical parts, refrigerant pressures and airflow, then shows you what failed." },
      { h: "Price in writing", p: "You approve a fixed price before we start. If you decide not to repair, you only pay for the visit." },
      { h: "Repair and test", p: "We fix it, run the system, and measure the temperature drop across the coil before we leave." },
    ],
    faqs: [
      { q: "How fast can you come out?", a: "Most AC repair calls in the Phoenix metro are seen the same day. During heat waves we put homes with elderly residents, babies or medical needs first." },
      { q: "How much does AC repair cost?", a: "The diagnostic visit is $89 and is credited to the repair. Common repairs such as a capacitor replacement start around $195. You see the exact price before we begin." },
      { q: "Is it worth repairing an old AC?", a: "Often, yes. Use the $5,000 rule as a first check: multiply the system's age by the repair cost. Under $5,000, repairing usually makes sense." },
    ],
  },
  {
    slug: "ac-installation",
    name: "AC installation",
    title: "New AC installation, sized for a Phoenix summer",
    metaTitle: "AC Installation and Replacement in Phoenix",
    description: "New air conditioner installation in Phoenix: a load calculation for your home, two or three written options, and a one-day install for most homes.",
    short: "Replacement systems sized to your home, not guessed from the old unit.",
    image: "ac-installation",
    imageAlt: "New outdoor air conditioner on a concrete pad beside a stucco home",
    plate: { time: "1 day install", from: "$7,500", warranty: "10 yr parts" },
    answer: "We replace air conditioners across the Phoenix metro in one day for most homes. Every quote starts with a load calculation of your home, so the new system is sized for a Phoenix summer instead of copying the old unit's size, and you choose from two or three options with the price in writing.",
    signs: { h: "Consider a new system when", list: ["your AC is more than 12 to 15 years old", "repairs are getting more frequent", "it uses R-22 refrigerant, which has not been produced or imported in the US since 2020", "some rooms never cool down", "your summer electric bills keep climbing"] },
    steps: [
      { h: "Measure", p: "We measure the home, windows, insulation and ductwork to calculate the cooling it really needs." },
      { h: "Choose", p: "You get two or three options in writing, from a reliable standard system to a high-efficiency variable-speed model." },
      { h: "Install", p: "A crew installs the system, seals and tests the connections, removes the old unit, and walks you through the thermostat." },
    ],
    faqs: [
      { q: "What size AC do I need?", a: "It depends on the home, not only on square footage. Insulation, windows, sun exposure and ductwork all change the answer, which is why we calculate the load before quoting." },
      { q: "What does SEER2 mean?", a: "SEER2 is the efficiency rating used for air conditioners sold in the US since 2023. A higher number uses less electricity for the same cooling." },
      { q: "Do new systems use a different refrigerant?", a: "Yes. New systems now use lower-impact refrigerants such as R-454B and R-32 in place of R-410A. Our technicians are trained and equipped for them." },
    ],
  },
  {
    slug: "heating-repair",
    name: "Heating repair",
    title: "Furnace and heating repair before the cold nights",
    metaTitle: "Furnace and Heating Repair in Phoenix",
    description: "Gas furnace and heating repair in Phoenix. Safety checks on every visit, upfront pricing, and most repairs finished in one trip.",
    short: "Gas furnaces and air handlers that blow cold or will not light.",
    image: "furnace-inspection",
    imageAlt: "Technician inspecting an open gas furnace in a garage utility closet",
    plate: { time: "Same or next day", from: "$89 visit", warranty: "2 yr labor" },
    answer: "We repair gas furnaces and electric heating systems across the Phoenix metro, usually the same or next day. Every heating visit includes a safety check of the burners, flame sensor and venting, and you get the price in writing before any work starts.",
    signs: { h: "Call us when your heater", list: ["blows cold air", "clicks but does not light", "short-cycles on and off", "smells of gas or burning dust that does not go away", "makes the carbon monoxide alarm sound"] },
    steps: [
      { h: "Check safety first", p: "We test for gas leaks and carbon monoxide and inspect the heat exchanger before anything else." },
      { h: "Find the fault", p: "Ignitor, flame sensor, pressure switch or board: we test the sequence and show you what failed." },
      { h: "Repair and test", p: "We fix it and run a full heating cycle to confirm the burners, blower and venting all work." },
    ],
    faqs: [
      { q: "What should I do if I smell gas?", a: "Leave the house, then call your gas company's emergency line from outside. Do not switch lights or appliances on or off. Call us once the gas company says it is safe." },
      { q: "How often should a furnace be serviced?", a: "Once a year, in the fall, before you need it. In Phoenix a furnace runs only a few months a year, so a check catches problems before the first cold night." },
    ],
  },
  {
    slug: "heat-pumps",
    name: "Heat pumps",
    title: "Heat pump installation and repair",
    metaTitle: "Heat Pump Installation and Repair in Phoenix",
    description: "Heat pump installation and repair in Phoenix. One system that cools in summer and heats in winter, well suited to mild desert winters.",
    short: "One system that cools all summer and heats on cool desert nights.",
    image: "heat-pump",
    imageAlt: "Modern heat pump outdoor unit beside a contemporary desert home",
    plate: { time: "1 day install", from: "$9,000", warranty: "10 yr parts" },
    answer: "A heat pump is one system that cools your home in summer and heats it in winter by moving heat instead of burning gas. Phoenix winters are mild, so a heat pump can handle most of the year's heating efficiently, and we install and repair every major type.",
    signs: { h: "A heat pump makes sense if you", list: ["are replacing both an AC and an old furnace", "want to stop using gas for heating", "have a home without a gas line", "want one system and one maintenance visit for both seasons"] },
    steps: [
      { h: "Assess", p: "We check your home's heating and cooling load and your electrical panel." },
      { h: "Compare", p: "You see heat pump and AC-plus-furnace options side by side, with running costs explained." },
      { h: "Install", p: "We install, set up the defrost and backup heat controls, and show you the thermostat settings that save the most." },
    ],
    faqs: [
      { q: "Do heat pumps work in Phoenix?", a: "Yes. Heat pumps handle Phoenix summers like any central AC, and mild winters are where they heat most efficiently." },
      { q: "Is a heat pump cheaper to run than a gas furnace?", a: "It depends on your electricity and gas rates and the efficiency of each system. We compare the two for your home before you decide." },
    ],
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor air quality",
    title: "Cleaner indoor air, even in dust season",
    metaTitle: "Indoor Air Quality Services in Phoenix",
    description: "Indoor air quality in Phoenix: better-fitting filters, duct sealing and air purifiers, tested first so you only pay for what helps your home.",
    short: "Filters, duct sealing and purifiers for dust, allergies and odors.",
    image: "air-filter",
    imageAlt: "Technician replacing a pleated air filter in a ceiling return grille",
    plate: { time: "2 to 4 hours", from: "$149", warranty: "1 yr labor" },
    answer: "We improve indoor air in Phoenix homes by fixing what lets dust in and upgrading what takes it out: sealing leaky ductwork, fitting better filters, and adding air purification where it helps. We test first, so you only pay for what makes a difference in your home.",
    signs: { h: "Worth a look if", list: ["dust settles again a day after cleaning", "allergies are worse indoors than outside", "some rooms smell stale or musty", "your filter turns gray within weeks", "dust storms leave a film inside the house"] },
    steps: [
      { h: "Test", p: "We check filter fit, duct leakage and airflow to find where dust and odors come from." },
      { h: "Recommend", p: "You get a short list of fixes in order of impact, with prices." },
      { h: "Fix", p: "We seal, upgrade and install, then show you how often to change filters." },
    ],
    faqs: [
      { q: "How often should I change my air filter in Phoenix?", a: "Check it monthly. Many Phoenix homes need a new standard filter every one to two months in summer and after dust storms." },
      { q: "Do air purifiers really help?", a: "They can, for allergies and odors, but a well-fitted filter and sealed ducts come first. A purifier cannot keep up with dust pouring in through leaky ducts." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug)!;

// Sample price guide. Ranges and starting prices only; a client's real prices replace these.
export const prices: { item: string; price: string; note: string }[] = [
  { item: "Diagnostic visit", price: "$89", note: "Credited to the repair if you go ahead" },
  { item: "AC tune-up", price: "$129", note: "Free with the maintenance plan" },
  { item: "Capacitor replacement", price: "from $195", note: "The most common summer repair" },
  { item: "Refrigerant leak search", price: "from $295", note: "Includes an electronic leak test" },
  { item: "Blower motor replacement", price: "from $650", note: "Standard or variable-speed motors" },
  { item: "New AC system", price: "$7,500 to $14,000", note: "Depends on size and efficiency" },
  { item: "New heat pump system", price: "$9,000 to $16,000", note: "Replaces AC and furnace in one" },
  { item: "New gas furnace", price: "$4,500 to $8,500", note: "Includes venting and safety checks" },
];

export const plan = {
  name: "Copperline Comfort Plan",
  price: "$19 a month",
  perks: [
    "Two tune-ups a year: AC in spring, heating in fall",
    "Priority scheduling during heat waves",
    "15% off repairs",
    "No overtime charge on evenings and weekends",
    "A filter check and change at every visit",
  ],
};

export const areas: { slug: string; name: string; time: string; neighborhoods: string[]; note: string }[] = [
  { slug: "phoenix", name: "Phoenix", time: "Same day", neighborhoods: ["Arcadia", "Encanto", "Ahwatukee", "North Mountain"], note: "Our home base, with technicians on the road across the city all day." },
  { slug: "scottsdale", name: "Scottsdale", time: "Same day", neighborhoods: ["Old Town", "McCormick Ranch", "Gainey Ranch", "North Scottsdale"], note: "From 1960s ranch homes near Old Town to large newer homes in the north." },
  { slug: "tempe", name: "Tempe", time: "Same day", neighborhoods: ["Kiwanis Park", "South Tempe", "Lakeshore", "Downtown Tempe"], note: "Older homes and rentals near ASU, family homes in South Tempe." },
  { slug: "mesa", name: "Mesa", time: "Same or next day", neighborhoods: ["Dobson Ranch", "Red Mountain", "Las Sendas", "Downtown Mesa"], note: "A wide service area, with a technician based on the east side." },
  { slug: "chandler", name: "Chandler", time: "Same or next day", neighborhoods: ["Ocotillo", "Fulton Ranch", "Downtown Chandler", "Sun Lakes"], note: "Many 2000s-era systems now reaching replacement age." },
  { slug: "glendale", name: "Glendale", time: "Next day", neighborhoods: ["Arrowhead Ranch", "Catlin Court", "Westgate", "Deer Valley"], note: "West Valley calls, booked the same or next day." },
];

export const faqs: Faq[] = [
  { q: "Do you offer emergency AC repair?", a: "Yes. We answer emergency calls 24 hours a day, 7 days a week, and put homes with elderly residents, babies or medical needs first during heat waves." },
  { q: "How much does a service visit cost?", a: "A diagnostic visit is $89 and is credited to the repair if you go ahead. You get the full price in writing before any work starts." },
  { q: "Do you charge more at night or on weekends?", a: "Evening and weekend visits carry an after-hours fee, which we tell you on the phone. Comfort Plan members never pay it." },
  { q: "What areas do you serve?", a: "Phoenix, Scottsdale, Tempe, Mesa, Chandler and Glendale, plus nearby communities across the Phoenix metro." },
  { q: "Are your technicians licensed?", a: "Yes. The company is licensed with the Arizona Registrar of Contractors, and every technician holds the EPA 608 certification required to handle refrigerant." },
  { q: "Do you offer financing?", a: "Yes, for new systems, through approved lenders. You can apply during your estimate and see the monthly payment before you decide." },
  { q: "How long does an AC last in Phoenix?", a: "Many central air systems in the desert last about 10 to 15 years. Heavy summer use, dust and maintenance all change that." },
  { q: "Which brands do you work on?", a: "All major brands of central air conditioners, heat pumps and gas furnaces, whoever installed them." },
];

// Sample reviews for the demo. A live site shows the client's real Google reviews.
export const reviews: { text: string; name: string; area: string; service: string }[] = [
  { text: "AC quit at 4 pm on a 114-degree day. They were here by 6 and the house was cooling by 7. The price was exactly what they quoted.", name: "Dana R.", area: "Arcadia, Phoenix", service: "AC repair" },
  { text: "Two other companies wanted to sell us a bigger unit. Copperline measured the house and said our old size was too big, not too small. The new system is quieter and our bill dropped.", name: "Marcus T.", area: "Chandler", service: "AC installation" },
  { text: "Clear explanation, photos of the failed part, and they left the closet cleaner than they found it.", name: "Priya S.", area: "Tempe", service: "Heating repair" },
  { text: "The maintenance plan paid for itself the first summer. They found a weak capacitor in April, before it could fail in July.", name: "Glen W.", area: "Mesa", service: "Comfort Plan" },
  { text: "Dust was our big problem. They sealed the return ducts and fitted proper filters. Huge difference after the last dust storm.", name: "Alicia M.", area: "Scottsdale", service: "Indoor air quality" },
  { text: "We switched from an old furnace and AC to a heat pump. They compared the running costs honestly before we decided.", name: "Tom and Jess K.", area: "Glendale", service: "Heat pump" },
];
