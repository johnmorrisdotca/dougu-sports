// A baseball jersey: a button-front shirt with a round collar band, raglan seams and elbow sleeves, in a team's colours with a number. Drawn for this package: a generic cut, no team's design.
import { defineJersey } from "../emblem.jersey.ts";

/** A baseball jersey. */
export const JERSEY_BASEBALL = /* @__PURE__ */ defineJersey("jersey:baseball", "Baseball jersey", "野球のユニフォーム", {
  name: "baseball",
  start: [25, 7.5],
  segs: [["L", 13.5, 10.5], ["L", 3, 31], ["L", 9.5, 36], ["L", 15.6, 27], ["L", 16.8, 42], ["L", 16.8, 58]],
  neck: { front: "M25 7.5Q32 14 39 7.5Z|M25 7.5Q32 14 39 7.5", back: "M26 7.5Q32 10.5 38 7.5Z|M26 7.5Q32 10.5 38 7.5" },
  seams: ["M25 7.5Q18.5 14 15.8 26"],
  sleeve: "M13.5 10.5L3 31L9.5 36L15.6 27Q18 18 13.5 10.5Z",
  bands: ["M3.5 29.4L10.4 34.8L8.8 37L1.9 31.6Z"],
  across: ["M16 53.5H48V58H16Z"],
  chest: "M12 24H52V30H12Z",
  stripes: "pin",
  front: [23.5, 39, 10, 9],
  back: [32, 40, 26, 22],
  name_: [32, 24, 7, 24],
  placket: "M32 13V58",
  detail: "M33.4 20a.9 .9 0 1 0 0 .01ZM33.4 28a.9 .9 0 1 0 0 .01ZM33.4 46a.9 .9 0 1 0 0 .01ZM33.4 53a.9 .9 0 1 0 0 .01Z",
});
