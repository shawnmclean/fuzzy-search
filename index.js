"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_levenshtein_1 = require("fast-levenshtein");
const jaro_winkler_1 = __importDefault(require("jaro-winkler"));
const string_similarity_1 = __importDefault(require("string-similarity"));
// Generate 10 books, 5 of which should not match at all
const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "1984", author: "George Orwell" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    // Non-matching books
    { title: "Introduction to Quantum Mechanics", author: "David J. Griffiths" },
    { title: "Design Patterns", author: "Erich Gamma" },
    { title: "The Art of Computer Programming", author: "Donald Knuth" },
    { title: "Clean Code", author: "Robert C. Martin" },
    { title: "Algorithms Unlocked", author: "Thomas H. Cormen" },
];
// Reference books to compare against (use some from the list above)
const myBooks = [
    { title: "Great Gatsby", author: "Fitzgerald" },
    { title: "Catcher in the Rye", author: "Salinger" },
    { title: "Nineteen Eighty-Four", author: "Orwell" },
    { title: "Mockingbird", author: "Lee" },
    { title: "Pride and Prejudice", author: "Austen" },
];
// Function to calculate metrics
function calculateMetrics() {
    const metrics = myBooks.map((myBook) => {
        return books.map((book) => {
            const maxTitleLength = Math.max(myBook.title.length, book.title.length);
            const maxAuthorLength = Math.max(myBook.author.length, book.author.length);
            // Levenshtein Distance (normalized)
            const levTitleDistance = (0, fast_levenshtein_1.get)(myBook.title, book.title);
            const levAuthorDistance = (0, fast_levenshtein_1.get)(myBook.author, book.author);
            const levTitleSimilarity = 1 - levTitleDistance / maxTitleLength;
            const levAuthorSimilarity = 1 - levAuthorDistance / maxAuthorLength;
            // Jaro-Winkler
            const jaroTitle = (0, jaro_winkler_1.default)(myBook.title, book.title);
            const jaroAuthor = (0, jaro_winkler_1.default)(myBook.author, book.author);
            // Cosine Similarity using N-Grams
            const cosineTitle = string_similarity_1.default.compareTwoStrings(myBook.title, book.title);
            const cosineAuthor = string_similarity_1.default.compareTwoStrings(myBook.author, book.author);
            return {
                book,
                levTitleSimilarity,
                levAuthorSimilarity,
                jaroTitle,
                jaroAuthor,
                cosineTitle,
                cosineAuthor,
            };
        });
    });
    return metrics;
}
// Output the results with better formatting
const metrics = calculateMetrics();
metrics.forEach((bookMetrics, i) => {
    console.log(`\nComparing with My Book: "${myBooks[i].title}" by ${myBooks[i].author}`);
    console.log("=".repeat(60));
    bookMetrics.forEach((metric) => {
        console.log(`\nAgainst Book: "${metric.book.title}" by ${metric.book.author}`);
        console.log("-".repeat(60));
        console.log(`Levenshtein Similarity (Title/Author): ${metric.levTitleSimilarity.toFixed(4)}/${metric.levAuthorSimilarity.toFixed(4)}`);
        console.log(`Jaro-Winkler (Title/Author): ${metric.jaroTitle.toFixed(4)}/${metric.jaroAuthor.toFixed(4)}`);
        console.log(`Cosine Similarity (Title/Author): ${metric.cosineTitle.toFixed(4)}/${metric.cosineAuthor.toFixed(4)}`);
        console.log("-".repeat(60));
    });
    console.log("\n" + "=".repeat(60) + "\n");
});
