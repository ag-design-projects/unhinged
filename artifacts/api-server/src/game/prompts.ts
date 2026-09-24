export const curatedPrompts = [
  "The real reason this meeting exists is ______.",
  "The most dangerous sentence in corporate life is ______.",
  "My manager said “quick question” and then ______.",
  "The real meaning of “let’s circle back” is ______.",
  "Someone says “make it pop.” What they actually mean is ______.",
  "The team’s new unofficial motto is ______.",
  "The one thing missing from our quarterly plan is ______.",
  "The office printer only works if you ______.",
  "The surprise agenda item at the all-hands is ______.",
  "The most honest name for this project is ______.",
  "A calendar invite titled “Fun!” is actually about ______.",
  "Our new productivity metric measures ______.",
  "The intern discovered the company runs entirely on ______.",
  "The CEO’s secret slide deck is just ______.",
  "The real reason the deadline moved is ______.",
  "The worst thing to say on a client call is ______.",
  "The team-building exercise went wrong when someone brought ______.",
  "HR has issued an urgent warning about ______.",
  "The next mandatory training covers ______.",
  "Our office’s greatest unsolved mystery is ______.",
  "The new dress code requires ______.",
  "The company mascot should really be ______.",
  "The meeting room was renamed after ______.",
  "The project status is best described as ______.",
  "The one thing nobody put in the handover notes was ______.",
  "The new hire’s first task is somehow ______.",
  "The most suspicious phrase in a performance review is ______.",
  "The budget disappeared because of ______.",
  "The team’s emergency plan consists of ______.",
  "The most alarming item in the office fridge is ______.",
  "The reason everyone muted their microphone was ______.",
  "Our biggest competitive advantage is apparently ______.",
] as const;

// A local, bounded source keeps prompt replenishment independent of network services.
const situations = [
  "Monday's stand-up", "the annual retreat", "the budget review",
  "the product launch", "the exit interview", "the onboarding session",
  "the emergency town hall", "the customer demo", "the strategy workshop",
  "the performance review",
];
const discoveries = [
  "an unexpected guest", "a mysterious spreadsheet", "a forbidden slide",
  "an accidental confession", "an ambitious intern", "a missing deadline",
  "a secret group chat", "a very specific apology", "a surprise award",
  "an unexplained expense",
];

export const replenishPrompts = (): string[] =>
  situations.flatMap(situation => discoveries.map(discovery =>
    `At ${situation}, the real problem turned out to be ${discovery} and ______.`
  ));

// Separate from the optional source so even a failed or invalid replenishment cannot stop a match.
export const fallbackPrompts: string[] = situations.flatMap(situation => discoveries.map(discovery =>
  `The official report on ${situation} blamed ${discovery}, but forgot ______.`
));