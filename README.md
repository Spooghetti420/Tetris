# Tetris
This project is a translation and eventual spin-off of the colleauge NathanHolyland's https://github.com/NathanHolyland/ChasCompetition.

## Running
Download the latest release, and then just run a local server to host the game website. You can use extensions in VSCode such as Live Server, which will accomplish the task for you.
Then, just navigate to `index.html` and hit 'Go Live' from the VSCode editor, and the game will start.
I've also made an initial version on https://editor.p5js.org/Spooghetti420/full/XlF4iLwZ0, which requires no effort, but as it's quite harder to update, I might neglect to
do so in case I decide to roll out any changes to this project. It also doesn't support the TypeScript system in place right now, so I might only occasionally
copy-paste all the files over to there to ease the process of playing. (The p5js site doesn't allow the repo to be uploaded in bulk.)

### Building from source
You just need to have the TypeScript compiler install (npm install -g typescript); having cloned the repository, navigate to its root directory and run `npx tsc`.
This will build the source contents into a folder called `dist`; just run the local server as shown above to run the code.