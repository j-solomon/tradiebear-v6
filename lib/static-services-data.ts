// Static service data - exact wording as specified
// DO NOT MODIFY - Frontend display only

export interface StaticSubService {
  id: string
  name: string
}

export interface StaticService {
  id: string
  name: string
  description: string
  sub_services: StaticSubService[]
}

export const STATIC_SERVICES: StaticService[] = [
  {
    id: 'roofing',
    name: 'Roofing',
    description: 'New roofs, repairs, replacements and certifications',
    sub_services: [
      { id: 'roofing-1', name: 'Roof replacement (asphalt, metal, cedar, flat/TPO, tile)' },
      { id: 'roofing-2', name: 'Roof repair (leaks, flashing, wind/storm damage)' },
      { id: 'roofing-3', name: 'Roof inspection and certification' },
      { id: 'roofing-4', name: 'Roof moss removal and cleaning' },
      { id: 'roofing-5', name: 'Skylight installation and repair' },
      { id: 'roofing-6', name: 'Roof ventilation upgrades' },
      { id: 'roofing-7', name: 'Emergency roof tarping' },
      { id: 'roofing-8', name: 'Attic venting and insulation tie-ins' }
    ]
  },
  {
    id: 'siding',
    name: 'Siding',
    description: 'Exterior siding installation and repair services',
    sub_services: [
      { id: 'siding-1', name: 'Fiber cement (HardiePlank, Allura)' },
      { id: 'siding-2', name: 'Vinyl siding replacement' },
      { id: 'siding-3', name: 'Cedar siding installation' },
      { id: 'siding-4', name: 'Metal siding and panels' },
      { id: 'siding-5', name: 'Soffit and fascia repair' },
      { id: 'siding-6', name: 'House wrap and moisture barrier install' },
      { id: 'siding-7', name: 'Trim, corner boards and flashing details' },
      { id: 'siding-8', name: 'Exterior cladding removal and disposal' }
    ]
  },
  {
    id: 'kitchen-remodels',
    name: 'Kitchen Remodels',
    description: 'Full kitchen design and renovation services',
    sub_services: [
      { id: 'kitchen-1', name: 'Full kitchen design and renovation' },
      { id: 'kitchen-2', name: 'Cabinet installation or refacing' },
      { id: 'kitchen-3', name: 'Countertop replacement (quartz, granite, butcher block)' },
      { id: 'kitchen-4', name: 'Backsplash tile installation' },
      { id: 'kitchen-5', name: 'Lighting and electrical upgrades' },
      { id: 'kitchen-6', name: 'Plumbing fixture replacement' },
      { id: 'kitchen-7', name: 'Flooring and subfloor repairs' },
      { id: 'kitchen-8', name: 'Open-concept wall removal' }
    ]
  },
  {
    id: 'bathroom-remodels',
    name: 'Bathroom Remodels',
    description: 'Complete bathroom renovation and upgrade services',
    sub_services: [
      { id: 'bathroom-1', name: 'Shower conversions (tub to walk-in)' },
      { id: 'bathroom-2', name: 'Tile surround and waterproofing systems' },
      { id: 'bathroom-3', name: 'Vanities and countertops' },
      { id: 'bathroom-4', name: 'Flooring (tile, LVP, waterproof laminate)' },
      { id: 'bathroom-5', name: 'Lighting and exhaust fans' },
      { id: 'bathroom-6', name: 'Plumbing fixture installation' },
      { id: 'bathroom-7', name: 'Heated floors and smart mirrors' }
    ]
  },
  {
    id: 'adus',
    name: 'ADUs (Accessory Dwelling Units)',
    description: 'Accessory dwelling unit construction and conversions',
    sub_services: [
      { id: 'adu-1', name: 'Detached ADU construction' },
      { id: 'adu-2', name: 'Garage conversion ADUs' },
      { id: 'adu-3', name: 'Basement ADUs' },
      { id: 'adu-4', name: 'DADUs and backyard cottages' },
      { id: 'adu-5', name: 'Tiny homes and in-law suites' },
      { id: 'adu-6', name: 'Permit and design planning' },
      { id: 'adu-7', name: 'Utility hookups and foundation work' }
    ]
  },
  {
    id: 'pole-barns',
    name: 'Pole Barns',
    description: 'Agricultural and storage building construction',
    sub_services: [
      { id: 'pole-barn-1', name: 'Residential pole barns and workshops' },
      { id: 'pole-barn-2', name: 'Agricultural barns and storage buildings' },
      { id: 'pole-barn-3', name: 'RV and boat storage structures' },
      { id: 'pole-barn-4', name: 'Concrete slabs and footings' },
      { id: 'pole-barn-5', name: 'Framing, roofing, and metal siding' },
      { id: 'pole-barn-6', name: 'Electrical and lighting install' }
    ]
  },
  {
    id: 'decks-fences',
    name: 'Decks and Fences',
    description: 'Deck construction, fencing and outdoor structures',
    sub_services: [
      { id: 'deck-1', name: 'Composite deck construction (Trex, TimberTech)' },
      { id: 'deck-2', name: 'Cedar deck builds and staining' },
      { id: 'deck-3', name: 'Deck replacement and resurfacing' },
      { id: 'deck-4', name: 'Handrails, stairs and safety gates' },
      { id: 'deck-5', name: 'Wood and vinyl fencing' },
      { id: 'deck-6', name: 'Chain link and privacy fences' },
      { id: 'deck-7', name: 'Pergolas and shade structures' }
    ]
  },
  {
    id: 'flooring',
    name: 'Flooring (LVP, Hardwood and Carpet)',
    description: 'Complete flooring installation and refinishing',
    sub_services: [
      { id: 'flooring-1', name: 'Luxury vinyl plank installation' },
      { id: 'flooring-2', name: 'Engineered hardwood installation' },
      { id: 'flooring-3', name: 'Solid hardwood refinishing' },
      { id: 'flooring-4', name: 'Carpet install and removal' },
      { id: 'flooring-5', name: 'Tile installation (bathroom, kitchen, entry)' },
      { id: 'flooring-6', name: 'Subfloor repair and leveling' },
      { id: 'flooring-7', name: 'Baseboard and trim finishing' }
    ]
  },
  {
    id: 'garage-doors',
    name: 'Garage Doors',
    description: 'Garage door installation and repair services',
    sub_services: [
      { id: 'garage-1', name: 'New garage door installation' },
      { id: 'garage-2', name: 'Opener installation and smart systems' },
      { id: 'garage-3', name: 'Spring and track repair' },
      { id: 'garage-4', name: 'Insulated doors and weatherproofing' },
      { id: 'garage-5', name: 'Carriage-style and custom wood doors' }
    ]
  },
  {
    id: 'windows-doors',
    name: 'Windows and Doors',
    description: 'Window and door installation and replacement',
    sub_services: [
      { id: 'window-1', name: 'Window replacement (vinyl, fiberglass, wood)' },
      { id: 'window-2', name: 'Sliding glass and patio doors' },
      { id: 'window-3', name: 'Entry and front door replacement' },
      { id: 'window-4', name: 'French and double doors' },
      { id: 'window-5', name: 'Weatherstripping and energy efficiency upgrades' }
    ]
  },
  {
    id: 'cabinets',
    name: 'Cabinets',
    description: 'Custom cabinetry and storage solutions',
    sub_services: [
      { id: 'cabinet-1', name: 'Custom cabinetry design' },
      { id: 'cabinet-2', name: 'Semi-custom cabinet install' },
      { id: 'cabinet-3', name: 'Cabinet refacing and repainting' },
      { id: 'cabinet-4', name: 'Soft-close hardware and pullouts' },
      { id: 'cabinet-5', name: 'Built-in shelving and storage' }
    ]
  },
  {
    id: 'basement-finishing',
    name: 'Basement Finishing',
    description: 'Complete basement renovation services',
    sub_services: [
      { id: 'basement-1', name: 'Framing and drywall' },
      { id: 'basement-2', name: 'Flooring and ceiling finishes' },
      { id: 'basement-3', name: 'Egress windows and code compliance' },
      { id: 'basement-4', name: 'Bathroom or wet bar addition' },
      { id: 'basement-5', name: 'Waterproofing and sump systems' },
      { id: 'basement-6', name: 'Soundproofing walls and ceilings' }
    ]
  },
  {
    id: 'theater-rooms',
    name: 'Theater Rooms',
    description: 'Home theater design and installation',
    sub_services: [
      { id: 'theater-1', name: 'Acoustic wall paneling' },
      { id: 'theater-2', name: 'Projector and screen setup' },
      { id: 'theater-3', name: 'Custom cabinetry and risers' },
      { id: 'theater-4', name: 'LED accent lighting' },
      { id: 'theater-5', name: 'Sound insulation' },
      { id: 'theater-6', name: 'Smart control system integration' }
    ]
  },
  {
    id: 'golf-simulators',
    name: 'Golf Simulators',
    description: 'Indoor golf simulator installation',
    sub_services: [
      { id: 'golf-1', name: 'Framing and impact screen installation' },
      { id: 'golf-2', name: 'Flooring and turf install' },
      { id: 'golf-3', name: 'Electrical and lighting setup' },
      { id: 'golf-4', name: 'Soundproofing and acoustic treatment' },
      { id: 'golf-5', name: 'Ventilation and climate control' }
    ]
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel Install',
    description: 'Solar energy system installation',
    sub_services: [
      { id: 'solar-1', name: 'Roof-mounted solar systems' },
      { id: 'solar-2', name: 'Ground-mount systems' },
      { id: 'solar-3', name: 'Inverter installation' },
      { id: 'solar-4', name: 'Battery backup systems' },
      { id: 'solar-5', name: 'Net metering and permits' }
    ]
  },
  {
    id: 'painting',
    name: 'Interior and Exterior Painting',
    description: 'Professional painting and finishing services',
    sub_services: [
      { id: 'painting-1', name: 'Full-home interior painting' },
      { id: 'painting-2', name: 'Exterior house painting' },
      { id: 'painting-3', name: 'Trim, baseboards and doors' },
      { id: 'painting-4', name: 'Staining (fences, decks, cabinets)' },
      { id: 'painting-5', name: 'Pressure washing and prep work' },
      { id: 'painting-6', name: 'Epoxy garage floors' }
    ]
  },
  {
    id: 'gutters',
    name: 'Gutters',
    description: 'Gutter installation and maintenance',
    sub_services: [
      { id: 'gutter-1', name: 'Gutter installation and replacement' },
      { id: 'gutter-2', name: 'Gutter guard systems' },
      { id: 'gutter-3', name: 'Downspout installation' },
      { id: 'gutter-4', name: 'Gutter cleaning and flushing' },
      { id: 'gutter-5', name: 'Fascia repair' }
    ]
  },
  {
    id: 'mold-remediation',
    name: 'Mold Remediation',
    description: 'Mold inspection and removal services',
    sub_services: [
      { id: 'mold-1', name: 'Mold inspection and air testing' },
      { id: 'mold-2', name: 'Removal and HEPA filtration' },
      { id: 'mold-3', name: 'Crawlspace and attic remediation' },
      { id: 'mold-4', name: 'Moisture barrier installation' },
      { id: 'mold-5', name: 'Structural drying and sealing' }
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC and Air Conditioning',
    description: 'Heating and cooling system services',
    sub_services: [
      { id: 'hvac-1', name: 'Heat pump installation' },
      { id: 'hvac-2', name: 'Ductless mini-split systems' },
      { id: 'hvac-3', name: 'Furnace replacement' },
      { id: 'hvac-4', name: 'Air duct cleaning and sealing' },
      { id: 'hvac-5', name: 'Thermostat installation' },
      { id: 'hvac-6', name: 'Annual service and maintenance' }
    ]
  },
  {
    id: 'water-fire-damage',
    name: 'Water and Fire Damage',
    description: 'Emergency restoration and repair services',
    sub_services: [
      { id: 'water-fire-1', name: 'Water extraction and drying' },
      { id: 'water-fire-2', name: 'Fire damage cleanup and rebuild' },
      { id: 'water-fire-3', name: 'Smoke odor removal' },
      { id: 'water-fire-4', name: 'Structural repairs' },
      { id: 'water-fire-5', name: 'Insurance claim documentation' }
    ]
  },
  {
    id: 'foundation-repair',
    name: 'Foundation Repair',
    description: 'Foundation stabilization and waterproofing',
    sub_services: [
      { id: 'foundation-1', name: 'Crack injection and epoxy sealing' },
      { id: 'foundation-2', name: 'Piering and stabilization' },
      { id: 'foundation-3', name: 'Basement waterproofing' },
      { id: 'foundation-4', name: 'Drainage correction' },
      { id: 'foundation-5', name: 'Crawlspace encapsulation' }
    ]
  },
  {
    id: 'countertops',
    name: 'Countertops',
    description: 'Countertop fabrication and installation',
    sub_services: [
      { id: 'countertop-1', name: 'Quartz fabrication and install' },
      { id: 'countertop-2', name: 'Granite and marble installation' },
      { id: 'countertop-3', name: 'Solid surface and butcher block' },
      { id: 'countertop-4', name: 'Backsplash tile integration' },
      { id: 'countertop-5', name: 'Removal and disposal of old tops' }
    ]
  },
  {
    id: 'landscaping',
    name: 'Lawn and Garden / Landscaping',
    description: 'Complete landscaping and outdoor services',
    sub_services: [
      { id: 'landscape-1', name: 'Sod installation and grading' },
      { id: 'landscape-2', name: 'Irrigation system install' },
      { id: 'landscape-3', name: 'Retaining walls and hardscapes' },
      { id: 'landscape-4', name: 'Planting and mulching' },
      { id: 'landscape-5', name: 'Artificial turf' },
      { id: 'landscape-6', name: 'Outdoor lighting' },
      { id: 'landscape-7', name: 'Pathways and stone patios' }
    ]
  },
  {
    id: 'custom-lighting',
    name: 'Custom Lighting',
    description: 'Interior and exterior lighting design',
    sub_services: [
      { id: 'lighting-1', name: 'Recessed lighting install' },
      { id: 'lighting-2', name: 'Pendant and chandelier installation' },
      { id: 'lighting-3', name: 'Landscape lighting' },
      { id: 'lighting-4', name: 'Smart lighting systems' },
      { id: 'lighting-5', name: 'LED retrofit and dimmers' }
    ]
  },
  {
    id: 'pergola-gazebo',
    name: 'Pergola / Gazebo',
    description: 'Outdoor structure construction',
    sub_services: [
      { id: 'pergola-1', name: 'Custom pergola construction' },
      { id: 'pergola-2', name: 'Wood or metal gazebos' },
      { id: 'pergola-3', name: 'Shade covers and canopies' },
      { id: 'pergola-4', name: 'Lighting and electrical integration' }
    ]
  },
  {
    id: 'outdoor-kitchen',
    name: 'Outdoor Kitchen',
    description: 'Outdoor cooking and dining spaces',
    sub_services: [
      { id: 'outdoor-kitchen-1', name: 'Grill and countertop installation' },
      { id: 'outdoor-kitchen-2', name: 'Stone veneer and masonry work' },
      { id: 'outdoor-kitchen-3', name: 'Sink and plumbing setup' },
      { id: 'outdoor-kitchen-4', name: 'Outdoor refrigeration and storage' },
      { id: 'outdoor-kitchen-5', name: 'Covered patio tie-ins' }
    ]
  },
  {
    id: 'insulation',
    name: 'Insulation',
    description: 'Attic, wall and crawlspace insulation',
    sub_services: [
      { id: 'insulation-1', name: 'Attic insulation (blown-in and batt)' },
      { id: 'insulation-2', name: 'Crawlspace insulation' },
      { id: 'insulation-3', name: 'Wall cavity insulation' },
      { id: 'insulation-4', name: 'Spray foam application' },
      { id: 'insulation-5', name: 'Air sealing and vapor barrier install' }
    ]
  }
]

