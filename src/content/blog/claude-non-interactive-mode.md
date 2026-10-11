---
title: "Claude Code in non-mode"
description: "Running Claude Code non-interactively aka the Agent SDK"
pubDate: 2026-10-11
category: dev-log
---

A lot of Claude Max and Team users are trying to figure out how to use their Monthly API Credits right now. There’s just one catch: these credits don’t apply to interactive Claude Code sessions in the terminal, IDE, desktop, or web. Nor can they be applied towards runs using the Claude Code GitHub Action.

## So how can you use them?

According to the [announcement](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans), the credits which range from $100/$200 for Max users and $20/$100 per seat for Team users with a max pool of $500, can be applied to usage of the Claude API, the Claude Console Playground, Claude Managed Agents, or on the Agent SDK.

This last one grabbed my attention, and I had to wonder: does that mean they can be applied to non-interactive (`claude -p`) runs? Yes, yes it does.

## So what is non-interactive mode?

Non-interactive mode is a very powerful way to run Claude Code from the comfort of your command line, a CI/CD pipeline, or a script. You give Claude a prompt, Claude works on it till it’s done, managing the agentic loop **without supervision or any hand holding.**

After setting your `ANTHROPIC_API_KEY` in your shell environment, you run it like so: `claude -p` or the long form `claude --print` followed by your prompt. Using print mode, we are telling Claude to query the SDK and then output the result, which defaults to printed text. For example if I ask Claude: `claude -p "what is 5 + 5"` Claude will print to the console: `5 + 5 = 10` and then stop. 

Hold up before you just unleash Claude on a task this way. We like Claude, and we want to trust Claude, but non-interactive mode means we aren’t going to vibe our way through a problem. Claude unchecked can be expensive. **Maybe I lied about the hand holding.**

## Setting the ground rules for non-interactive runs

This is where we have to use our engineering brain a bit. What we need to do before unleashing Claude non-interactively, is set up some ground rules.

For example we can limit the number of turns, the max cost USD, or specify a specific model of Claude. These are all just flags to add to the command:
```
--max-turns 20
--max-budget-usd 2.00
--model haiku
```
You can find all the flags available in the official [CLI reference documentation](https://code.claude.com/docs/en/cli-reference) so make sure to take a look.

## Output format 

So a stdout printed text message might not be very useful for you. This is where the `--output-format` flag is useful. `json` is a much better option as now you get the entire agentic loop as the output in your `--print`. This includes each turn, tool use, and of course the result. Which you could then deterministically chew on, for example using redirect operator (`>`) to output the results to a file and/or the pipe operator (`|`) to query the json results using [jq](https://jqlang.org/). 

## Bare mode also known as fast mode

> Quick side note: Anthropic announced that the defaults for `-p` will change in a future release with `--bare` being the default mode for `-p` calls. You can prepare for this by either locking down your version of Claude in a script or by preemptively include `--bare` now.

Bare mode is great for running a stripped down version of Claude without the bloat of... Claude. Your Claude, yes yours, not mine. You know who are... you've added every plugin, every MCP server, every skill, every Agent, anything and everything, and now you find yourself in the Claude discord asking why you keep running out of context so quickly. 

This next section is important, because obviously there are workflows that you need to run, standards you want Claude to adhere to, or sets of instructions wrapped in a Skill that you want Claude to follow. How do we do this?

## Auto-discovering custom Skills during bare mode

While `--bare` strips everything in your `.claude` directory away, or more accurately, doesn't include them to begin with, `--add-dir` can add the `.claude` directory back. You are able to load any `.claude` directory anywhere in your file system but when you do want the project version, you specify the current directory (your project root) with a single dot (`.`). Here's an example:

```
claude --bare -p "/my-custom-skill" \
  --add-dir .
```
This will auto load your `.claude/skills/` directory at start time, so that you can still use any custom slash skills in the prompt as show above. If you neglected this step, Claude will send a message saying something like: "I'm here to help you but I don't know what you want me to do!". It's honestly kind of cute.

While this works for loading your Skills into context at start time, it will still skip auto-discovery of basically everything else, including your `CLAUDE.md` file, so make sure you load everything else manually. They are there, they just aren't configured yet. Claude can even read them if you ask, but won't unless you specify in your prompt. 

The good news is that by using a combination of flags like `--append-system-prompt`,  `--agents <file-or-json>` and `--settings <file-or-json>` you can get this functionality loaded into Claude at start time. Read more about `--bare` in the official [documentation](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode).

## Running non-interactive mode in a GitHub Action

"Wait, I thought you said you couldn't use the monthly credits in the Claude Code GitHub Action!"

Correct. From the article: 
> Runs started by the Claude Code GitHub Action, an IDE extension or the Claude desktop app count as Claude Code usage, so API credits don't cover them, even with -p

They are referencing the *official* Claude Code GitHub Action. A *custom action* is a different matter. The thing is, if you ask Claude to write a GitHub Action workflow, it will naturally gravitated to the official one. This is the action that lets you ping Claude directly on a PR to respond to issues. This is a fine way to use Claude but like the article says, this counts as Claude Code usage, not API usage.

So `-p` in a *custom action* is totally eligible as it counts as API usage / Agent SDK usage. Some common workflow actions might be automated security reporting, dependency audits, or test generation.

Using a matrix strategy we can even run multiple `claude -p`'s that fan out in parallel. This is perfect for test generation when you have edited multiple files. By spinning up multiple Claudes per file/module, each Claude has a simple focused test task. A strategy like this will reduce the cognitive overload aka hallucinations that can happen when a single Claude is doing too much across too many files and will also cut down on self review bias. Just make sure it concludes with a final cross-file pass. 

## Final thoughts

We covered a lot today. Claude Code in non-interactive mode, when used with an API key will draw from your API credits, which when paired with a Max or Team plan means free usage, up to your monthly allotment.

Claude Code non-mode IS the Agent SDK, in that Claude controls the loop, the human just sets it and forgets it. I want to mention you could also use the Python or Typescript Agent SDK's, these are eligible for your API credits as well, and work basically the same way. 

There's something interesting to me about using `claude -p` though. It just works, it's fast (especially in bare mode), it's fun, and... oh almost forgot! When you run Claude in non-mode (it's not called that btw I made that up), you automatically get to go brag to all your friends that you run **Claude headless**. Heck yes.

## P.S.

No AI was used to write this post as is probably apparent by the grammar or any spelling errors. Could be that the information is also wrong, but I did the best my human brain could do. Have fun and be kind to each other. Now go build something!
