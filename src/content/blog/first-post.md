---
title: "First Post"
description: "I guess I'm going to start blogging?"
pubDate: "Aug 9 2023"
heroImage: "/overgardens/screenshots/first-post.png"
---

Well, I don't do this sort of thing much, but I guess a dev blog for the game is a good thing. I'm working on this game (currently called Overgardens of the Ageless) as a hobby project. Hopefully I can get it to a finished state.

### Description

Overgardens of the Ageless is a roguelike where you're a character that has been exiled to this forbidden sky archipelago ruled over by fickle inhuman gods known as the Ageless. They warp the bodies of their followers to their own aesthetics, and the changes can sometimes be beneficial, and sometimes harmful. This is the main gameplay mechanic, where most character progression comes from random mutations from the Ageless. One of the features that I'm most looking forward to implementing is generative music. I plan to have each island have its own root note, and each level have its own scale, and have music generated based on that.

### Technical Description

It's written as a client-side Typescript app, with [Malwoden](https://malwoden.com) and [miniplex](https://github.com/hmans/miniplex). Game storage will be done in IndexedDB. The current should always be playable at <https://seawaffle.github.io/overgardens>. It's still very early days for the game. Maybe I'll manage to make into something fun, maybe it'll get abandoned when life gets busy.

### Current State

Well, I've got a real bare skeleton of a game so far.

- Main Menu allowing you to start a new game or continue your saved game
- General movement
- Some other entities roaming randomly around
- A menu allowing you to save or quit (accessible by pressing Esc)
- A basic help menu (accessible by pressing ?)

It's not much to play so far, but it's moving at a good pace, considering my first commit was at the end of July. I think I've been stressing over small things (like getting this page set up!) instead of working on the broad strokes of the game. Hopefully my time isn't wasted.
