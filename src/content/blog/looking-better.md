---
title: "Looking Better!"
description: "The world is starting to look more real"
pubDate: "Aug 11 2023"
heroImage: "/overgardens/screenshots/looking-better.png"
---
### Graphical Improvements
I've moved from single character on black to tiles being primarily background color based.  I'm doing a little Brogue-style random deviation in tile shade, so it's not so blocky. Also, some extra checks were added to generate grass, trees and clouds.  I really like the clouds, it really sort of sells the sky island thing.  Additionally, the trees allow a bit more line of sight shading fun, which is nice to see.  Also, the colors are based on the beautiful [Apollo palette on Lospec](https://lospec.com/palette-list/apollo).

### The Window
I've reduced the size of the map from 120x120 to 80x80.  I worry that might be too small, but I guess it's better to have tighter maps that are more interesting than sparsely populated large ones.  I've also changed the tile size to 16x16, just to allow better legibility.  The camera viewport is now 40x40, and the player's FOV range now spans the entire viewport.  And of course, there's the beginnings of a user interface off to the side, with the top panel meant for quick stats, and the side panel meant for a log.  I plan on making the log context sensitive, so when you're in the inventory, it'll show information about what you're looking at, etc. Still a ways off though.

### The Future
I'm constantly wondering if I should refactor things to use a different display library over Malwoden.  If I ever want tiles, it'll have to happen.  I've gotten advice from multiple corners saying it's better to just get something out and working before worrying about future possibilities, so I'll probably stick with it for a while.  I do really like Malwoden's GUI implementation.  Much nicer than having to roll my own dialog boxes and whatnot.

### Roadmap
In the upcoming days, I'll probably work on:
- Game log
- Basic melee combat
- Random name for the player
- Changing levels