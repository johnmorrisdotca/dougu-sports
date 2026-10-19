# Drawing a trophy as a close likeness

[Back to the README](../README.md) · English

**The rule (John Morris, 2026-10-18).** Every cup, trophy and medal that stands for one real trophy is a very, very close likeness of the original. The package helps to keep the likeness of these historic trophies, so a person who knows the trophy knows the drawing at once: its bowl or barrel, its handles, its stem and base, its tiers and bands, its ribbons, in the proportions the real one has. A trophy that stands for no real one stays generic (`trophy:cup`, `trophy:hockey-cup`) and says so in its name.

Close does not mean copied. The drawing is our own vector, made in the lathe's numbers (`src/emblems/emblem.lathe.ts`); the photograph is looked at and measured and then put away.

## What is allowed, and what is not

| Allowed | Not allowed |
| --- | --- |
| Photographs of the real object as the visual reference, at their licence's terms: a freely licensed or public-domain file on Wikimedia Commons first, then any photograph that is only looked at | A photograph, or any part of it, in the package: no image file, no data URI, no embedded raster |
| Measuring the photograph: the height of each part, the half width at each height, the curve of a handle, where a band or a ring sits | An automatic trace or vectorisation of a photograph or of anyone's drawing: the profile is set by hand from the measurements, a few dozen points |
| The trophy's own name in the id, the title and the docs (`trophy:stanley-cup`, "Stanley Cup"): the name says what the drawing is | Any lettering, logo, league, team or sponsor mark on the drawing, or a real engraving: a band that holds an engraving is plain, and takes text through the `engrave` option |
| Facts (what it honours, when it was first given, its height and weight) in `NAMED_TROPHIES` and in the docs | Another project's emblem, icon, clip art or emoji, and the SPX, SPXN and SPXIS marks (MIT package) |

## The method

1. **Find the reference.** Search Wikimedia Commons for the object (`python3 -I` against its API, or the site's search) and prefer public-domain and CC BY or CC BY-SA photographs, taken square on, in even light, with the whole object in the frame. Collect two or three: one front view, one from the side or a little above, and a close view of the part that is hard to see (a handle, a finial, a figure). Record each file's name and licence in [likeness-sources.md](likeness-sources.md). Download them to a scratch folder outside the repository.
2. **Read the parts.** `node scripts/likeness.ts grid photo.jpg grid.png --box=x,y,w,h --step=10` lays a labelled grid, in the photograph's own pixels, over the object. From it read the top and the bottom of the object, the axis, and for each part its height and its half width. For an object on a clean background `node scripts/likeness.ts silhouette photo.jpg --box=... --to=4,60` prints the half width at evenly spaced rows already scaled to the 64 unit box of a lathe emblem: it is a table of measurements, to be read and simplified by hand, never pasted.
3. **Set the profile.** A trophy that is round about an axis (a cup, a bowl, a vase, a column) is a `defineLathe` profile: a list of `[height, radius]` points from the top down, sharp corners marked, one tone for each material (`silver`, `gilt`, `wood`...). The object stands in the 64 by 64 box with its axis at x = 32; scale so that the widest part fits and keep the true ratio of height to width. Handles are curves through points in the plane of the handle. Ribs, grooves, rings and beads are `decor`; balls, globes, footballs and baseballs are `balls`; a ring of poles is `poles`. A flat trophy (a shield, a plaque, a belt) is a `defineFlat` drawing.
4. **Compare at the same height.** `node scripts/likeness.ts compare trophy/<name> photo.jpg out.png --box=x,y,w,h` puts the photograph's object and the drawing (metal and line) side by side at the same height; take the box from the profile's own scale. Adjust the points until the outline, the proportions and the parts agree. Look at 256, 64 and 16 pixels (`scripts/emblem-sheet.ts`) in light and dark and turned: a trophy must still be itself at 16 pixels, so the part that identifies it is drawn first and is not lost in the line style.
5. **Draw what identifies it.** The handle's shape, the bowl's curve, the height of the base, the number of tiers and bands, a ribbon or a lid, the ribs of a bowl: these are what a person recognises, and they are drawn as the original has them, not as a generic cup has them. What the lathe cannot draw (a ribbon bow, a figure's pose, relief on a bowl) is left out or is simplified to its mass, and the file says so.
6. **Record.** The trophy goes in `NAMED_TROPHIES` (`src/emblems/emblem.named.ts`) with its name, sport, competition, what it honours, when it was first given and what the drawing was measured on, in `docs/likeness-sources.md` with the photograph's name, author, licence and address, and in the module's header comment with what is approximate. A drawing that was made without a photograph says "from a description" and is listed as such.
7. **Check.** `pnpm check`. A named trophy's markup is held to a limit of its own (`test/emblem.test.ts`); every named trophy has an entry in `NAMED_TROPHIES`; no drawing carries text.

## When the object is hard

- **No good photograph.** Draw from a written description and measurements (a museum's catalogue, the competition's own rules for the trophy's height and weight) and say so in the sources file. Mark the emblem `approximate` in its sources entry, and treat it as the first to redraw when a photograph is found.
- **The object is not round.** A trophy with a figure, a flat plate, a hexagonal stand or an irregular cup is drawn as the nearest lathe form (a body of revolution with flat `sides`, a stack of solids, `balls`) with the parts the lathe has; a figure is reduced to the mass it adds to the silhouette.
- **A modern trophy under licence.** The drawing is of the object's form, which a photograph shows; no mark on it is drawn. If a rights holder objects, the entry is withdrawn and the id keeps drawing the nearest generic trophy.

## The generic trophies that stand for a real one

These ids were drawn before this rule, as a simplified, generic form of a famous trophy. They stay (a site that uses them keeps working, and a generic cup is right for a competition with no famous trophy), and each real trophy they suggest gets its own named id as it is drawn. They are listed with the original each one stands for, the weakest likeness first.

| Generic id | Suggests | How loose |
| --- | --- | --- |
| `trophy:hockey-cup` | The Stanley Cup | Loose: a small flared bowl, a collar and five bands that each widen; the real cup's ribbed bowl, three narrow rings under it and the proportions of its barrel differ |
| `trophy:basketball` | The Larry O'Brien Championship Trophy | Loose: a ball on a rim and a net on a column; the real trophy's ball is a silver sphere with a net below and a base of its own |
| `trophy:baseball` | The Commissioner's Trophy | Loose: thirty pennants round a ball; the real trophy's flags, pole heights and base differ |
| `trophy:football` | The Vince Lombardi Trophy | Loose: a football on a stand; the real stand is a tapered three-sided pedestal and the ball is a regulation football in silver |
| `trophy:soccer-globe` | The FIFA World Cup | Close in kind, loose in the figures and the malachite bands |
| `trophy:canadian-bowl` | The Grey Cup | Loose in the bowl and the panelled base |
| `trophy:tennis-plate` | The Venus Rosewater Dish | Loose |
| `trophy:tennis-cup` | The Wimbledon Gentlemen's Singles Trophy | Loose |
| `trophy:cricket-urn` | The Ashes urn | Close in kind |
| `trophy:rugby-cup` | The Webb Ellis Cup | Loose |
| `trophy:sumo-cup` | The Emperor's Cup | Loose |

The plaque, the belt, the laurel, the rosette, the ring, the banners and the plain cup, bowl, lidded cup, salver and globe are generic on purpose.

## The tools

```sh
node scripts/likeness.ts grid photo.jpg grid.png --box=0,0,1000,1500 --step=50 --width=900
node scripts/likeness.ts silhouette photo.jpg --box=300,100,500,1200 --rows=40 --to=4,60
node scripts/likeness.ts compare trophy/stanley-cup photo.jpg out.png --box=200,50,700,700
```

They run in Chromium through Playwright, which the package already has as a development dependency. The photograph is read from where you saved it and is never copied into the repository.
