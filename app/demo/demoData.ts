// Sample data for the static demo (npm run build:demo). Everything here is
// fictional. Times are offsets from the moment a visitor first opens the demo,
// so the stream always looks recent.

export interface DemoUser {
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
}

// The visitor is "logged in" as this account from the first page load
export const VISITOR: DemoUser = {
  username: "visitor",
  first_name: "You",
  last_name: "(demo)",
  bio: "Looking around the PostStream demo. Nothing I do here leaves this browser.",
};

export const CAST: DemoUser[] = [
  { username: "johndoe131", first_name: "John", last_name: "Doe", bio: "Software developer and tech enthusiast" },
  { username: "janedoe343", first_name: "Jane", last_name: "Doe", bio: "Designer and creative thinker" },
  { username: "joejoebinks131", first_name: "Joe", last_name: "Binks", bio: "Full-stack developer and coffee lover" },
  { username: "marguerite", first_name: "Marguerite", last_name: "Okafor", bio: "Night-shift nurse. Reads on the bus." },
  { username: "ottoline", first_name: "Otto", last_name: "Lindqvist", bio: "Repairs bicycles, mostly other people's." },
  { username: "tamsinreads", first_name: "Tamsin", last_name: "Hale", bio: "Librarian. Keeps a paper notebook for everything." },
  { username: "dev404", first_name: "Priya", last_name: "Raman", bio: "Writes code, breaks it, writes about it." },
  { username: "hollowpine", first_name: "Wes", last_name: "Arden", bio: "Lives somewhere with more trees than people." },
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

// Already in the stream when the demo opens: [author, minutes ago, body]
export const STARTING_POSTS: [string, number, string][] = [
  ["johndoe131", 4 * 24 * 60, "Just finished building an amazing new feature! The code is clean and the tests are passing. #coding #success"],
  ["janedoe343", 3 * 24 * 60, "Designing a new user interface for our mobile app. The user experience is going to be incredible!"],
  ["joejoebinks131", 2 * 24 * 60, "Database optimization complete. Query times reduced by 60%! The team is going to love this."],
  ["tamsinreads", 30 * 60, "Someone returned a library book with a pressed four-leaf clover in it. I've put it in the lost and found, which feels wrong somehow."],
  ["ottoline", 22 * 60, "A customer brought in a bike she hasn't ridden since 1994. New tires, new chain, and it rides like nothing happened. Steel frames are patient."],
  ["marguerite", 16 * 60, "Twelve-hour shift done. The sunrise from the parking garage roof is the best view in the city and nobody else seems to know about it."],
  ["dev404", 9 * 60, "Spent the morning chasing a bug that turned out to be a timezone. It is always a timezone."],
  ["hollowpine", 5 * 60, "Power's out again, so I'm writing this on my phone by the woodstove. The quiet is kind of nice, honestly."],
  ["janedoe343", 3 * 60, "Trying a rule this week: no notifications on my phone except calls. Day two and I already check it less."],
  ["johndoe131", 90, "Hot take: the best code review comment is a question, not a suggestion."],
  ["tamsinreads", 40, "**Currently reading:** a 400-page history of salt. It is better than it has any right to be."],
  ["joejoebinks131", 12, "Second coffee of the day. I keep saying I'll cut back. I won't."],
];

// Replies already on those posts: [post index, author, kind, detail]
export const STARTING_REPLIES: [number, string, string, string?][] = [
  [0, "janedoe343", "agree_because", "the architecture looks solid"],
  [1, "johndoe131", "thanks"],
  [3, "marguerite", "tell_me_more", "what the lost and found has in it"],
  [4, "hollowpine", "brilliant"],
  [4, "dev404", "agree_because", "old steel outlives all of us"],
  [5, "ottoline", "thanks"],
  [6, "johndoe131", "agree"],
  [6, "joejoebinks131", "agree_because", "it is always a timezone"],
  [8, "tamsinreads", "tell_me_more", "what you're doing with the time instead"],
  [9, "dev404", "disagree_because", "sometimes a suggestion saves everyone a round trip"],
];

// Who the cast follows, so their own feeds make sense too
export const STARTING_FOLLOWS: [string, string][] = [
  ["johndoe131", "janedoe343"],
  ["johndoe131", "joejoebinks131"],
  ["joejoebinks131", "johndoe131"],
  ["marguerite", "tamsinreads"],
  ["tamsinreads", "marguerite"],
  ["ottoline", "hollowpine"],
  ["dev404", "johndoe131"],
];

// New posts the cast makes while the visitor is looking around, in order
export const POST_POOL: [string, string][] = [
  ["hollowpine", "Power's back. The woodstove keeps going anyway; I've gotten used to it."],
  ["dev404", "Wrote a test for the timezone bug so it can never happen again. It will happen again."],
  ["marguerite", "A patient told me today that I have kind hands. That one's staying with me for a while."],
  ["ottoline", "Today's repair: a kid's bike with a playing card in the spokes. I put the card back."],
  ["tamsinreads", "The salt book has a whole chapter on salted cod and I have never been so invested in fish."],
  ["johndoe131", "Deleted 400 lines of code today. Best day of the week."],
  ["janedoe343", "No-notifications experiment, day three: I read a whole chapter on the train instead of scrolling."],
  ["joejoebinks131", "Third coffee. We don't talk about it."],
  ["hollowpine", "Saw a fox cross the road this morning, stop, look right at the car, and keep walking like it owned the place. It does."],
  ["dev404", "Pair programming tip: whoever is not typing holds the coffee. Makes everyone slow down."],
  ["marguerite", "Nights off feel like a holiday in a country where I don't speak the language."],
  ["ottoline", "Someone asked if I could make their bike lighter. I suggested they eat a smaller breakfast. They did not laugh."],
  ["tamsinreads", "Story time today: 14 kids, one dinosaur book, zero survivors. They loved it."],
  ["janedoe343", "Wireframes on paper first. Every time I skip that step I regret it."],
  ["johndoe131", "Reminder that `git blame` is just a history lesson. Be kind to past you."],
  ["joejoebinks131", "Our deploy went out on a Friday and nothing broke. I don't trust it."],
  ["hollowpine", "First frost. The garden is done for the year and I'm a little relieved."],
  ["dev404", "Today I learned you can put a sticky note on your monitor that just says \"is it DNS?\" and save yourself an hour a week."],
  ["marguerite", "Bus driver waved me on without paying because I was in scrubs. Small kindnesses on long days."],
  ["ottoline", "There is no problem a new chain can't solve, except most of them."],
];

// Replies the cast leaves on posts (including the visitor's): [kind, detail?]
export const REPLY_POOL: [string, string?][] = [
  ["agree"],
  ["brilliant"],
  ["thanks"],
  ["agree_because", "I've been there"],
  ["tell_me_more", "how that went"],
  ["disagree_because", "I've seen it go the other way"],
  ["agree_because", "this happens to me every week"],
  ["tell_me_more", "what changed your mind"],
  ["thanks"],
  ["brilliant"],
];

export const TIMING = {
  MINUTE,
  HOUR,
  // How often the cast does something while the demo is open
  activityEveryMs: [12_000, 25_000] as const,
  // How soon someone replies to the visitor's own post
  replyToVisitorMs: [6_000, 14_000] as const,
};
