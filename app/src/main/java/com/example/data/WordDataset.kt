package com.example.data

object WordDataset {

    val pairs: List<WordPair> = listOf(
        // ==========================================
        // 1. CONCEPTS & WEATHER
        // ==========================================
        WordPair(
            mainWord = "Thunderstorm",
            imposterWord = "Power Outage",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "consequence & shared setting",
            imposterHint = "Candles come out of the kitchen drawer",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Blizzard",
            imposterWord = "Snow Day",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "shared experience",
            imposterHint = "Waking up early just to check the morning news announcement",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Heatwave",
            imposterWord = "Broken Air Conditioner",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "associated misery",
            imposterHint = "Sleeping on top of the sheets with all windows wide open",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Rainbow",
            imposterWord = "Puddle",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "aftermath & shared setting",
            imposterHint = "Everyone in the street pauses and looks outside through the window",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Fog",
            imposterWord = "Lighthouse",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "functional connection",
            imposterHint = "Headlights suddenly feel completely useless",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Autumn",
            imposterWord = "Rake",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "associated object & chore",
            imposterHint = "A crisp morning scent and big brown paper bags on the curb",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Eclipse",
            imposterWord = "Cardboard Glasses",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "associated object & occasion",
            imposterHint = "Coworkers wandering outside into the parking lot together for three minutes",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Morning Dew",
            imposterWord = "Barefoot",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "sensory experience",
            imposterHint = "Cold wet socks when stepping onto the lawn before breakfast",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Tornado",
            imposterWord = "Basement",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "shared emergency setting",
            imposterHint = "A deafening siren followed by the sound of a freight train approaching",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Sunrise",
            imposterWord = "Rooster",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "associated creature & moment",
            imposterHint = "The neighborhood is completely silent except for the first coffee maker humming",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Avalanche",
            imposterWord = "St. Bernard",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "associated rescue symbol",
            imposterHint = "A distant cracking roar on a steep alpine slope",
            difficulty = VocabularyLevel.ADVANCED
        ),
        WordPair(
            mainWord = "Hail",
            imposterWord = "Dent",
            category = GameCategory.CONCEPTS_WEATHER,
            relationshipType = "consequence",
            imposterHint = "Running outside with a blanket to throw over the windshield",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 2. POP CULTURE & MEDIA
        // ==========================================
        WordPair(
            mainWord = "Movie Theater",
            imposterWord = "Popcorn Bucket",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "associated experience",
            imposterHint = "Sticky floors and 20 minutes of coming attractions",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Rock Concert",
            imposterWord = "Guitar Pick",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "associated object & souvenir",
            imposterHint = "Ringing ears and losing your voice the next morning",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Binge Watching",
            imposterWord = "Next Episode Button",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "functional trigger",
            imposterHint = "Suddenly realizing it is 3:00 AM on a Sunday",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Red Carpet",
            imposterWord = "Flashbulb",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "associated sensory environment",
            imposterHint = "Dozens of photographers shouting names over velvet ropes",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Streaming Service",
            imposterWord = "Password Sharing",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "social habit",
            imposterHint = "Spending 40 minutes scrolling through menus without picking anything",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Comic Con",
            imposterWord = "Cardboard Armor",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "associated craft & occasion",
            imposterHint = "Taking photos with strangers in elaborate handmade foam outfits",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Podcast",
            imposterWord = "Wireless Earbuds",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "associated hardware",
            imposterHint = "Doing dishes or commuting while two hosts chat about mysteries",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Video Game",
            imposterWord = "Rage Quit",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "emotional reaction",
            imposterHint = "Tapping buttons harder won't make your character move faster",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Album Drop",
            imposterWord = "Midnight",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "event timing",
            imposterHint = "Everyone updating their social stories with the exact same track screenshot",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Cliffhanger",
            imposterWord = "Season Finale",
            category = GameCategory.POP_CULTURE_MEDIA,
            relationshipType = "narrative structure",
            imposterHint = "Throwing your hands up in disbelief as the screen fades to black",
            difficulty = VocabularyLevel.FAMILIAR
        ),

        // ==========================================
        // 3. OCCUPATIONS
        // ==========================================
        WordPair(
            mainWord = "Doctor",
            imposterWord = "Stethoscope",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated tool",
            imposterHint = "Crinkly paper roll on an examination table and cold metal against your chest",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Chef",
            imposterWord = "Kitchen Burn",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "occupational hazard",
            imposterHint = "Someone screaming 'Behind!' while carrying a boiling saucepan",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Astronaut",
            imposterWord = "Freeze Dried Ice Cream",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "novelty item & food",
            imposterHint = "Floating liquids turn into shimmering floating spheres",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Detective",
            imposterWord = "Crime Scene Tape",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated barrier & artifact",
            imposterHint = "Asking where someone was between 8:00 and 10:00 PM last Tuesday",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Barista",
            imposterWord = "Steam Wand",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated tool & sound",
            imposterHint = "Spelling someone's name wrong with a black permanent marker",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Firefighter",
            imposterWord = "Dalmatian",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "traditional mascot",
            imposterHint = "Sliding down a brass pole when an alarm echoes through the station",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Pilot",
            imposterWord = "Tray Table",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated passenger environment",
            imposterHint = "A calm voice interrupting with 'We are expecting a bit of turbulence'",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Librarian",
            imposterWord = "Date Stamp",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated tool",
            imposterHint = "A gentle finger placed against the lips whenever someone laughs too loudly",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Lifeguard",
            imposterWord = "Zinc Oxide",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "sun protection routine",
            imposterHint = "Sitting high above everyone on an oversized wooden ladder chair with a whistle",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Flight Attendant",
            imposterWord = "Duty Free Cart",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated equipment",
            imposterHint = "Demonstrating how to fasten a seatbelt with a rhythmic hand sweep",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Architect",
            imposterWord = "Drafting Tube",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated transport container",
            imposterHint = "Wearing all black and complaining about the hallway layout of an apartment",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Plumber",
            imposterWord = "Knee Pads",
            category = GameCategory.OCCUPATIONS,
            relationshipType = "associated work gear",
            imposterHint = "Crouching underneath a cabinet with a flashlight clenched in the teeth",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 4. SPORTS & ACTIVITIES
        // ==========================================
        WordPair(
            mainWord = "Marathon",
            imposterWord = "Safety Pin",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "associated bib preparation",
            imposterHint = "Grabbing paper cups of water from volunteers and splashing it on your neck",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Bowling",
            imposterWord = "Shoe Rental",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "associated prelude ritual",
            imposterHint = "Sliding your fingers into three drilled holes and aiming between arrows",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Scuba Diving",
            imposterWord = "Hand Signals",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "communication method",
            imposterHint = "Only hearing the rhythmic echo of your own lungs inhaling and exhaling",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Camping",
            imposterWord = "Mosquito Bite",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "unavoidable consequence",
            imposterHint = "Zipping up a nylon door while hoping rain doesn't seep through the floor",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Surfing",
            imposterWord = "Wax Comb",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "maintenance tool",
            imposterHint = "Sitting with your legs dangling in deep water watching the horizon for a swell",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Rock Climbing",
            imposterWord = "White Chalk",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "associated grip aid",
            imposterHint = "Your forearms burning while looking down between your feet",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Golf",
            imposterWord = "Sand Trap",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "hazard & terrain",
            imposterHint = "Whispering politely while someone takes three practice swings",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Ice Skating",
            imposterWord = "Bruised Tailbone",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "painful milestone",
            imposterHint = "Clinging desperately to the wooden outer railing on wobbly ankles",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Fishing",
            imposterWord = "Tackle Box",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "associated gear",
            imposterHint = "Sitting quietly on a misty dock at 5:30 AM waiting for a plastic bobber to dip",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Yoga",
            imposterWord = "Rolled Mat",
            category = GameCategory.SPORTS_ACTIVITIES,
            relationshipType = "associated transport object",
            imposterHint = "Lying flat on your back on the floor trying very hard not to fall asleep",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 5. PLACES & TRAVEL
        // ==========================================
        WordPair(
            mainWord = "Airport",
            imposterWord = "Lost Baggage",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "consequence & shared setting",
            imposterHint = "Taking your shoes off and putting your laptop in a plastic bin",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Cruise Ship",
            imposterWord = "Buffet Line",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "shared daily routine",
            imposterHint = "Towel origami shaped like an elephant left on your made bed",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Hotel",
            imposterWord = "Do Not Disturb Sign",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "associated door hanging",
            imposterHint = "Checking the room keycard to remember whether you're on the 4th or 5th floor",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Subway",
            imposterWord = "Turnstile",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "functional barrier",
            imposterHint = "Swaying together with strangers while gripping a chilly metal pole",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Amusement Park",
            imposterWord = "Height Measurement Stick",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "associated checkpoint",
            imposterHint = "Standing in a winding zig-zag queue under the hot sun for 90 minutes",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Museum",
            imposterWord = "Velvet Rope",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "associated boundary",
            imposterHint = "Leaning close to read tiny typed paragraphs mounted on white walls",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Road Trip",
            imposterWord = "Aux Cord",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "shared vehicle ritual",
            imposterHint = "Arguing over playlist control while stopping for beef jerky and fuel",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Campground",
            imposterWord = "S'mores",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "evening ritual food",
            imposterHint = "Waking up with your sleeping bag pushed against cold wet nylon",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Casino",
            imposterWord = "Complimentary Drink",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "atmospheric strategy",
            imposterHint = "Not a single window or clock anywhere in sight on the carpeted floor",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Beach",
            imposterWord = "Seashell",
            category = GameCategory.PLACES_TRAVEL,
            relationshipType = "collected souvenir",
            imposterHint = "Finding gritty particles inside your backpack weeks after getting home",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 6. EVERYDAY OBJECTS
        // ==========================================
        WordPair(
            mainWord = "Umbrella",
            imposterWord = "Wet Floor Sign",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "consequential indicator",
            imposterHint = "Shaking it out vigorously before stepping through the front door",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Alarm Clock",
            imposterWord = "Snooze Button",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "habitual reaction",
            imposterHint = "That momentary feeling of panic before realizing what day it is",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Refrigerator",
            imposterWord = "Alphabet Magnets",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "surface decoration",
            imposterHint = "Opening the door and staring inside blankly even though you checked 5 minutes ago",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Smartphone",
            imposterWord = "Cracked Screen",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "common accident",
            imposterHint = "Patting your empty pockets in a sudden burst of cold dread",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Wallet",
            imposterWord = "Expired Coupon",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "forgotten content",
            imposterHint = "Fumbling to extract a piece of plastic while a queue waits behind you",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Keys",
            imposterWord = "Locksmith",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "emergency service",
            imposterHint = "Looking through the front window and seeing them sitting right on the counter",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Microwave",
            imposterWord = "Splatter Cover",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "associated accessory",
            imposterHint = "Opening the door with exactly one second left so it doesn't beep",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Headphones",
            imposterWord = "Tangled Cord",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "frustrating phenomenon",
            imposterHint = "Pretending not to hear someone calling your name across the room",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Backpack",
            imposterWord = "Broken Zipper",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "wear and tear",
            imposterHint = "Hoisting one strap over a shoulder as you head out the doorway",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Pillow",
            imposterWord = "Cool Side",
            category = GameCategory.EVERYDAY_OBJECTS,
            relationshipType = "sensory preference",
            imposterHint = "Flipping it over in the middle of a restless July night",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 7. ANIMALS & NATURE
        // ==========================================
        WordPair(
            mainWord = "Mosquito",
            imposterWord = "Itch",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "consequence",
            imposterHint = "A high-pitched whine right next to your ear in total darkness",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Dog",
            imposterWord = "Leash",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "associated object",
            imposterHint = "The sound of rapid tail thumping against a wooden floor when you walk in",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Cat",
            imposterWord = "Cardboard Box",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "peculiar obsession",
            imposterHint = "Ignoring the expensive gift and playing with the crumpled wrapping paper",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Bee",
            imposterWord = "Honeycomb",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "crafted architecture",
            imposterHint = "Waving your hands frantically around an outdoor picnic table",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Penguin",
            imposterWord = "Tuxedo",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "visual resemblance",
            imposterHint = "Waddling awkwardly across slippery sheets of solid ice",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Bear",
            imposterWord = "Hibernation",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "seasonal behavior",
            imposterHint = "Hanging your food bag high up in a tree branch away from the tent",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Skunk",
            imposterWord = "Tomato Juice",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "folklore remedy",
            imposterHint = "Rolling the car windows up immediately while driving down a rural highway",
            difficulty = VocabularyLevel.FAMILIAR
        ),
        WordPair(
            mainWord = "Owl",
            imposterWord = "Barn",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "frequent roost",
            imposterHint = "A silent silhouette turning its neck nearly all the way around at dusk",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Kangaroo",
            imposterWord = "Pouch",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "anatomical signature",
            imposterHint = "Bounding across dusty red plains with powerful rear springs",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Squirrel",
            imposterWord = "Acorn",
            category = GameCategory.ANIMALS_NATURE,
            relationshipType = "associated stash",
            imposterHint = "Darting back and forth indecisively in the middle of a suburban street",
            difficulty = VocabularyLevel.COMMON
        ),

        // ==========================================
        // 8. FOOD & DRINKS
        // ==========================================
        WordPair(
            mainWord = "Pizza",
            imposterWord = "Delivery Bike",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "transit method",
            imposterHint = "A late Friday night, casual clothes, and movie selection debates",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Coffee",
            imposterWord = "Mug Ring",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "unwanted desk mark",
            imposterHint = "Incapable of having a coherent conversation until the first warm cup",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Birthday Cake",
            imposterWord = "Wish",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "associated ritual",
            imposterHint = "Taking a deep breath while everyone finishes singing off-key",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Ice Cream",
            imposterWord = "Brain Freeze",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "painful consequence",
            imposterHint = "Licking the sides frantically on a sweltering sunny afternoon",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Popcorn",
            imposterWord = "Kernel in Teeth",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "lingering consequence",
            imposterHint = "The distinct smell that greets you the moment you enter the lobby doors",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Pancake",
            imposterWord = "Maple Syrup",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "traditional pairing",
            imposterHint = "Testing your wrist strength with a confident flip above the skillet",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Sushi",
            imposterWord = "Wasabi",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "potent condiment",
            imposterHint = "A wooden boat platter placed carefully in the center of the table",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Barbecue",
            imposterWord = "Tongs",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "chef's tool",
            imposterHint = "Clicking metal utensils together twice before checking the heat",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Lemon",
            imposterWord = "Pucker",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "physical reaction",
            imposterHint = "Squinting your eyes tightly after an accidental bite",
            difficulty = VocabularyLevel.COMMON
        ),
        WordPair(
            mainWord = "Cereal",
            imposterWord = "Soggy",
            category = GameCategory.FOOD_DRINKS,
            relationshipType = "texture change",
            imposterHint = "Slurping the sweetened colored milk directly from the bowl edge",
            difficulty = VocabularyLevel.COMMON
        )
    )

    fun getPairsForCategory(category: GameCategory): List<WordPair> {
        return pairs.filter { it.category == category }
    }
}
