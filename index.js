"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_levenshtein_1 = require("fast-levenshtein");
const jaro_winkler_1 = __importDefault(require("jaro-winkler"));
const string_similarity_1 = __importDefault(require("string-similarity"));
// Matched titles (mix of short, medium, and long titles)
const matchedTitles = [
    // Short titles (1-2 words)
    "1984",
    "Moby-Dick",
    "Frankenstein",
    "Dracula",
    "Odyssey",
    // Medium titles (3-4 words)
    "The Great Gatsby",
    "War and Peace",
    "Jane Eyre",
    "Brave New World",
    "Wuthering Heights",
    // Long titles (5+ words)
    "The Catcher in the Rye",
    "To Kill a Mockingbird",
    "The Brothers Karamazov",
    "Pride and Prejudice",
    "The Divine Comedy",
    "The Hitchhiker's Guide to the Galaxy",
    "The Fellowship of the Ring",
    "One Hundred Years of Solitude",
    "The Old Man and the Sea",
    "Harry Potter and the Philosopher's Stone",
];
// Non-matched titles (mix of short, medium, and long titles)
const nonMatchedTitles = [
    // Short titles (1-2 words)
    "Refactoring",
    "Clean Code",
    "Algorithms",
    "Deep Learning",
    "Design Patterns",
    // Medium titles (3-4 words)
    "The Pragmatic Programmer",
    "Computer Networks",
    "Modern Operating Systems",
    "The Mythical Man-Month",
    "Database System Concepts",
    // Long titles (5+ words)
    "Introduction to Quantum Mechanics",
    "The Art of Computer Programming",
    "Artificial Intelligence: A Modern Approach",
    "Structure and Interpretation of Computer Programs",
    "Patterns of Enterprise Application Architecture",
    "The History of the Peloponnesian War",
    "The Interpretation of Dreams",
    "The Selfish Gene by Richard Dawkins",
    "The Origin of Species by Charles Darwin",
    "The Wealth of Nations by Adam Smith",
];
// Create the books array with 20 matching and 20 non-matching titles
const books = [
    ...matchedTitles.map((title) => ({ title })),
    ...nonMatchedTitles.map((title) => ({ title })),
];
// Reference books to compare against (20 matching titles)
const myBooks = [
    { title: "1984" },
    { title: "Moby Dick" },
    { title: "Frankenstein" },
    { title: "Dracula" },
    { title: "Odyssey" },
    { title: "Great Gatsby" },
    { title: "War & Peace" },
    { title: "Jane Eyre" },
    { title: "Brave New World" },
    { title: "Wuthering Heights" },
    { title: "Catcher in the Rye" },
    { title: "To Kill a Mockingbird" },
    { title: "Brothers Karamazov" },
    { title: "Pride and Prejudice" },
    { title: "Divine Comedy" },
    { title: "Hitchhiker's Guide to the Galaxy" },
    { title: "Fellowship of the Ring" },
    { title: "One Hundred Years of Solitude" },
    { title: "Old Man and the Sea" },
    { title: "Harry Potter Philosopher's Stone" },
];
// Ground truth matches (manual mapping of expected matches)
const groundTruth = {
    "1984": "1984",
    "Moby Dick": "Moby-Dick",
    Frankenstein: "Frankenstein",
    Dracula: "Dracula",
    Odyssey: "Odyssey",
    "Great Gatsby": "The Great Gatsby",
    "War & Peace": "War and Peace",
    "Jane Eyre": "Jane Eyre",
    "Brave New World": "Brave New World",
    "Wuthering Heights": "Wuthering Heights",
    "Catcher in the Rye": "The Catcher in the Rye",
    "To Kill a Mockingbird": "To Kill a Mockingbird",
    "Brothers Karamazov": "The Brothers Karamazov",
    "Pride and Prejudice": "Pride and Prejudice",
    "Divine Comedy": "The Divine Comedy",
    "Hitchhiker's Guide to the Galaxy": "The Hitchhiker's Guide to the Galaxy",
    "Fellowship of the Ring": "The Fellowship of the Ring",
    "One Hundred Years of Solitude": "One Hundred Years of Solitude",
    "Old Man and the Sea": "The Old Man and the Sea",
    "Harry Potter and the Philosopher's Stone": "Harry Potter Philosopher's Stone",
};
// Similarity threshold for determining matches
const threshold = 0.8;
// Function to calculate metrics and list matches
function calculateMetrics() {
    const results = {
        levMatches: 0,
        jaroMatches: 0,
        cosineMatches: 0,
        levMatchedTitles: [],
        jaroMatchedTitles: [],
        cosineMatchedTitles: [],
    };
    myBooks.forEach((myBook) => {
        books.forEach((book) => {
            const maxTitleLength = Math.max(myBook.title.length, book.title.length) || 1;
            // Levenshtein Distance (normalized)
            const levTitleDistance = (0, fast_levenshtein_1.get)(myBook.title, book.title);
            const levTitleSimilarity = 1 - levTitleDistance / maxTitleLength;
            // Jaro-Winkler
            const jaroTitle = (0, jaro_winkler_1.default)(myBook.title, book.title);
            // Cosine Similarity using N-Grams
            const cosineTitle = string_similarity_1.default.compareTwoStrings(myBook.title, book.title);
            const isCorrectMatch = groundTruth[myBook.title] === book.title;
            if (levTitleSimilarity >= threshold && isCorrectMatch) {
                results.levMatches++;
                results.levMatchedTitles.push(`${myBook.title} -> ${book.title}`);
            }
            if (jaroTitle >= threshold && isCorrectMatch) {
                results.jaroMatches++;
                results.jaroMatchedTitles.push(`${myBook.title} -> ${book.title}`);
            }
            if (cosineTitle >= threshold && isCorrectMatch) {
                results.cosineMatches++;
                results.cosineMatchedTitles.push(`${myBook.title} -> ${book.title}`);
            }
        });
    });
    return results;
}
// Function to calculate and rank algorithms
function rankAlgorithms() {
    const results = calculateMetrics();
    console.log("Matching Results:");
    console.log(`Levenshtein Matches: ${results.levMatches}`);
    console.log("Levenshtein Matched Titles:");
    results.levMatchedTitles.forEach((match) => console.log(`  ${match}`));
    console.log(`\nJaro-Winkler Matches: ${results.jaroMatches}`);
    console.log("Jaro-Winkler Matched Titles:");
    results.jaroMatchedTitles.forEach((match) => console.log(`  ${match}`));
    console.log(`\nCosine Similarity Matches: ${results.cosineMatches}`);
    console.log("Cosine Similarity Matched Titles:");
    results.cosineMatchedTitles.forEach((match) => console.log(`  ${match}`));
    const rankedAlgorithms = Object.entries(results).filter(([key]) => key.includes("Matches")).sort(([, a], [, b]) => b - a);
    console.log("\nRanking of Algorithms:");
    rankedAlgorithms.forEach(([algorithm, matches], index) => {
        console.log(`${index + 1}. ${algorithm.replace("Matches", "")}: ${matches} correct matches`);
    });
}
// Run the ranking
rankAlgorithms();
