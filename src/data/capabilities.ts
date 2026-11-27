export const CAPABILITIES_PATH = "/capabilities";

export const CAPABILITY_LINKS = [
  { slug: "storefront-facades", href: "/capabilities/storefront-facades", label: "Storefronts & facades" },
  { slug: "curved-architectural-cladding", href: "/capabilities/curved-architectural-cladding", label: "Curved cladding" },
  { slug: "custom-staircases-balustrades", href: "/capabilities/custom-staircases-balustrades", label: "Stairs & balustrades" },
  { slug: "display-vitrines-hospitality-ffe", href: "/capabilities/display-vitrines-hospitality-ffe", label: "Vitrines & hospitality FF&E" },
] as const;

export type CapabilitySlug = (typeof CAPABILITY_LINKS)[number]["slug"];
type CapabilityCategory = "Storefronts & Facades" | "Curved Cladding" | "Stairs & Balustrades" | "Display Vitrines & FF&E";

export type CapabilityPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type CapabilityPageData = {
  slug: CapabilitySlug;
  index: number;
  categoryMatch: CapabilityCategory;
  navTitle: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  eyebrow: string;
  lead: string;
  heroImage: CapabilityPhoto;
  scopeTitle: string;
  scopeMatrix: readonly (readonly [assembly: string, alloy: string, finish: string, verification: string])[];
  engineeringTitle: string;
  engineeringHighlights: ReadonlyArray<{ title: string; detail: string }>;
  proofTitle: string;
  workshopProofGallery: ReadonlyArray<{ title: string; description: string; photos: readonly CapabilityPhoto[] }>;
  buyerFaqs: ReadonlyArray<{ question: string; answer: string }>;
  relatedBlogSlugs: readonly string[];
  inquiryProductName: string;
};

export const CAPABILITIES: readonly CapabilityPageData[] = [
  {
    slug: "storefront-facades",
    categoryMatch: "Storefronts & Facades",
    navTitle: "Storefronts & Facades",
    seoTitle: "Custom Metal Storefronts & Backlit Facades",
    seoDescription: "Specify custom metal storefronts, backlit facades and entrance frames. Review subframes, lighting access, corner details and trial-fit options.",
    "h1": "Custom Metal Storefronts & Backlit Facades",
    eyebrow: "Retail facade fabrication",
    lead: "Develop the visible metalwork and its supporting frame together. We fabricate custom storefront surrounds, backlit metal panels and curved entrance frames for architectural and fit-out teams. Set out the corner transitions, glazing interfaces, lighting access and delivery breaks before releasing the fabrication drawings.",
    scopeTitle: "Build the facade from its interfaces",
    scopeMatrix: [
      [
        "Subframes and mounting rails",
        "Structural steel or aluminium profiles to the project design",
        "Protective finish selected for the substrate and exposure",
        "Review fixing locations, frame datums and glazing offsets at the trial fit."
      ],
      [
        "Fluted backlit panels and display surrounds",
        "Formed aluminium or stainless steel sheet",
        "Satin, brushed or specified coated face with a separately selected diffuser",
        "View a representative lit bay from normal approach distances and at the corners."
      ],
      [
        "Curved entrance fascias and portal frames",
        "Formed metal skins on a steel or aluminium subframe",
        "Directional or coated exposed faces with matching returns",
        "Dry-fit the head and posts at full scale to review the joint and fascia alignment."
      ],
      [
        "Corner, sill and jamb closures",
        "Matching face metal or a coordinated combination of substrates",
        "Finish and grain direction agreed across adjoining panels",
        "Check reveals, fastener access and panel removal in the junction detail."
      ]
    ],
    engineeringTitle: "Decisions that shape a storefront package",
    engineeringHighlights: [
      {
        title: "Set independent frame and finish datums",
        detail: "Mark the structural fixing plane, the glazing line and the visible facade plane on the same sections. Identify where adjustment is available and which trim edges need to stay aligned with adjacent trades."
      },
      {
        title: "Trial the lit corner as an assembly",
        detail: "Use a representative bay with the intended metal profile, diffuser and lighting depth. Check the turning corner, jamb and viewing angles together for visible sources, changes in brightness and exposed edges."
      },
      {
        title: "Make service access a drawing requirement",
        detail: "Identify removable panels, fasteners, driver locations and clearance to reach them. Agree which systems are supplied with the metalwork and which connections the site team completes."
      },
      {
        title: "Plan fitting and handling around module breaks",
        detail: "Use the smallest site opening and the turning path to size modules. Coordinate the joint position with the facade grid and agree the protection needed on exposed corners and finished faces."
      }
    ],
    proofTitle: "Workshop framing and an installed lighting example",
    buyerFaqs: [
      {
        question: "What drawings are needed to price a custom storefront?",
        answer: "Send dimensioned elevations and sections showing openings, fixing zones, glazing interfaces and service access. Include the site location, finish references, lighting scope and the delivery route. Identify which dimensions are surveyed and which remain provisional."
      },
      {
        question: "How should a backlit facade sample be reviewed?",
        answer: "Ask for a representative bay with the proposed metal face, diffuser and lighting depth. Review it lit and unlit, from the expected approach and alongside the glass or stone that will sit next to it. Include a corner or seam if it drives the visual effect."
      },
      {
        question: "Can an entrance portal be dry-fitted before dispatch?",
        answer: "Define the trial assembly scope before releasing the drawings. A full-size fit of the posts, curved head and interface trims lets the team check alignment and access while the parts are still in the workshop."
      },
      {
        question: "Which components should remain accessible after installation?",
        answer: "Identify the drivers, connections and fixings that need future access. Agree on removable trim or panels and show the removal direction on the detail drawings so adjacent work leaves the required clearance."
      },
      {
        question: "How do you coordinate finish across corners and returns?",
        answer: "Approve a sample that includes a face, a return and the intended seam. Mark visible grain directions and panel numbering on elevations, then compare the adjoining parts under the lighting expected on site."
      }
    ],
    relatedBlogSlugs: [
      "luxury-metalwork-requirements-designers-owners",
      "metalwork-assembly-fit-out-process-and-quality-control",
      "architectural-metal-finishes-brushed-mirror-hammered-pvd-guide",
      "how-to-prepare-rfq-package-custom-architectural-metalwork"
    ],
    inquiryProductName: "Custom Storefront & Facade Metalwork",
    index: 1,
    heroImage: {
      src: "/images/capabilities/storefront-facades/backlit-retail-corner.webp",
      alt: "Backlit textured facade wrapping a retail corner at dusk",
      caption: "Illuminated panels carry the facade around the corner and define the borders of the display openings.",
      width: 1551,
      height: 1193
    },
    workshopProofGallery: [
      {
        title: "Frame layout and transport staging",
        description: "Workshop and yard photographs illustrate repeated bays, frame intersections and rectangular members on supports.",
        photos: [
          {
            src: "/images/capabilities/storefront-facades/facade-workshop-subframe.webp",
            alt: "Large metal facade subframe supported across workshop stands",
            caption: "The assembly spans several supports, exposing the perimeter members and repeated transverse bays.",
            width: 1600,
            height: 1128
          },
          {
            src: "/images/capabilities/storefront-facades/facade-subframe-junction.webp",
            alt: "Close view of joined longitudinal and transverse facade frame members",
            caption: "The frame intersection shows how multiple rows of profiles meet before the exposed face is clad.",
            width: 1600,
            height: 1128
          },
          {
            src: "/images/capabilities/storefront-facades/facade-module-fit-up.webp",
            alt: "Technician moving between rectangular bays of a facade frame",
            caption: "An assembly view shows the repeated openings and cross members of a large facade frame.",
            width: 1600,
            height: 1128
          },
          {
            src: "/images/capabilities/storefront-facades/frame-members-staged.webp",
            alt: "Long rectangular metal frame members staged on blocking in a yard",
            caption: "Rectangular tube members are laid out on blocking with the applied tabs still visible.",
            width: 1600,
            height: 1008
          }
        ]
      },
      {
        title: "Illuminated corner and display surrounds",
        description: "A separate installed storefront illustrates how lit panels carry the visual rhythm across the corner and around the display openings.",
        photos: [
          {
            src: "/images/capabilities/storefront-facades/backlit-retail-corner.webp",
            alt: "Backlit textured facade wrapping a retail corner at dusk",
            caption: "Illuminated panels carry the facade around the corner and define the borders of the display openings.",
            width: 1551,
            height: 1193
          }
        ]
      }
    ]
  },
  {
    slug: "curved-architectural-cladding",
    categoryMatch: "Curved Cladding",
    navTitle: "Curved Cladding",
    seoTitle: "Double-Curved Stainless Steel & Escalator Cladding",
    seoDescription: "Specify double-curved stainless steel column cladding and custom escalator skins. Review finish, seam placement and full-scale fit-up before release.",
    "h1": "Double-Curved Column & Escalator Cladding",
    eyebrow: "Compound-curved metal fabrication",
    lead: "We fabricate curved architectural skins for column enclosures, escalator surrounds and soffits. The project starts with the intended surface and verified interface dimensions. From there, define workable panel breaks, a support frame and a finish reference that can be checked across adjoining sections during a workshop fit-up.",
    scopeTitle: "Match the panel system to the geometry",
    scopeMatrix: [
      [
        "Lobed or tapered column shells",
        "Stainless steel sheet over a dedicated support frame",
        "Directional satin finish with grain agreed across adjoining panels",
        "Stand representative sections upright and review the recessed joints under directional light."
      ],
      [
        "Fluted escalator soffits and end pods",
        "Formed metal sheet on a project-specific frame",
        "Champagne-toned or other approved finish matched to a formed sample",
        "Dry-fit the transition between the incline and end pod and review the flute alignment."
      ],
      [
        "Curved wall and soffit lining",
        "Stainless steel or aluminium sheet selected for the location",
        "Brushed, satin or coated faces confirmed against a project sample",
        "Compare the curved sections against their templates and review the seams at the access points."
      ],
      [
        "Recessed seams and concealed backing",
        "Formed panel returns on steel or aluminium supports",
        "Visible edge finish agreed with the face sample",
        "Review joint width, support position and fastener access before closing the trial assembly."
      ]
    ],
    engineeringTitle: "Control the shape before checking the finish",
    engineeringHighlights: [
      {
        title: "Develop panel breaks from the surface",
        detail: "Use the model and sections to mark changing curvature, viewing lines and access limits. Check formed sections against templates at the difficult transitions, particularly where flutes must turn around a rounded end."
      },
      {
        title: "Tie the skin back to an adjustable frame",
        detail: "Review ring positions, returns and fixing locations on the dry-fit. Give narrow seams a stable backing and record how the installer can reach the fixings before the last panel closes the run."
      },
      {
        title: "Compare finished neighbours under directional light",
        detail: "Stand upright shells at their intended orientation and use grazing light to reveal surface waviness, uneven reflections and misaligned seams. Mark the agreed grain direction and retain a formed finish sample."
      },
      {
        title: "Coordinate the escalator casing with its supplier",
        detail: "Confirm the equipment envelope, fixings and service zones against the supplier drawings. Check the path of the cladding around the inclined run and end pod before finalising the decorative module breaks."
      }
    ],
    proofTitle: "Full-height shells and curved escalator skins",
    buyerFaqs: [
      {
        question: "What files help a fabricator price double-curved cladding?",
        answer: "Send the current surface model with dimensioned plans and sections. Identify the section datums, connection points, panel-break restrictions, visible seam preferences and any parts of the site geometry still awaiting survey."
      },
      {
        question: "How do you review satin stainless on a curved surface?",
        answer: "Check a formed sample under the intended lighting and mark its grain direction. Include an adjoining panel or seam on the sample when the continuity of the reflection matters more than the appearance of a single flat coupon."
      },
      {
        question: "Which escalator dimensions are needed before design approval?",
        answer: "Provide the equipment supplier’s envelope, support and fixing details, landing levels and inspection zones. Confirm which interfaces the cladding contractor must coordinate with the equipment and adjacent glass or ceiling teams."
      },
      {
        question: "What should a 1:1 trial include?",
        answer: "Choose the most difficult representative transition, with its supporting frame and adjoining finished surfaces. Agree the sightline, seam, handling and fastener checks the trial should resolve before packing."
      },
      {
        question: "Can transport access affect the panel breaks?",
        answer: "Yes. Provide the delivery route, crate limits, service lift size and turning space early. Review those limits alongside panel stiffness, joint location and the fitting sequence."
      }
    ],
    relatedBlogSlugs: [
      "why-1-to-1-factory-trial-assembly-matters-curved-metalwork",
      "metalwork-welding-process-and-quality-control",
      "stainless-steel-304-vs-316l-brass-bronze-commercial-projects",
      "architectural-metalwork-packing-crating-guide"
    ],
    inquiryProductName: "Curved Architectural Cladding",
    index: 2,
    heroImage: {
      src: "/images/capabilities/curved-architectural-cladding/full-height-column-light-check.webp",
      alt: "Curved stainless steel column shells standing beside vertical inspection lights in the workshop",
      caption: "The mock-ups stand at full height beside rows of work lights so fabricators can review changing reflections across the curved skins.",
      width: 1600,
      height: 1200
    },
    workshopProofGallery: [
      {
        title: "Upright column trial and seam detail",
        description: "From the ring frame to the directional light check, the photographs show the support, curved skin and recessed joint as separate areas to review.",
        photos: [
          {
            src: "/images/capabilities/curved-architectural-cladding/column-ring-subframe.webp",
            alt: "Exposed internal framework inside a scaffolded column trial assembly",
            caption: "Internal rings and uprights establish the shape of the column cladding behind its outer skin.",
            width: 900,
            height: 1600
          },
          {
            src: "/images/capabilities/curved-architectural-cladding/full-height-column-light-check.webp",
            alt: "Curved stainless steel column shells standing beside vertical inspection lights in the workshop",
            caption: "The mock-ups stand at full height beside rows of work lights so fabricators can review changing reflections across the curved skins.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/curved-architectural-cladding/satin-column-seam.webp",
            alt: "Horizontal seams meeting a recessed vertical joint in curved satin stainless steel",
            caption: "The seam close-up shows the relationship between the recessed vertical joint, panel edges and directional finish.",
            width: 1200,
            height: 1600
          }
        ]
      },
      {
        title: "Formed flutes, fit-up and atrium installation",
        description: "The escalator sequence shows a bare formed panel, the curved end pod, the suspended workshop fit-up and the installed casing in an atrium.",
        photos: [
          {
            src: "/images/capabilities/curved-architectural-cladding/bare-fluted-escalator-panel.webp",
            alt: "Unfinished curved escalator panel with parallel flutes on a workshop bench",
            caption: "Before finishing, the changing flute line and the bench-supported panel edge can be examined together.",
            width: 1600,
            height: 900
          },
          {
            src: "/images/capabilities/curved-architectural-cladding/champagne-fluted-end-pod.webp",
            alt: "Champagne-toned escalator end pod with flutes wrapping the compound curve",
            caption: "The workshop fit-up shows the flutes wrapping the curved nose and tapering into the smooth fascia.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/curved-architectural-cladding/suspended-escalator-trial.webp",
            alt: "Full-length fluted escalator cladding suspended for workshop fit-up",
            caption: "The full-scale fit-up makes the transition between the rounded end, inclined run and fluted underside visible.",
            width: 900,
            height: 1600
          },
          {
            src: "/images/capabilities/curved-architectural-cladding/atrium-escalator-cladding.webp",
            alt: "Stacked escalator runs with champagne-toned cladding and glass balustrades in an atrium",
            caption: "The installed atrium shows where smooth fascia and fluted soffit panels meet along the inclined runs.",
            width: 853,
            height: 1280
          }
        ]
      }
    ]
  },
  {
    slug: "custom-staircases-balustrades",
    categoryMatch: "Stairs & Balustrades",
    navTitle: "Stairs & Balustrades",
    seoTitle: "Custom Helical Metal Staircases & Curved Balustrades",
    seoDescription: "Fabricate helical steel stairs, curved stainless handrails and long-run balustrades. Review riser geometry, landing interfaces and full-scale workshop fit.",
    "h1": "Custom Helical Metal Staircases & Curved Balustrades",
    eyebrow: "Stair Fabrication & Railing Systems",
    lead: "Architectural steel stairs, curved handrails and long-run balustrades reach the site through shop drawings that agree on the finished geometry. Guoyao Metal fabricates the steel stair frame, formed rail profiles or complete railing runs to the agreed package. A full-scale shop fit gives the project team a place to check the sweep, returns, supports and joints before the sections are packed.",
    scopeTitle: "Stair and railing assemblies by project scope",
    scopeMatrix: [
      [
        "Helical or curved stair frame",
        "Structural steel to the project engineer's specification",
        "Architectural metal cladding or specified coating",
        "Check the frame against approved stair geometry, finished floor levels and support interfaces"
      ],
      [
        "Curved or helical handrail with returns",
        "Stainless steel tube or formed profile",
        "Directional brush or polished finish to sample",
        "Compare the rail path, profile continuity and termination on a full-scale fit or representative trial segment"
      ],
      [
        "Long-run atrium balustrade",
        "Stainless steel posts, infill and rail profiles",
        "Brushed stainless steel or specified coating system",
        "Check layout on a floor jig, including post spacing, plate positions, joint access and rail continuity"
      ],
      [
        "Baseplates, brackets and landing transitions",
        "Steel or stainless steel to agreed load and exposure requirements",
        "Specified coating or blended finish at exposed welds",
        "Check the connection against surveyed datums and engineer-approved fixing details"
      ]
    ],
    engineeringTitle: "Four checks that keep a stair and railing aligned",
    engineeringHighlights: [
      {
        title: "Establish the stair line at finished levels",
        detail: "Coordinate the stair model with finished tread and landing levels, the intended path of the rail and the point where each support meets the structure. Flag any finish buildup before the fabricator sets out post heights or starts rolling the handrail."
      },
      {
        title: "Develop the formed profile with its returns",
        detail: "The rail changes elevation as it curves in plan, so the section profile and the end return need to be reviewed together. Check the seam and grain direction on a formed sample, especially where a polished or brushed face runs into a scroll or a landing turn."
      },
      {
        title: "Lay out long runs using common datums",
        detail: "Set the baseplates and sections to a shared datum before judging the top line. Checking each section in isolation can hide a cumulative shift at a spliced curve. Keep the trial assembly convertible into handling and installation sections."
      },
      {
        title: "Review weld access before finish approval",
        detail: "Mark exposed and concealed connections separately on the drawings. Show the buyer a sample of the finish around a bracket, dressed base joint or rail splice so the proposed appearance can be compared to the approved finish."
      }
    ],
    proofTitle: "Workshop evidence from formed rail to trial fit",
    buyerFaqs: [
      {
        question: "Can the railing package be quoted separately from the stair frame?",
        answer: "Yes. Identify which steel, treads or stone finishes are provided by others and which party supplies the brackets, baseplates and cladding. For a separate rail package, include the latest surveyed support coordinates and finished levels so the interfaces can be priced."
      },
      {
        question: "What drawings are needed for a curved stair quotation?",
        answer: "Send a dimensioned plan, continuous elevation, sections through the landings, a 3D file when available and the finish schedule. Show the first and last tread elevations, the rail path on both sides, support conditions and the access route from delivery point to installation position."
      },
      {
        question: "What should we approve during a full-scale rail trial?",
        answer: "Agree beforehand which run or complete assembly is included. Inspect the curve, returns, rail height relative to the finished tread line, post and baseplate alignment, splice locations and the appearance of the dressed welds. Record who approves geometry, finish and structural details."
      },
      {
        question: "How should a long curved balustrade be divided for shipment?",
        answer: "Base the breaks on the largest sections that can pass the access route and be safely lifted, then coordinate the splice and joining access with the installer. Mark piece numbers on the layout and the packing list so the site team can rebuild the verified sequence."
      },
      {
        question: "Who confirms guard loads, opening sizes and anchor design?",
        answer: "The project's architect and structural engineer set the applicable requirements and approve the connection details. Include their design criteria and the receiving substrate in the RFQ so fabrication and finishing can be coordinated with the approved design."
      }
    ],
    relatedBlogSlugs: [
      "why-1-to-1-factory-trial-assembly-matters-curved-metalwork",
      "metalwork-welding-process-and-quality-control",
      "stainless-steel-304-vs-316l-brass-bronze-commercial-projects",
      "metalwork-assembly-fit-out-process-and-quality-control"
    ],
    inquiryProductName: "Custom Staircases & Balustrades",
    index: 3,
    heroImage: {
      src: "/images/capabilities/custom-staircases-balustrades/stair-handrail-full-scale-fit.webp",
      alt: "Four curved metal handrail runs on an unfinished stair mock-up in the workshop",
      caption: "Workshop trial fit shows four curved runs on the stair frame and how their profiles meet the outer balustrade panels.",
      width: 1600,
      height: 1200
    },
    workshopProofGallery: [
      {
        title: "Formed handrails and end returns",
        description: "Unassembled stock, a close-up of the scroll and fitted terminations show how the section transitions from the straight hand contact face into a curved return.",
        photos: [
          {
            src: "/images/capabilities/custom-staircases-balustrades/formed-handrail-stock.webp",
            alt: "Formed curved metal handrail sections laid on a workshop floor",
            caption: "The loose sections show several formed profiles before they are fitted to the stair frame.",
            width: 1200,
            height: 1600
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/brushed-handrail-scroll.webp",
            alt: "Close-up of a brushed metal handrail ending in a rolled scroll",
            caption: "The enlarged view shows the directional brush marks following the top profile into the rolled handrail termination.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/curved-handrail-terminations.webp",
            alt: "Curving metal handrails with rolled scroll terminations trial-fitted to posts",
            caption: "The fitted returns show how the rail profiles turn down toward the last posts.",
            width: 1600,
            height: 1200
          }
        ]
      },
      {
        title: "Full-scale curved stair mock-up",
        description: "The front and oblique workshop views show how the same assembly reads from the stair foot and from the outside of the turn.",
        photos: [
          {
            src: "/images/capabilities/custom-staircases-balustrades/stair-handrail-full-scale-fit.webp",
            alt: "Four curved metal handrail runs on an unfinished stair mock-up in the workshop",
            caption: "Workshop trial fit shows four curved runs on the stair frame and how their profiles meet the outer balustrade panels.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/stair-handrail-oblique-fit.webp",
            alt: "Oblique view of a full-scale stair mock-up with curved handrails and balustrade panels",
            caption: "This side view shows how the handrail rises from the stair foot and follows the curved edge across the unfinished steps.",
            width: 1600,
            height: 1200
          }
        ]
      },
      {
        title: "Long-run railing layout and joint finishing",
        description: "Floor jigs and complete runs show the alignment of the balustrade. Closer views show the baseplates, bracket junction and finishing access while the sections remain supported.",
        photos: [
          {
            src: "/images/capabilities/custom-staircases-balustrades/balustrade-floor-layout.webp",
            alt: "Two curved balustrade runs held on a metal workshop layout frame",
            caption: "A floor jig holds the curved runs and reveals how their edges align along the sweep.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/long-run-balustrade-fit.webp",
            alt: "A long run of metal balustrade panels lined up across the workshop",
            caption: "The assembled run shows the continuity of the pickets and rail across multiple sections.",
            width: 1600,
            height: 900
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/curved-balustrade-baseplates.webp",
            alt: "Curved balustrade with pickets and regularly spaced bolted baseplates",
            caption: "The jig keeps the edges accessible so post spacing, plate positions and the curvature can be checked together.",
            width: 1200,
            height: 1600
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/handrail-bracket-weld.webp",
            alt: "Close-up of a tubular return bracket welded to the underside of a metal handrail",
            caption: "The workshop detail shows the weld at the bracket-to-rail junction and the access available before final finishing.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/custom-staircases-balustrades/balustrade-base-weld-finishing.webp",
            alt: "Technician working along the welded base joints of a metal balustrade",
            caption: "With the section held on its workshop jig, the technician can dress each exposed base joint along the run.",
            width: 1600,
            height: 900
          }
        ]
      }
    ]
  },
  {
    slug: "display-vitrines-hospitality-ffe",
    categoryMatch: "Display Vitrines & FF&E",
    navTitle: "Display Vitrines & FF&E",
    seoTitle: "Custom Brass Display Vitrines & Hospitality FF&E",
    seoDescription: "Specify illuminated brass vitrines, fluted counters and hotel FF&E. Review glass junctions, finish samples, driver access and workshop dry-fit.",
    "h1": "Custom Brass Display Vitrines & Hospitality Metalwork",
    eyebrow: "Bespoke Fixtures & Display Joinery",
    lead: "Guoyao Metal fabricates custom glazed display vitrines, brass-clad counters and architectural fixtures for retail and hotel interiors. Develop the exposed metalwork, glass line, worktop and lighting access as one assembly. Workshop dry-fit and light checks make finish junctions, service access and visible reflections easier to review before the fixture reaches site.",
    scopeTitle: "Specify the fixture, substrate and visible finish together",
    scopeMatrix: [
      [
        "Glazed illuminated display vitrine",
        "Brass facing or bronze-finish metal frame with specified glazing",
        "Hammered, brushed or patinated metal to approved sample",
        "Dry-fit glass and corner joints, then review light distribution, reflections and driver access"
      ],
      [
        "Curved reception or service counter",
        "Formed brass sheet or specified metal facing on a support carcass",
        "Fluted champagne-brass finish with agreed protective treatment",
        "Review rib alignment at curved returns, worktop cut-outs and service-side access"
      ],
      [
        "Display tower or freestanding island",
        "Stainless steel or fabricated metal shell on a supporting frame",
        "Satin-brushed silver or agreed bronze finish",
        "Check plinth alignment, continuous shadow joints, top levels and stability with the specified support"
      ],
      [
        "Hotel lobby cabinetry and counters",
        "Specified metal facing with coordinated timber or stone interfaces",
        "Brushed or textured brass trim alongside lacquered or stone surfaces",
        "Dry-fit adjoining materials and check access, installation splits and edge protection"
      ]
    ],
    engineeringTitle: "Details to resolve before ordering a fixture",
    engineeringHighlights: [
      {
        title: "Bring the texture and glass into one corner sample",
        detail: "Approve the mitre, the width of the metal reveal and the visible glass edge under the intended viewing light. A hammered surface can make the boundary of a corner read differently from a smooth brass sample, particularly at the eye-level edge of a vitrine."
      },
      {
        title: "Follow the flute pitch around the returns",
        detail: "Mark the reference face for the flutes, then decide where they stop at a recessed work zone, plinth or countertop. Check a curved return on the workshop assembly to see how the rhythm reads on both sides of the fixture."
      },
      {
        title: "Test the lit case with accessible components",
        detail: "Set the planned diffuser and light position against the actual glass and frame. Inspect the display with the lights on and off at the buyer's normal viewing height, and show how a technician reaches the driver or light source after installation."
      },
      {
        title: "Dry-fit metal, stone and joinery as adjacent trades",
        detail: "Coordinate stone edges, joinery finish, cable routes and removable panels before the metal faces are closed. Confirm which party supplies and installs each material, and define lift and crate splits without exposing finished corners to handling damage."
      }
    ],
    proofTitle: "Workshop views of four distinct fixture types",
    buyerFaqs: [
      {
        question: "When should we choose solid brass over a brass-toned finish on another metal?",
        answer: "Tell the fabricator the intended ageing, touch exposure, cleaning method and budget. Order solid brass or brass facing when the material and its patina are part of the brief. If the approved look can be achieved with a specified coating or plated finish, compare a formed sample and confirm how edges and future repairs would be handled."
      },
      {
        question: "How do we assess lighting and reflections before delivery?",
        answer: "Agree glass type, display position, diffuser, colour appearance and dimming requirements before the trial. Inspect the powered assembly from the buyer's viewing side with the intended object or a representative sample. Confirm where the driver and connectors can be reached for maintenance."
      },
      {
        question: "Can one fixture combine brass, stone and lacquered joinery?",
        answer: "Yes, the technical package should define the interface between them. Submit a stone schedule and edge profile, joinery drawing, hardware and finished floor datum. Confirm who supplies each component and whether heavy or fragile items ship separately."
      },
      {
        question: "Which items matter most in a vitrines and FF&E quotation?",
        answer: "Share fixture elevations, display use, opening direction, glass specification, power and cable entry, finish samples and installation access. List items supplied by other trades, such as stone, finished lighting controls or on-site connection work."
      },
      {
        question: "What is useful to sign off on a workshop dry-fit?",
        answer: "Agree the visible colour and texture reference, alignment of flutes or hammered panels at the edges, glass reveals, door operation, wiring and assembly splits. Record project-specific acceptance and packaging requirements before the visible components are wrapped."
      }
    ],
    relatedBlogSlugs: [
      "architectural-metal-finishes-brushed-mirror-hammered-pvd-guide",
      "luxury-metalwork-requirements-designers-owners",
      "architectural-metalwork-packing-crating-guide",
      "how-to-prepare-rfq-package-custom-architectural-metalwork"
    ],
    inquiryProductName: "Display Vitrines & Hospitality FF&E",
    index: 4,
    heroImage: {
      src: "/images/capabilities/display-vitrines-hospitality-ffe/fluted-brass-counter.webp",
      alt: "Curved champagne-brass fluted counter with a dark top in the workshop",
      caption: "The workshop view shows the fluted cladding following the curved end and meeting the dark countertop.",
      width: 1600,
      height: 1200
    },
    workshopProofGallery: [
      {
        title: "Fluted counter and service recess",
        description: "Three workshop views follow the change from the public face to the service side, including the dark countertop and fluted curved returns.",
        photos: [
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/fluted-brass-counter.webp",
            alt: "Curved champagne-brass fluted counter with a dark top in the workshop",
            caption: "The workshop view shows the fluted cladding following the curved end and meeting the dark countertop.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/fluted-counter-recess.webp",
            alt: "Rounded brass-fluted counter end beside a recessed work area",
            caption: "The recess and the rounded return show how the rib spacing continues at the opening.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/fluted-counter-rear.webp",
            alt: "Back of a fluted brass counter with an open storage recess and a dark top",
            caption: "This rear view shows the clear opening behind the fluted outer corners and the cut-outs in the worktop.",
            width: 1600,
            height: 1200
          }
        ]
      },
      {
        title: "Display tower and illuminated bronze-finish vitrine",
        description: "A tall tower shows the vertical frame and plinth, while a separate glazed unit is photographed during a lighting trial.",
        photos: [
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/tall-bronze-display-tower.webp",
            alt: "Tall bronze-finish display tower being fitted in a workshop",
            caption: "The tall metal frame stands on its fitted plinth. The intermediate display zones and top enclosure are visible.",
            width: 742,
            height: 1600
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/lit-bronze-display-vitrine.webp",
            alt: "Glazed bronze-finish display vitrine glowing on its plinth during workshop testing",
            caption: "The lighting trial lets the team inspect the display chamber and its relationship to the glazing and frame.",
            width: 742,
            height: 1600
          }
        ]
      },
      {
        title: "Satin display island and hammered brass details",
        description: "The island views show its shaped shells and shadow joint. Separate workshop images record the textured mitre and lighting check on a glazed brass vitrine.",
        photos: [
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/satin-metal-display-island.webp",
            alt: "Satin silver display island with rounded metal shells and several display surfaces",
            caption: "The workshop assembly shows the scooped and rounded shells supporting display tops of different heights.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/satin-island-base-detail.webp",
            alt: "Satin silver curved panels with dark joint lines above the display island plinth",
            caption: "The low view shows the narrow recessed line between the curved shells and their base.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/hammered-brass-mitre.webp",
            alt: "Close-up of a mitred hammered brass corner around a glazed display case",
            caption: "The joint brings two textured brass faces together where the case frame meets the glass.",
            width: 1600,
            height: 1200
          },
          {
            src: "/images/capabilities/display-vitrines-hospitality-ffe/lit-hammered-brass-vitrine.webp",
            alt: "Hammered brass glazed vitrine lit on the workshop floor",
            caption: "The illuminated tray sits inside the glazed brass frame for a workshop lighting check.",
            width: 1600,
            height: 1200
          }
        ]
      }
    ]
  }
];

export const CAPABILITIES_OVERVIEW = {
  seoTitle: "Custom Architectural Metalwork Manufacturer in China",
  seoDescription: "Explore custom metal facades, curved cladding, feature stairs and display vitrines from Guoyao Metal, with real fabrication and factory trial assemblies.",
  h1: "Custom architectural metalwork",
  lead: "Guoyao Metal fabricates architectural metalwork in Guangzhou for retail, hospitality and commercial interiors. Explore the assemblies we build, the details we check in the workshop, and the information that helps us assess your brief.",
  inquiryProductName: "Custom Architectural Metalwork",
  heroImage: {
    src: "/images/capabilities/curved-architectural-cladding/atrium-escalator-cladding.webp",
    alt: "Champagne-toned fluted cladding tracing stacked escalators in a multilevel atrium",
    caption: "Fluted escalator cladding in a multi-level atrium",
    width: 853,
    height: 1280,
  },
} as const;

export function capabilityPath(slug: CapabilitySlug) {
  return `${CAPABILITIES_PATH}/${slug}`;
}

export function getCapabilityBySlug(slug: string) {
  return CAPABILITIES.find((capability) => capability.slug === slug);
}
