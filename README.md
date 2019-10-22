# Oddvest

[![CircleCI](https://circleci.com/gh/oddbird/oddvest.svg?style=svg)](https://circleci.com/gh/oddbird/oddvest) [![Coverage Status](https://coveralls.io/repos/github/oddbird/oddvest/badge.svg?branch=master)](https://coveralls.io/github/oddbird/oddvest?branch=master) [![Netlify Status](https://api.netlify.com/api/v1/badges/ac38ae99-f54e-436c-a0c9-5b4519a1bba4/deploy-status)](https://app.netlify.com/sites/oddvest/deploys)

OddBird's Trello Power-up for Harvest integration.

Allows selecting a Harvest project per Trello board, a Harvest task from that
project per Trello card, and then provides an up-to-date report of time tracked
per developer on that task on the back of the card.

### Why not use the official Harvest power-up?

Because it doesn't do what we need. The time report it attaches to a card only
includes time entries tracked using the Harvest button on that card. There's no
way to track time from any other Harvest surface and have it included in the
time report for a card. This doesn't work for us for several reasons: we often
budget time in larger-scope Harvest tasks that end up mapping to multiple Trello
cards, and our devs don't want to be restricted to only tracking their time via
the Harvest button on a Trello card.

Oddvest allows us to associate any number of Trello cards with the same Harvest
task, and each of those cards will show a complete time report for that Harvest
task.

## Setup

Enable the power-up on your Trello board. It'll pop up an initial configuration
box where you give it a "Client Id" from your Harvest OAuth2 application, and
your Harvest "Account Id" (a seven-digit number); the popup includes links on
where you can find/create those. A single Harvest OAuth2 application can be
reused for many Trello boards, as long as they are on the same account. (Note
for OddBird: the client ID and account ID for our production Oddvest OAuth2
application are in Keybase under `oddvest/` folder.)

Sometimes the popup will disappear before you get a chance to fill it out, if
you click off to other browser tabs/windows. If this happens you just have to
disable and then re-enable the power-up to get the config window again.

Once this is done, you can click the gear icon on the power-up and choose
Authorize from the menu to connect your Trello account to Harvest. This will pop
up a new window to grant Oddvest access to your Harvest account.

Then the last setup step is to click the gear icon again and choose "Edit
Power-up Settings", which will bring up another popup where you can choose the
Harvest project you want to use with this board from a dropdown of the projects
in your Harvest account. Save this and your Trello board is all set up for
Oddvest!

## Development

Install node & [yarn](https://yarnpkg.com/en/docs/install):

We recommend using [nvm](https://github.com/nvm-sh/nvm) for node version
management. Once you have it installed, run `nvm install` (once per active
shell) to use the correct version of node for Oddvest development.

Install dependencies:

```
yarn
```

To compile the JavaScript/TypeScript files, run `yarn build`.

You can also run individual development commands:

```
# start a watcher to compile assets on changes
yarn watch

# format/lint all files, and type-check TypeScript files
yarn lint

# run unit tests
yarn test
```

In order to actually try out your local changes with Trello & Harvest (which is
necessary to have any confidence in your changes, given the nature of the
project), you'll need a few additional things set up:

1. Start a server that can serve your local checkout. Just cd into the `oddvest`
   directory and run `python3 -m http.server 80`. This will take over that
   terminal until you Ctrl-C to stop it.

2. Expose this server to the Internet via `ngrok`. Install it (from
   https://ngrok.com/) if you don't have it already, then open another terminal
   and run `ngrok http 80`. Copy the HTTPS url it gives you (something like
   `https://8c370def.ngrok.io`) for later use. This will also take over a
   terminal until you Ctrl-C out of it.

3. Create an OAuth2 application at Harvest. Visit
   https://id.getharvest.com/developers and click "Create New OAuth2
   Application." Paste the ngrok URL from above into the "Redirect URL" and
   "Origin URL" boxes. Make sure NOT to include a trailing slash. "I need access
   to one account" and "I want access to Harvest" is all you need.

4. Create a new Trello Power-Up specifically for your local development of
   OddVest at https://trello.com/power-ups/admin. The "Iframe Connector URL"
   should be your ngrok URL from above. On the Capabilities tab, you need to
   enable "Card Back Section", "Card Badges", "Card Buttons", "Card Detail
   Badges", "On Enable", "Show Settings", "Authorization Status", and "Show
   Authorization" capabilities. Note that changes on the capabilities tab don't
   seem to save unless you go back to the main tab and click the Save button.

5. On some test board where you won't disrupt others' work, make sure the prod
   Oddvest power-up is disabled and enable your test power-up (per the
   [instructions above](#setup)). Now this board will use your local version of
   Oddvest.

### Project layout

Trello loads `index.html` in an iframe and calls the `t.initialize()` method in
`src/client.ts`. All other HTML files are loaded in some other iframe when some
action is taken in Trello UI; those should all be referenced in `client.ts`.

The `.ts` files in `src/` correspond one-to-one with the HTML files, and are
loaded by the corresponding HTML file. The files in `src/lib/` are library code
that is used by multiple entry-point JS files. Each entry-point JS file and the
library files it depends on are bundled/transpiled by rollup/babel into a
generated file in `dist/` which is actually referenced from the corresponding
HTML file.

Files in `dist/` are git-ignored but are needed for local dev (see below) and
are automatically built by Netlify on deploy.

### Deployment

Push to `master` on GitHub and your changes will be automatically deployed.

## TODO

Infra:

- Add more unit tests.
- Better styling and icons.

Bugs:

- Correct and performant for older time entries.
- Graceful handling of not-yet-authorized state.
- See if we can avoid asking for write perms to Harvest.

Features:

- Add ability to start/stop a timer for the card's task, direct from the card.
