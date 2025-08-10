module.exports = {
  safelist: [
    "bg-[#b9cfe8]", // exact match
    { pattern: /bg-\[#.{6}\]/ }, // any 6-char hex
  ],
};
