export interface Disaster {
    slug: string;
    title: string;
    description: string;
    image: string;
    fullContent: string;
    tips: {
        before: string[];
        during: string[];
        after: string[];
    };
}``

export const disasters: Disaster[] = [
    {
        slug: "earthquake",
        title: "Earthquake",
        description: "Sudden shaking of the ground caused by the passage of seismic waves through Earth's rocks.",
        image: "/disaster/Earthquake.jpg",
        fullContent: `An earthquake is an intense shaking of Earth's surface. The shaking is caused by movements in Earth's outermost layer.

## Why do earthquakes happen?

Although the Earth looks like a pretty solid place from the surface, it's actually extremely active just below the surface. The Earth is made of four basic layers: a solid crust, a hot, nearly solid mantle, a liquid outer core and a solid inner core.

The solid crust and top, stiff layer of the mantle make up a region called the lithosphere. The lithosphere isn't a continuous piece that wraps around the whole Earth like an eggshell. It's actually made up of giant puzzle pieces called tectonic plates. Tectonic plates are constantly shifting as they drift around on the viscous, or slowly flowing, mantle layer below.

This non-stop movement causes stress on Earth's crust. When the stresses get too large, it leads to cracks called faults. When tectonic plates move, it also causes movements at the faults. An earthquake is the sudden movement of Earth's crust at a fault line.`,
        tips: {
            before: [
                "Secure heavy items like bookcases and TVs to the wall.",
                "Practice 'Drop, Cover, and Hold On' drills with family.",
                "Create a family emergency communications plan.",
                "Prepare a disaster supply kit with food, water, and meds.",
            ],
            during: [
                "Drop down onto your hands and knees.",
                "Cover your head and neck with your arms.",
                "Hold on to any sturdy shelter until the shaking stops.",
                "Stay away from glass, windows, outside doors and walls.",
            ],
            after: [
                "Expect aftershocks to follow the main shock.",
                "Check yourself and others for injuries.",
                "Look for and extinguish small fires.",
                "Listen to a battery-operated radio for latest emergency information.",
            ],
        },
    },
    {
        slug: "flood",
        title: "Flood",
        description: "An overflow of water that submerges land that is usually dry.",
        image: "/disaster/Flood.jpg",
        fullContent: `Flooding is a temporary overflow of water onto land that is normally dry. Floods are the most common natural disaster in the United States. Failing to evacuate flooded areas or entering flood waters can lead to injury or death.

## Causes of Floods

Floods can happen during heavy rains, when ocean waves come on shore, when snow melts too fast, or when dams or levees break. Damaging flooding may happen with only a few inches of water, or it may cover a house to the rooftop. Floods can happen quickly or over a long period and may last days, weeks, or longer.`,
        tips: {
            before: [
                "Determine your best protection for flood waters.",
                "Elevate the furnace, water heater, and electric panel if you live in an area that has a high flood risk.",
                "Consider installing check valves in sewer traps.",
                "Seal walls in basements with waterproofing compounds.",
            ],
            during: [
                "Evacuate immediately if told to do so.",
                "Move to higher ground or a higher floor.",
                "Do not walk, swim, or drive through flood waters. Turn Around, Don't Drown!",
                "Stay off bridges over fast-moving water.",
            ],
            after: [
                "Return home only when authorities say it is safe.",
                "Avoid wading in floodwater, which can contain dangerous debris and contamination.",
                "Be aware of the risk of electrocution.",
                "Photograph damage to your property for insurance purposes.",
            ],
        },
    },
    {
        slug: "wildfire",
        title: "Wildfire",
        description: "Unplanned fire burning in natural covering vegetation like forest, grassland or prairie.",
        image: "https://images.unsplash.com/photo-1465220183275-1faa863377e3?q=80&w=2074&auto=format&fit=crop",
        fullContent: `Wildfires are unplanned burns in rock, brush, or timber. They can start from natural causes, such as lightning, but most are caused by humans, either accidentally or intentionally.

Wildfires can spread quickly, burning brush, trees, and homes. They can also affect air quality with smoke and ash.`,
        tips: {
            before: [
                "Create a defensible space around your home by clearing brush/leaves.",
                "Use fire-resistant materials for building.",
                "Have an evacuation plan ready.",
                "Sign up for your community's warning system.",
            ],
            during: [
                "Evacuate immediately if authorities tell you to do so.",
                "If trapped, call 911 and give your location.",
                "Turn on lights so people can see your house in the smoke.",
                "Listen to EAS, NOAA Weather Radio, or local alerting systems.",
            ],
            after: [
                "Do not return home until authorities say it is safe.",
                "Be careful of hot spots or smoldering debris.",
                "Wear a dust mask and protective clothing when cleaning up.",
                "Check the roof and exterior for sparks or embers.",
            ],
        },
    },
    {
        slug: "hurricane",
        title: "Hurricane",
        description: "A tropical cyclone with winds of 74 mph (119 km/h) or greater.",
        image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1974&auto=format&fit=crop",
        fullContent: `Hurricanes are massive storm systems that form over warm ocean waters and move toward land. Potential threats from hurricanes include powerful winds, heavy rainfall, storm surges, coastal and inland flooding, rip currents, tornadoes, and landslides.`,
        tips: {
            before: [
                "Know your evacuation zone.",
                "Secure your home: close storm shutters and secure outdoor objects.",
                "Make sure you have enough fuel for your car.",
                "Review your insurance policies.",
            ],
            during: [
                "Stay indoors and away from windows and glass doors.",
                "Close all interior doors—secure and brace external doors.",
                "Keep curtains and blinds closed.",
                "Take refuge in a small interior room, closet, or hallway on the lowest level.",
            ],
            after: [
                "Stay out of floodwaters.",
                "Never use a generator inside your home or garage.",
                "Do not drive through flooded water.",
                "Listen to local officials for updates and instructions.",
            ],
        },
    },
    {
        slug: "tornado",
        title: "Tornado",
        description: "A violently rotating column of air extending from a thunderstorm to the ground.",
        image: "/disaster/Tornado.jpg",
        fullContent: `Tornadoes are violently rotating columns of air that extend from a thunderstorm to the ground. Tornadoes can destroy buildings, flip cars, and create deadly flying debris.`,
        tips: {
            before: [
                "Identify a safe place in your home (storm cellar, basement, or interior room).",
                "Practice tornado drills.",
                "Remove dead or rotting trees and branches that could fall.",
                "Keep your NOAA Weather Radio charged.",
            ],
            during: [
                "Go to your safe room/basement immediately.",
                "If you are outside, find a low-lying area (ditch) and cover your head.",
                "Do not stay in a mobile home.",
                "Protect your head and neck with your arms and put materials such as furniture and blankets around or on top of you.",
            ],
            after: [
                "Stay away from power lines and puddles with wires in them.",
                "Watch out for fallen trees and debris.",
                "Do not enter damaged buildings until they are inspected.",
                "Use battery-powered flashlights, not candles.",
            ],
        },
    },
];
