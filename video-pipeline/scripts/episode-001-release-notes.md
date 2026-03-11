# Episode 1: I Automated My Release Notes With AI

## [NARRATION] Opening Hook
Every release cycle, I used to spend 45 minutes writing release notes.
Pulling commit messages, formatting changelogs, writing summaries.
I automated the entire thing with Claude and a GitHub Action.
Here's the exact setup.

## [NARRATION] The Problem
If you're a release engineer, you know the drill.
You tag a release. Now you need to explain what changed.
You dig through 40 commits, half of which say "fix stuff."
You cross-reference Jira tickets.
You write something that sounds professional.
And nobody reads it anyway.

## [CODE DEMO] The Solution — GitHub Action
Here's what I built. A GitHub Action that triggers on every release tag.
It pulls the commit log since the last tag.
Feeds it to Claude's API with a prompt that says:
"Summarize these commits into release notes.
Group by feature, bugfix, and breaking change.
Keep it under 200 words."

## [NARRATION] The Prompt
The prompt is the whole game. Here's what I use.
I tell Claude the repo name, the version number, and the raw commits.
I tell it to write for developers, not product managers.
No marketing language. Just what changed and why.

## [CODE DEMO] The YAML
The action YAML is 30 lines. I'll walk through every line.
Trigger on push to tags matching v-star.
Checkout the repo. Get the commit log.
Call the Anthropic API. Post the result as a GitHub Release.

## [NARRATION] Results
Setup took me 2 hours including testing.
Saves me 45 minutes per release, roughly twice a week.
That's 6 hours a month I got back.
The output is better than what I was writing manually
because it's consistent and it never forgets a commit.

## [NARRATION] Money Move
If you're building side income with tech skills, this is the pattern.
Find a repetitive task. Automate it. Then productize the automation.
I'm considering turning this into a paid GitHub Action
or a SaaS tool. The demand is there.

## [NARRATION] Closing
That's the setup. Full YAML is linked in the description.
If you want the weekly breakdown, subscribe to the newsletter at deployordie.io.
Deploy or die.
