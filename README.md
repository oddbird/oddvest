Oddvest
=======

OddBird's Trello Power-up for Harvest integration.

Allows selecting a Harvest project per Trello board, a Harvest task from that
project per Trello card, and then provides an up-to-date report of time tracked
per developer on that task on the back of the card.

Setup
-----

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

TODO
----

Infra:

- Add unit testing.
- Switch to async/await.
- Add linting and Prettier.
- Add a transpiler / build step?

Features:

- Add task budget in time report section.
- Add ability to start/stop a timer for the card's task, direct from the card.

