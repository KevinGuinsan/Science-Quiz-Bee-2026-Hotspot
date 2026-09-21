/**
 * Quiz Bee Question Bank & Helper Functions
 * Grade 11 - Physical Science & Chemistry
 */

const rawQuestionBank = {
  1: [
    // --- EASY ROUND ---
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which quantity describes rotational motion rather than translational motion?", options: ["Linear velocity", "Angular velocity", "Displacement", "Acceleration"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which condition poses an electrical hazard caused by connecting too many appliances to one outlet?", options: ["Damaged insulation", "Faulty wiring", "Overloading", "Electrocution"], answer: 2 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which scientist merged chemistry and biology to discover heat treatment prevents microbial growth?", options: ["Antoine Lavoisier", "Louis Pasteur", "Dmitri Mendeleev", "Robert Boyle"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What is the primary physical principle behind hydraulic lifts?", options: ["Archimedes' Principle", "Pascal's Principle", "Bernoulli's Principle", "Newton's First Law"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What active ingredient is commonly found in household liquid bleach?", options: ["Sodium chloride", "Sodium hypochlorite", "Acetic acid", "Calcium carbonate"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What modern lighting technology is known for minimal energy wastage?", options: ["Incandescent bulb", "Fluorescent tube", "LED bulb", "Halogen lamp"], answer: 2 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which simple machine consists of a rigid bar pivoting on a fulcrum?", options: ["Pulley", "Lever", "Wedge", "Screw"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "An object floats in a fluid if its overall average density is what compared to the fluid?", options: ["Greater than the fluid", "Equal to the fluid", "Less than the fluid", "Double the fluid"], answer: 2 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which wave property of sound is primarily utilized in medical ultrasound imaging?", options: ["Refraction", "Reflection", "Diffraction", "Absorption"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which Philippine government agency regulates personal care cosmetics and drugs?", options: ["DTI", "DENR", "FDA", "DOST"], answer: 2 },
    
    // --- MODERATE ROUND ---
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "When a dancer executes a pirouette, pulling their arms closer to the body increases spin speed due to what?", options: ["Linear momentum increase", "Conservation of angular momentum", "Decrease in total torque", "Increase in rotational inertia"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why is dampness near electrical appliances considered extremely dangerous?", options: ["Water reduces voltage", "Water decreases electrical resistance of human skin", "Water increases wire resistance", "Water drains battery charge"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "What chemical component in laundry detergent reduces water surface tension to lift grease?", options: ["Surfactant", "Builder", "Bleaching agent", "Enzyme"], answer: 0 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "How does a compound machine differ from a simple machine?", options: ["It generates its own energy", "It combines two or more simple machines", "It operates without friction", "It requires electrical power"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Soundproof studio walls utilize porous, soft materials primarily to accomplish what?", options: ["Reflect sound waves", "Amplify sound waves", "Absorb sound wave energy", "Diffract sound waves"], answer: 2 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "According to Pascal's Principle, pushing a small piston produces a larger force on a larger piston because what stays constant?", options: ["Fluid volume", "Fluid pressure", "Fluid speed", "Mechanical work"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Louis Pasteur's research disputed spontaneous generation and established which biological theory?", options: ["Cell theory", "Germ theory of disease", "Gene theory", "Atomic theory"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "An ergonomic office chair adjustment mechanism primarily applies physics concepts to reduce what?", options: ["Body mass", "Joint stress and improper torque", "Gravitational force", "Body temperature"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Which regulatory agency sets environmental disposal standards for chemical waste in the Philippines?", options: ["DTI", "FDA", "DENR", "DOST"], answer: 2 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Laser light differs from ordinary light bulb radiation because laser light is what?", options: ["Polychromatic", "Coherent and monochromatic", "Diffuse", "Incoherent"], answer: 1 },
    
    // --- DIFFICULT ROUND (IDENTIFICATION FORMAT) ---
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What optical phenomenon allows light signals to travel inside fiber optic cables without escaping?", answer: "total internal reflection" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What detergent chemical additive causes algal blooms and oxygen depletion in rivers?", answer: "phosphate" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What rotational force causes an object to turn or rotate around a pivot or fulcrum?", answer: "torque" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What upward force is exerted by a fluid on an object placed in it according to Archimedes' principle?", answer: "buoyant force" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What hollow hull design allows massive metal ships to float by increasing displaced water volume?", answer: "density" },

    // --- CLINCHER ROUND ---
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "Which simple machine wrapped around a cylinder converts rotational motion to linear force?", options: ["Wedge", "Screw", "Lever", "Pulley"], answer: 1 },
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What heating process eliminates pathogens in dairy products without boiling the liquid?", answer: "pasteurization" },
    { round: "Clincher Round", points: 1, timer: 10, type: "mc", question: "What circuit protection mechanism melts to interrupt excessive current flow?", options: ["Transformer", "Fuse", "Capacitor", "Resistor"], answer: 1 },
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What primary surfactant compound ingredient in soap molecules lifts nonpolar oil?", answer: "fatty acid" },
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "Which wave interaction in noise-canceling headphones neutralizes incoming sound waves?", options: ["Constructive interference", "Destructive interference", "Refraction", "Diffraction"], answer: 1 }
  ],
  2: [
    // --- EASY ROUND ---
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which motion occurs when an object moves along a straight path without rotation?", options: ["Translational motion", "Rotational motion", "Circular motion", "Vibrational motion"], answer: 0 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which device converts electrical energy into mechanical movement in household fans?", options: ["Electric generator", "Electric motor", "Transformer", "Capacitor"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Pasteurization involves heating liquids to specific temperatures to destroy what?", options: ["Chemical toxins", "Harmful pathogens", "Proteins", "Mineral compounds"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What buoyant force acts on an object submerged in a fluid according to Archimedes' principle?", options: ["Equal to object weight", "Equal to weight of displaced fluid", "Equal to fluid surface area", "Equal to atmospheric pressure"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which household product ingredient is primarily responsible for raising dough in baking?", options: ["Sodium hypochlorite", "Sodium bicarbonate", "Sodium hydroxide", "Sodium chloride"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Replacing old incandescent lights with LEDs in schools primarily reduces what?", options: ["Voltage", "Electrical energy wastage", "Light intensity", "Current frequency"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which simple machine is used in vehicle steering wheels to multiply input turning force?", options: ["Inclined plane", "Wheel and axle", "Wedge", "Pulley"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What property of light allows optical lenses to focus light rays?", options: ["Reflection", "Refraction", "Absorption", "Diffraction"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Damaged wire insulation in home appliances creates a significant risk of what?", options: ["Short circuits and electrocution", "Lower electric bills", "Overcharging", "Voltage reduction"], answer: 0 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which government agency handles consumer product safety and fair trade in product labeling?", options: ["DENR", "DTI", "FDA", "DOST"], answer: 1 },
    
    // --- MODERATE ROUND ---
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "How does an ergonomic computer mouse design reduce repetitive strain injuries in the wrist?", options: ["By eliminating friction", "By promoting natural joint alignment and lower muscle torque", "By increasing translational acceleration", "By doubling grip force"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why is mixing household ammonia with chlorine bleach extremely dangerous?", options: ["It produces explosive nitroglycerin", "It generates toxic chloramine gas", "It neutralizes cleaning action uselessly", "It forms highly corrosive acid rain"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "A hydraulic brake system in modern automobiles amplifies pedal force using which medium?", options: ["Compressed air", "Incompressible hydraulic fluid", "Mechanical gears", "Magnetic fields"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "How did Louis Pasteur's work with wine fermentation contribute to industrial microbiology?", options: ["He discovered synthetic dyes", "He identified microbes responsible for fermentation and spoilage", "He invented antibiotics", "He created chemical fertilizers"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why does an electric kettle consume significant energy if scale deposits accumulate inside?", options: ["Scale lowers electrical resistance", "Scale acts as a thermal insulator requiring longer operation", "Scale causes short circuits", "Scale increases voltage requirements"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "What is the primary function of fluoride compounds added to personal care toothpaste?", options: ["Whiten teeth enamel", "Remineralize and prevent tooth decay", "Provide sweet flavor", "Act as a surfactant"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "In sonar navigation, how do submarine systems calculate distance to the ocean floor?", options: ["By measuring sound refraction angle", "By measuring echo time delay of reflected sound", "By absorbing light signals", "By measuring water density shifts"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "In gymnastics, executing a tight tuck flip allows faster rotation than an layout body position because what is reduced?", options: ["Rotational inertia (moment of inertia)", "Gravitational pull", "Total angular momentum", "Translational displacement"], answer: 0 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "An object submerged in water experiences an upward buoyant force of 50 N. What mass of water was displaced in kg? (g = 9.8 m/s²)", options: ["2.5 kg", "5.1 kg", "10.0 kg", "50.0 kg"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Holograms differ from standard 3D photographs because holographic recording captures what wave characteristic?", options: ["Amplitude only", "Phase information and interference patterns", "Speed variations", "Wavelength reduction"], answer: 1 },
    
    // --- DIFFICULT ROUND (IDENTIFICATION FORMAT) ---
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What simple machine component acts as a fixed pivot point about which a lever rotates?", answer: "fulcrum" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What class of hazardous metals like lead and cadmium leach into groundwater from improper battery disposal?", answer: "heavy metals" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What safety device automatically breaks an electric circuit when current amperage exceeds safe limits?", answer: "circuit breaker" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "Which medical innovation uses focused, coherent light waves for precise tissue incisions?", answer: "laser" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What fluid property describes a liquid's resistance to flow and internal friction?", answer: "viscosity" },

    // --- CLINCHER ROUND ---
    { round: "Clincher Round", points: 1, timer: 10, type: "mc", question: "Which unit measures electric current flow through home wiring?", options: ["Volts", "Amperes", "Ohms", "Watts"], answer: 1 },
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What fundamental property of matter resists changes in its state of linear motion?", answer: "inertia" },
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "Which regulatory body certifies drug efficacy and food hygiene safety in the Philippines?", options: ["DENR", "FDA", "DTI", "DOST"], answer: 1 },
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What light wave frequency band is used by remote controls and thermal sensors?", answer: "infrared" },
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "Which law explains how pressure changes applied to an enclosed fluid transmit equally in all directions?", options: ["Archimedes' Principle", "Pascal's Principle", "Boyle's Law", "Hooke's Law"], answer: 1 }
  ],
  3: [
    // --- EASY ROUND ---
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which unit measures angular displacement in rotational kinematics?", options: ["Meters", "Radians", "Newton-meters", "Watts"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Unplugging phantom energy chargers when not in use helps homes do what?", options: ["Increase voltage", "Minimize standby energy loss", "Prevent power outages", "Boost wire speed"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Louis Pasteur developed early vaccines for which fatal viral disease affecting mammals?", options: ["Tuberculosis", "Rabies", "Malaria", "Cholera"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What is the primary function of a fixed pulley attached to a flagpole?", options: ["Multiply input force", "Change force direction", "Increase mechanical work", "Reduce load mass"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What primary chemical compound acts as the abrasive cleaner in many toothpastes?", options: ["Calcium carbonate", "Sodium hypochlorite", "Ammonia", "Ethanol"], answer: 0 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "An object will sink in water if its mass-to-volume ratio is what?", options: ["Equal to 1.0 g/cm³", "Less than 1.0 g/cm³", "Greater than 1.0 g/cm³", "Zero"], answer: 2 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which sound innovation involves placing acoustic foam panels inside radio broadcasting rooms?", options: ["Sound amplification", "Soundproofing", "Echo generation", "Sonar imaging"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Faulty household electrical wiring with stripped insulation creates a high risk of what?", options: ["Electrocution and structure fires", "Excessive energy savings", "Voltage drops", "Lower current flow"], answer: 0 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "What type of light wave technology is widely used in supermarket barcode scanners?", options: ["Infrared LEDs", "Lasers", "Ultraviolet lamps", "Incandescent bulbs"], answer: 1 },
    { round: "Easy Round", points: 1, timer: 10, type: "mc", question: "Which simple machine consists of an inclined plane wrapped around a cylinder?", options: ["Wedge", "Screw", "Lever", "Wheel and axle"], answer: 1 },
    
    // --- MODERATE ROUND ---
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "In vehicle ergonomics, how do bucket seats reduce driver fatigue during sharp turns?", options: ["By maximizing translational velocity", "By providing lateral support against rotational centripetal forces", "By reducing total vehicle weight", "By absorbing tire friction"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Louis Pasteur's swan-neck flask experiments proved what critical biological fact?", options: ["Microbes arise spontaneously from air", "Microbes enter from airborne particles, not spontaneous generation", "Heat creates new bacteria", "Viruses require chemical media"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "A compound machine like a bicycle combines which two simple machines in its drive system?", options: ["Lever and wedge", "Wheel/axle and pulley (chain/sprocket)", "Screw and inclined plane", "Hydraulic press and lever"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "What environmental health issue arises when excessive phosphate detergents enter aquatic ecosystems?", options: ["Ocean acidification", "Algal blooms leading to oxygen depletion (eutrophication)", "Thermal pollution", "Heavy metal buildup"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why does a heavy concrete block feel lighter when held under water than in air?", options: ["Gravity is lower underwater", "Water exerts an upward buoyant force equal to displaced water weight", "Water density decreases block mass", "Water pressure acts only downward"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "How does circuit breaker tripping protect home electrical systems from fire hazards?", options: ["It increases line voltage", "It cuts off current flow when amperage exceeds safe limits", "It redirects current to earth ground", "It cools overheated copper wires"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Noise-canceling headphones eliminate unwanted ambient sound using which wave interaction?", options: ["Constructive interference", "Destructive interference", "Total internal reflection", "Diffraction grating"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why are hazardous household chemicals required by DTI/FDA to display GHS warning pictograms?", options: ["To make labels decorative", "To communicate immediate health, flammability, and toxicity risks clearly", "To indicate price levels", "To list active ingredient ratios"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Converting linear motion into angular rotation depends on applying force at what distance from an axis?", options: ["At zero distance", "At a perpendicular distance (radius) to create torque", "Parallel to the bar", "At the exact center of mass"], answer: 1 },
    { round: "Moderate Round", points: 3, timer: 15, type: "mc", question: "Why do modern energy-efficient air conditioners with inverter technology consume less electricity?", options: ["They run at maximum speed constantly", "They adjust compressor motor speed dynamically instead of cycling fully ON/OFF", "They bypass home circuit breakers", "They utilize hydraulic pumps"], answer: 1 },
    
    // --- DIFFICULT ROUND (IDENTIFICATION FORMAT) ---
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What additive in personal care soaps acts as a chelating agent to soften hard water?", answer: "edta" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What wave interaction causes noise-canceling headphones to reduce background sound?", answer: "destructive interference" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What physical property of a body resists changes in its rotational state of motion?", answer: "rotational inertia" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What heating process eliminates disease-causing pathogens in milk and fruit juices?", answer: "pasteurization" },
    { round: "Difficult Round", points: 5, timer: 30, type: "text", question: "What simple machine consists of a wheel with a groove holding a rope or cable?", answer: "pulley" },

    // --- CLINCHER ROUND ---
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What standard warning pictograms on cleaning products communicate toxicity and flammability?", answer: "ghs" },
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "An electric fan blade moving around a center spindle represents which motion?", options: ["Translational motion", "Rotational motion", "Linear motion", "Vibrational motion"], answer: 1 },
    { round: "Clincher Round", points: 1, timer: 10, type: "mc", question: "What chemical element active compound in liquid bleach disinfects surfaces?", options: ["Chlorine", "Fluoride", "Iodine", "Ammonia"], answer: 0 },
    { round: "Clincher Round", points: 5, timer: 30, type: "text", question: "What optical wave property causes light bending when entering water from air?", answer: "refraction" },
    { round: "Clincher Round", points: 3, timer: 15, type: "mc", question: "What happens when two simple machines operate together in a single system?", options: ["Forms a compound machine", "Generates free energy", "Eliminates friction", "Reduces mechanical power"], answer: 0 }
  ]
};

// Aliases for string key selects ("A", "B", "C", "Question Set A", etc.)
rawQuestionBank["A"] = rawQuestionBank[1];
rawQuestionBank["B"] = rawQuestionBank[2];
rawQuestionBank["C"] = rawQuestionBank[3];
rawQuestionBank["Question Set A"] = rawQuestionBank[1];
rawQuestionBank["Question Set B"] = rawQuestionBank[2];
rawQuestionBank["Question Set C"] = rawQuestionBank[3];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prepareShuffledSet(rawSet) {
  const easy = shuffleArray(rawSet.filter(q => q.round === "Easy Round"));
  const moderate = shuffleArray(rawSet.filter(q => q.round === "Moderate Round"));
  const difficult = shuffleArray(rawSet.filter(q => q.round === "Difficult Round"));
  const clincher = shuffleArray(rawSet.filter(q => q.round === "Clincher Round"));
  return [...easy, ...moderate, ...difficult, ...clincher];
}
