import mongoose from "mongoose";
import { connectDB } from "./db/index.js";

import User from "./models/User.js";
import Actor from "./models/Actor.js";
import Movie from "./models/Movie.js";
import Review from "./models/Review.js";

process.loadEnvFile();

async function seed() {
  try {
    await connectDB();

    console.log("Starting seed...");

    // 1+> Create demo users
    const userData = [
      {
        username: "demo",
        email: "demo@movieapp.test",
        password: "Password123!",
      },
      {
        username: "sarah",
        email: "sarah@movieapp.test",
        password: "Password123!",
      },
      {
        username: "john",
        email: "john@movieapp.test",
        password: "Password123!",
      },
    ];

    const users = [];

    for (const data of userData) {
      let user = await User.findOne({ email: data.email });

      if (!user) {
        user = await User.create(data);
      }

      users.push(user);
    }

    // +> Real actors
    const actorData = [
      { name: "Leonardo DiCaprio", birthdate: "1974-11-11" },
      { name: "Joseph Gordon-Levitt", birthdate: "1981-02-17" },
      { name: "Elliot Page", birthdate: "1987-02-21" },
      { name: "Tom Hardy", birthdate: "1977-09-15" },
      { name: "Ken Watanabe", birthdate: "1959-10-21" },
      { name: "Cillian Murphy", birthdate: "1976-05-25" },
      { name: "Marion Cotillard", birthdate: "1975-09-30" },
      { name: "Michael Caine", birthdate: "1933-03-14" },

      { name: "Emily Blunt", birthdate: "1983-02-23" },
      { name: "Robert Downey Jr.", birthdate: "1965-04-04" },
      { name: "Matt Damon", birthdate: "1970-10-08" },
      { name: "Florence Pugh", birthdate: "1996-01-03" },
      { name: "Rami Malek", birthdate: "1981-05-12" },
      { name: "Kenneth Branagh", birthdate: "1960-12-10" },

      { name: "Matthew McConaughey", birthdate: "1969-11-04" },
      { name: "Anne Hathaway", birthdate: "1982-11-12" },
      { name: "Jessica Chastain", birthdate: "1977-03-24" },
      { name: "Casey Affleck", birthdate: "1975-08-12" },
      { name: "Timothee Chalamet", birthdate: "1995-12-27" },
      { name: "Christian Bale", birthdate: "1974-01-30" },
      { name: "Heath Ledger", birthdate: "1979-04-04" },
      { name: "Aaron Eckhart", birthdate: "1968-03-12" },
      { name: "Gary Oldman", birthdate: "1958-03-21" },
      { name: "Morgan Freeman", birthdate: "1937-06-01" },
      { name: "Maggie Gyllenhaal", birthdate: "1977-11-16" },

      { name: "Zendaya", birthdate: "1996-09-01" },
      { name: "Rebecca Ferguson", birthdate: "1983-10-19" },
      { name: "Javier Bardem", birthdate: "1969-03-01" },
      { name: "Josh Brolin", birthdate: "1968-02-12" },
      { name: "Austin Butler", birthdate: "1991-08-17" },
      { name: "Christopher Walken", birthdate: "1943-03-31" },
      { name: "Ryan Reynolds", birthdate: "1976-10-23" },
      { name: "Hugh Jackman", birthdate: "1968-10-12" },
      { name: "Emma Corrin", birthdate: "1995-12-13" },
      { name: "Morena Baccarin", birthdate: "1979-06-02" },
      { name: "Matthew Macfadyen", birthdate: "1974-10-17" },
      { name: "Lupita Nyong'o", birthdate: "1983-03-01" },
      { name: "Pedro Pascal", birthdate: "1975-04-02" },
      { name: "Catherine O'Hara", birthdate: "1954-03-04" },
      { name: "Bill Nighy", birthdate: "1949-12-12" },
      { name: "Kit Connor", birthdate: "2004-03-08" },
      { name: "Stephanie Hsu", birthdate: "1990-11-25" },
      { name: "Mark Hamill", birthdate: "1951-09-25" },
      { name: "Michael B. Jordan", birthdate: "1987-02-09" },
      { name: "Hailee Steinfeld", birthdate: "1996-12-11" },
      { name: "Jack O'Connell", birthdate: "1990-08-01" },
      { name: "Wunmi Mosaku", birthdate: "1986-07-31" },
      { name: "Delroy Lindo", birthdate: "1952-11-18" },
      { name: "David Corenswet", birthdate: "1993-07-08" },
      { name: "Rachel Brosnahan", birthdate: "1990-07-12" },
      { name: "Nicholas Hoult", birthdate: "1989-12-07" },
      { name: "Nathan Fillion", birthdate: "1971-03-27" },
      { name: "Isabela Merced", birthdate: "2001-07-10" },
      { name: "Brad Pitt", birthdate: "1963-12-18" },
      { name: "Damson Idris", birthdate: "1991-09-02" },
      { name: "Kerry Condon", birthdate: "1983-01-04" },
      { name: "Tobias Menzies", birthdate: "1974-03-07" },
    ];

    const actorsMap = {};

    for (const data of actorData) {
      const actor = await Actor.findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { upsert: true, new: true, runValidators: true }
      );

      actorsMap[data.name] = actor._id;
    }

    // 3=> Real movies with their actual actors
    const movieData = [
      {
        title: "Inception",
        year: 2010,
        genres: ["Action", "Sci-Fi", "Thriller"],
        description:
          "A skilled thief enters people's dreams to steal secrets and attempts to plant an idea.",
        trailerLink: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        director: "Christopher Nolan",
        actors: [
          "Leonardo DiCaprio",
          "Joseph Gordon-Levitt",
          "Elliot Page",
          "Tom Hardy",
          "Ken Watanabe",
          "Cillian Murphy",
          "Marion Cotillard",
          "Michael Caine",
        ],
      },
      {
        title: "Oppenheimer",
        year: 2023,
        genres: ["Drama", "History", "Thriller"],
        description:
          "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        trailerLink: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        director: "Christopher Nolan",
        actors: [
          "Cillian Murphy",
          "Emily Blunt",
          "Robert Downey Jr.",
          "Matt Damon",
          "Florence Pugh",
          "Rami Malek",
          "Kenneth Branagh",
        ],
      },
      {
        title: "Interstellar",
        year: 2014,
        genres: ["Adventure", "Drama", "Sci-Fi"],
        description:
          "A team of explorers travels through a wormhole in space to secure humanity's future.",
        trailerLink: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        director: "Christopher Nolan",
        actors: [
          "Matthew McConaughey",
          "Anne Hathaway",
          "Jessica Chastain",
          "Michael Caine",
          "Casey Affleck",
          "Matt Damon",
          "Timothee Chalamet",
        ],
      },
      {
        title: "The Dark Knight",
        year: 2008,
        genres: ["Action", "Crime", "Drama"],
        description:
          "Batman faces the Joker, a criminal mastermind who brings chaos to Gotham City.",
        trailerLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        director: "Christopher Nolan",
        actors: [
          "Christian Bale",
          "Heath Ledger",
          "Aaron Eckhart",
          "Michael Caine",
          "Gary Oldman",
          "Morgan Freeman",
          "Maggie Gyllenhaal",
          "Cillian Murphy",
        ],
      },
      {
        title: "Dune: Part Two",
        year: 2024,
        genres: ["Sci-Fi", "Adventure", "Action"],
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.",
        trailerLink: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
        director: "Denis Villeneuve",
        actors: [
          "Timothee Chalamet",
          "Zendaya",
          "Rebecca Ferguson",
          "Javier Bardem",
          "Josh Brolin",
          "Austin Butler",
          "Christopher Walken",
          "Florence Pugh",
        ],
      },
      {
        title: "Deadpool & Wolverine",
        year: 2024,
        genres: ["Action", "Comedy", "Sci-Fi"],
        description:
          "Deadpool joins forces with Wolverine on an unpredictable mission that changes their lives.",
        trailerLink: "https://www.youtube.com/watch?v=6eK4WuY8Wvc",
        director: "Shawn Levy",
        actors: [
          "Ryan Reynolds",
          "Hugh Jackman",
          "Emma Corrin",
          "Morena Baccarin",
          "Matthew Macfadyen",
        ],
      },
      {
        title: "The Wild Robot",
        year: 2024,
        genres: ["Animation", "Adventure", "Sci-Fi"],
        description:
          "A robot named Roz becomes stranded on an island and builds unexpected relationships with the animals living there.",
        trailerLink: "https://www.youtube.com/watch?v=njPNg0A9VpY",
        director: "Chris Sanders",
        actors: [
          "Lupita Nyong'o",
          "Pedro Pascal",
          "Catherine O'Hara",
          "Bill Nighy",
          "Kit Connor",
          "Stephanie Hsu",
          "Mark Hamill",
        ],
      },
      {
        title: "Sinners",
        year: 2025,
        genres: ["Horror", "Drama", "Thriller"],
        description:
          "Twin brothers return to their hometown to start a new life, only to face a terrifying supernatural evil.",
        trailerLink: "https://www.youtube.com/watch?v=7joulECTx_U",
        director: "Ryan Coogler",
        actors: [
          "Michael B. Jordan",
          "Hailee Steinfeld",
          "Jack O'Connell",
          "Wunmi Mosaku",
          "Delroy Lindo",
        ],
      },
      {
        title: "Superman",
        year: 2025,
        genres: ["Action", "Adventure", "Sci-Fi"],
        description:
          "Clark Kent tries to balance his Kryptonian heritage with his human upbringing as he becomes Superman.",
        trailerLink: "https://www.youtube.com/watch?v=Ox8ZLF6cGM0",
        director: "James Gunn",
        actors: [
          "David Corenswet",
          "Rachel Brosnahan",
          "Nicholas Hoult",
          "Nathan Fillion",
          "Isabela Merced",
        ],
      },
      {
        title: "F1: The Movie",
        year: 2025,
        genres: ["Action", "Drama", "Sport"],
        description:
          "A former Formula One driver returns to racing to help a struggling team compete against the best.",
        trailerLink: "https://www.youtube.com/watch?v=PRnxLqYVoMc",
        director: "Joseph Kosinski",
        actors: [
          "Brad Pitt",
          "Damson Idris",
          "Javier Bardem",
          "Kerry Condon",
          "Tobias Menzies",
        ],
      },
    ];

    const moviesMap = {};

    for (const data of movieData) {
      const movie = await Movie.findOneAndUpdate(
        { title: data.title },
        {
          $set: {
            ...data,
            actors: data.actors.map((name) => actorsMap[name]),
          },
        },
        { upsert: true, new: true, runValidators: true }
      );

      moviesMap[data.title] = movie;
    }

    // 4=> Create demo reviews without duplicates
    const reviewData = [
      {
        number: 10,
        comment: "One of the greatest movies ever made!",
        movie: moviesMap["Inception"]._id,
        user: users[0]._id,
      },
      {
        number: 9,
        comment: "Amazing acting and an incredible story.",
        movie: moviesMap["Oppenheimer"]._id,
        user: users[1]._id,
      },
      {
        number: 10,
        comment: "A masterpiece of science fiction.",
        movie: moviesMap["Interstellar"]._id,
        user: users[2]._id,
      },
      {
        number: 9,
        comment: "One of the best superhero movies.",
        movie: moviesMap["The Dark Knight"]._id,
        user: users[0]._id,
      },
    ];

    for (const data of reviewData) {
      await Review.findOneAndUpdate(
        { movie: data.movie, user: data.user },
        { $set: data },
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Seed completed successfully!");
    console.log(`Users: ${users.length}`);
    console.log(`Actors: ${actorData.length}`);
    console.log(`Movies: ${movieData.length}`);
    console.log(`Reviews: ${reviewData.length}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();