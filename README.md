# Oddvest

[![CircleCI](https://circleci.com/gh/oddbird/oddvest.svg?style=svg)](https://circleci.com/gh/oddbird/oddvest)

[![Netlify Status](https://api.netlify.com/api/v1/badges/ac38ae99-f54e-436c-a0c9-5b4519a1bba4/deploy-status)](https://app.netlify.com/sites/oddvest/deploys)

OddBird's Trello Power-up for Harvest integration.

Allows selecting a Harvest project per Trello board, a Harvest task from that
project per Trello card, and then provides an up-to-date report of time tracked
per developer on that task on the back of the card.

## Setup

Enable the power-up on your Trello board. It'll pop up an initial configuration
box where you give it a "Client Id" from your Harvest OAuth2 application, and
your Harvest "Account Id" (a seven-digit number); the popup includes links on
where you can find/create those. A single Harvest OAuth2 application can be
reused for many Trello boards, as long as they are on the same account.

Sometimes the popup will disappear before you get a chance to fill it out, if
you click off to other browser tabs/windows. If this happens you just have to
disable and then re-enable the power-up to get the config window again.

Once this is done, you can click the gear icon on the power-up and choose
Authorize from the menu to connect your Trello account to Harvest. This will
pop up a new window to grant Oddvest access to your Harvest account.

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

To compile the JS files, run `yarn build`.

You can also run individual development commands:

```
# format and lint all files
yarn lint

# run JS tests
yarn test
```

Format and lint all files with `yarn lint`.

## TODO

Infra:

- Add docs for file structure.
- Add docs for deployment.
- Add docs for local testing.
- Add unit testing.
- Switch to async/await.
- Add a transpiler / build step?
- Better styling and icons.

Features:

- Correct and performant for older time entries.
- Add ability to start/stop a timer for the card's task, direct from the card.
