// --- GLOBALS & DATA ---
let allData = []; 
let galleryData = []; 
let latestNumber = 1; 
let currentUser = null; 
let editingNo = null; 
let delTarget = null;

const categoryPrograms = {
    "Lower Primary": ["Madh Ganam", "Speech", "Quiz", "Kadha Kadhanam", "Pencil Drawing", "Chithrarachna Jalachayam", "Bhasha Keli", "Reading Malayalam", "Reading Arabi-Malayalam", "Book Test"],
    "Upper Primary": ["Mappilappattu", "Kadha Kadhanam", "Speech", "Ganitha Keli", "Quiz", "Pencil Drawing", "Chithrarachna Jalachayam", "Story Writing", "Book Test", "Spelling Bee", "Sudoku"],
    "High School": ["Speech Malayalam", "Speech English", "Mappilappattu", "Madh Ganam", "Arabic Padhyam Chollal", "Kavitha Recitation Malayalam", "Kavitha Recitation Urdu", "Quiz", "Story Writing", "Poem Writing", "Pencil Drawing", "Chithrarachna Jalachayam", "Book Test", "Essay Malayalam", "News Reading", "Adikkurippu", "Language Game English"],
    "Higher Secondary": ["Urdu Kavitha Recitation", "Mappilappattu", "Bhakthiganam", "Speech", "Digital Painting", "Story Writing", "Poem Writing", "Essay Malayalam", "Essay English", "Quiz", "Pencil Drawing", "Chithrarachna Jalachayam", "Book Test", "News Writing", "Calligraphy Arabic", "Reel Making"],
    "Junior": ["Sahithya Samvadam", "Mappilappattu", "Speech Malayalam", "Speech Arabic", "Speech English", "Poem Writing", "Story Writing", "Book Test", "Essay Malayalam", "Essay Arabic", "Slogan Writing", "Madh Gana Rachana", "Quiz", "Translation Arabic", "Calligraphy Arabic", "Social Text", "Hadees Musabaqa", "AI Poem Writing", "Podcast", "Socio Synapse"],
    "Senior": ["Political Debate", "Mappilappattu", "Hamdh Urdu", "Kavitha Recitation English", "Speech Malayalam", "Speech English", "Speech Urdu (Division Muthal)", "Mushaira Alfiya", "Poem Writing", "Poem Writing English", "Story Writing", "Book Test", "Essay Malayalam", "Essay English", "Essay Urdu", "Translation English", "Madh Gana Rachana", "Slogan Writing", "Quiz", "Feature Writing", "Social Text", "Poster Designing", "E-Poster", "Digital Illustration", "Magazine Layout", "Digital Painting", "Podcast"],
    "General": ["Spot Magazine", "Duff", "Arabana", "Group Song A", "Group Song B", "Moulid Recitation", "Qaseeda Recitation", "Viplava Ganam", "Chumar Ezhuthu", "Mala Pattu", "Risala Quiz", "Qawwali", "Viplava Gana Rachana", "Mappilappattu Rachana", "Social Story", "Project", "Collage", "Nasheeda", "Family Magazine"],
    "Lower Primary (Girls)": ["Pencil Drawing", "Chithrarachna Jalachayam", "Kaiyezhuthu Malayalam", "Journal Art"],
    "Upper Primary (Girls)": ["Pencil Drawing", "Chithrarachna Jalachayam", "Book Test", "Story Writing", "Origami"],
    "High School (Girls)": ["Chithrathunnal (Embroidery)", "Book Test", "Pencil Drawing", "Chithrarachna Jalachayam", "Story Writing", "Poem Writing"],
    "Higher Secondary (Girls)": ["Calligraphy Arabic", "Book Test", "Story Writing", "Poem Writing"],
    "Campus (Girls)": ["Essay Malayalam", "Essay English", "Story Writing Malayalam", "Story Writing English"]
};

const unitsList = ['Tharuvana', 'Karingari', 'Pulikkad', 'Aruval', 'Kunnummalangadi', 'Pariyaramukku'];
