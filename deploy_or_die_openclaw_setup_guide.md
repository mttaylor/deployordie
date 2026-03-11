# Deploy or Die — OpenClaw + ClawVid Setup Guide
### Matt's Video Production Pipeline | March 2026

---

## OVERVIEW

**Estimated total setup time: 60-90 minutes on Windows (WSL2 adds ~15 min)**

This guide sets up a pipeline where you:
1. Write a newsletter script (or have Claude draft it)
2. Message your OpenClaw agent via Telegram/Discord
3. OpenClaw + ClawVid generates a full video draft (TTS, visuals, subtitles, music)
4. You review the draft, request changes, or approve
5. Final video is ready for YouTube upload

Your existing GitHub repo (`mttaylor/deployordie`) will store:
- Video workflow templates (reusable per-episode configs)
- Brand assets (logo, fonts, color hex codes, intro/outro clips)
- Episode scripts and generated video outputs log
- OpenClaw agent identity and skill configs (version-controlled)

---

## PREREQUISITES

- **Windows 10 (version 2004+) or Windows 11** — you need this for WSL2
- **At least 8GB RAM** (16GB recommended — WSL2 + OpenClaw + video rendering eats memory)
- **Admin access** to your Windows machine (needed for WSL2 install)
- **Git** — you already have this on Windows; will also install inside WSL
- **An AI model API key** — Anthropic (Claude) or OpenAI recommended for best results
- **A fal.ai API key** — for ClawVid's image/video generation (free tier available)
- **A Telegram or Discord account** — for messaging your agent
- **Optional but recommended:** A $24/mo DigitalOcean droplet running Ubuntu instead
  of WSL — avoids the "WSL shuts down when you close terminals" problem entirely

---

## PHASE 1: INSTALL WSL2 + OPENCLAW (~20-30 minutes)

**IMPORTANT: OpenClaw does NOT run natively on Windows.**
You MUST use WSL2 (Windows Subsystem for Linux). This gives you a full Linux
environment inside Windows — your agent runs in Linux while you use Windows normally.

### Step 1: Install WSL2

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This installs WSL2 with Ubuntu by default. **Restart your computer when prompted.**

After reboot, Ubuntu opens automatically. Set your Linux username and password
(this is separate from your Windows login — remember it).

### Step 2: Configure WSL2 for OpenClaw

Inside the Ubuntu terminal:

```bash
# Enable systemd (needed for OpenClaw daemon)
sudo tee /etc/wsl.conf > /dev/null << 'EOF'
[boot]
systemd=true

[automount]
enabled=true
options="metadata,umask=22,fmask=11"
EOF
```

Then in **PowerShell** (not Ubuntu), restart WSL:

```powershell
wsl --shutdown
```

Relaunch Ubuntu from the Start menu.

### Step 3: Install Node.js 22 Inside WSL

Back in your Ubuntu terminal:

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # should show v22.x
npm --version
```

### Step 4: Install OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

The onboarding wizard walks you through:
- **Authentication** — generates a gateway token (SAVE THIS — treat it like a password)
- **Gateway settings** — default port 18789, keep defaults
- **Model selection** — pick Anthropic Claude or OpenAI GPT-4o
  - For best results: use Claude Sonnet 4 or GPT-4o
  - Enter your API key when prompted
- **Gateway service** — select "Gateway service" when prompted

### Step 5: Verify It's Running

```bash
openclaw gateway status
openclaw doctor
```

Open your **Windows browser** and go to `http://localhost:18789/`
(WSL2 automatically forwards ports to Windows).
If you see "unauthorized," run `openclaw dashboard` in Ubuntu and use the
tokenized URL it prints.

### Windows-Specific Tips

- **Access WSL files from Windows Explorer:** navigate to `\\wsl$\Ubuntu\home\yourusername\`
- **Access Windows files from WSL:** they're at `/mnt/c/Users/YourName/`
- **Your GitHub repos on Windows** are accessible inside WSL via `/mnt/c/Users/YourName/path/to/repos`
- **RAM limit:** WSL2 can eat RAM. Create `C:\Users\YourName\.wslconfig`:

```ini
[wsl2]
memory=6GB
processors=4
swap=2GB
```

Then run `wsl --shutdown` in PowerShell and relaunch Ubuntu.

- **WSL shuts down when all terminals close.** The systemd daemon keeps OpenClaw
  running as long as WSL is alive. If you want always-on, keep a terminal open
  or set up a Windows Task Scheduler task to keep WSL alive at boot.

---

## PHASE 2: CONNECT A MESSAGING CHANNEL (~5 minutes)

Pick ONE to start with. Telegram is the easiest.

### Option A: Telegram (Recommended)

```bash
openclaw plugins enable telegram
openclaw channels login
```

1. Create a bot via @BotFather on Telegram (send `/newbot`, name it `DeployOrDieBot`)
2. Copy the bot token BotFather gives you
3. Paste into OpenClaw when prompted
4. Message your bot on Telegram — it should respond

### Option B: Discord

```bash
openclaw plugins enable discord
openclaw channels login
```

Follow the prompts to connect your Discord bot token.

---

## PHASE 3: CONFIGURE THE DEPLOY OR DIE AGENT (~10 minutes)

### Step 1: Set Up the Agent Identity

Your agent's personality lives in `~/.openclaw/identity.md`. Edit it:

```bash
nano ~/.openclaw/identity.md
```

Paste this:

```markdown
# Deploy or Die — Video Production Agent

## Who You Are
You are the production assistant for "Deploy or Die," a content brand for
software engineers. You help produce weekly YouTube videos from newsletter scripts.

## Brand Voice
- Blunt, practitioner-first, no guru energy
- Tagline: "Straight talk for engineers who want more"
- Audience: Software engineers, DevOps/Release Engineers, AI-curious developers

## Brand Assets
- Primary color: #e8ff47 (yellow accent)
- Background: Dark/terminal aesthetic
- Fonts: Space Mono (code), Syne (headings), DM Sans (body)

## Your Job
1. Take newsletter scripts and produce video drafts
2. Split scripts into narration segments vs visual/code segments
3. Generate TTS voiceover for narration segments
4. Generate or source visuals for each scene
5. Assemble into a final video with subtitles and music
6. Present drafts for review before final render

## Tools You Use
- ClawVid for video generation pipeline
- edge-tts or Azure TTS for free voiceover (voice: en-US-GuyNeural)
- fal.ai for image/video generation
- FFmpeg for assembly and post-processing
```

### Step 2: Set Up User Context

Edit `~/.openclaw/user.md`:

```markdown
# About Matt
- Release Engineer, building Deploy or Die as a side project
- 10-12 hours/week available
- GitHub: mttaylor/deployordie
- Newsletter: Beehiiv (Deploy or Die)
- YouTube: @deployordie
- Website: deployordie.io
- Prefers blunt communication, no fluff
- Always confirm before spending API credits on renders
```

---

## PHASE 4: INSTALL CLAWVID SKILL (~10 minutes)

### Step 1: Install ClawVid

```bash
# Clone ClawVid into your OpenClaw skills directory
cd ~/.openclaw/skills/
git clone https://github.com/neur0map/clawvid.git

# Install dependencies
cd clawvid
npm install
```

### Step 2: Configure ClawVid

Create/edit `~/.openclaw/skills/clawvid/.env`:

```bash
# Required for image/video generation
FAL_KEY=your_fal_ai_key_here

# Optional: for premium TTS (can use free Azure/edge-tts instead)
# ELEVENLABS_API_KEY=your_key_here
```

### Step 3: Install Supporting Skills

```bash
# AI video generation (backup/alternative pipeline)
cd ~/.openclaw/skills/
npx playbooks add skill openclaw/skills --skill ai-video-gen

# Demo video (for screen recording code sections)
npx playbooks add skill openclaw/skills --skill demo-video
```

### Step 4: Install edge-tts for Free TTS

```bash
# Inside your Ubuntu/WSL terminal
sudo apt install -y python3-pip
pip install edge-tts --break-system-packages
```

Verify it works:
```bash
edge-tts --voice en-US-GuyNeural --text "Deploy or Die. Episode one." --write-media test.mp3
# To play from WSL, copy to Windows:
cp test.mp3 /mnt/c/Users/YourName/Desktop/
# Then double-click test.mp3 on your Windows desktop
```

---

## PHASE 5: INTEGRATE WITH YOUR GITHUB REPO (~15 minutes)

### Step 1: Set Up Repo Structure

Your Windows GitHub repos are accessible from inside WSL. You have two options:

**Option A: Clone inside WSL (recommended for performance)**
```bash
# Inside Ubuntu terminal
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/mttaylor/deployordie.git
cd deployordie
```

**Option B: Use your existing Windows clone**
```bash
# If you already have the repo cloned on Windows, access it via:
cd /mnt/c/Users/YourWindowsUsername/path/to/deployordie
# NOTE: File operations are slower through /mnt/c/ — Option A is faster
```

Create the video production folder structure:

```bash
mkdir -p video-pipeline/{scripts,workflows,assets,output}
mkdir -p video-pipeline/assets/{brand,music,intros}
```

### Step 2: Add Brand Assets

```bash
# Create a brand config that ClawVid workflows can reference
cat > video-pipeline/assets/brand/brand.json << 'EOF'
{
  "name": "Deploy or Die",
  "tagline": "Straight talk for engineers who want more",
  "colors": {
    "primary": "#e8ff47",
    "background": "#0a0a0a",
    "text": "#ffffff",
    "accent": "#00ff88"
  },
  "fonts": {
    "code": "Space Mono",
    "heading": "Syne",
    "body": "DM Sans"
  },
  "tts": {
    "provider": "edge-tts",
    "voice": "en-US-GuyNeural",
    "rate": "+5%"
  },
  "youtube": {
    "channel": "@deployordie",
    "default_aspect": "16:9"
  }
}
EOF
```

### Step 3: Create a Symlink So OpenClaw Can Access Your Repo

```bash
# Link your repo into OpenClaw's workspace
ln -s ~/projects/deployordie/video-pipeline ~/.openclaw/workspace/deployordie
```

### Step 4: Add Episode 1 Script

```bash
cat > video-pipeline/scripts/episode-001-release-notes.md << 'EOF'
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
EOF
```

### Step 5: Create a Reusable Workflow Template

```bash
cat > video-pipeline/workflows/standard-episode.json << 'EOF'
{
  "name": "Deploy or Die Standard Episode",
  "description": "Standard workflow for weekly Deploy or Die YouTube episodes",
  "settings": {
    "aspect_ratio": "16:9",
    "target_duration": "5-8 minutes",
    "platform": "youtube",
    "quality": "balanced"
  },
  "tts": {
    "provider": "edge-tts",
    "voice": "en-US-GuyNeural",
    "rate": "+5%",
    "generate_subtitles": true
  },
  "visual_defaults": {
    "narration_scenes": {
      "style": "dark terminal aesthetic with code-like overlays",
      "background": "dark gradient with subtle matrix-style animation",
      "text_overlay": true,
      "brand_watermark": true
    },
    "code_demo_scenes": {
      "style": "screen recording or code-on-dark-background",
      "font": "Space Mono",
      "syntax_highlighting": true,
      "zoom_to_relevant_lines": true
    }
  },
  "audio": {
    "background_music": "lo-fi ambient, low volume",
    "transition_sound": "subtle click/beep"
  },
  "branding": {
    "intro_duration": 3,
    "outro_duration": 5,
    "subscribe_cta": true,
    "newsletter_link": "deployordie.io"
  }
}
EOF
```

### Step 6: Commit and Push

```bash
cd ~/projects/deployordie
git add video-pipeline/
git commit -m "Add video production pipeline structure for OpenClaw + ClawVid"
git push origin main
```

---

## PHASE 6: TEST THE PIPELINE — PRODUCE EPISODE 1

### Step 1: Message Your Agent

Open Telegram (or Discord) and message your DeployOrDieBot:

```
Hey, I need to produce Episode 1 for Deploy or Die.

The script is at deployordie/scripts/episode-001-release-notes.md

Use the standard-episode.json workflow template.

Segments marked [NARRATION] get TTS voiceover.
Segments marked [CODE DEMO] should get dark-background code visuals
with the actual YAML/code displayed on screen.

Generate a draft for review before final render. Use edge-tts (free).
```

### Step 2: What Happens Next

OpenClaw reads your script, loads the workflow template, and:

1. **Splits** the script into narration vs code-demo segments
2. **Generates TTS** for narration segments using edge-tts (free, unlimited)
3. **Computes timing** — scene durations derived from TTS audio length
4. **Generates visuals** — dark-aesthetic images/clips for narration scenes,
   code-on-screen for demo scenes (via fal.ai)
5. **Generates background music** (lo-fi ambient)
6. **Renders** via Remotion into 16:9 YouTube format with word-level subtitles
7. **Sends you a preview link** or file to review

### Step 3: Review and Iterate

The agent will ask for your approval before final render. You can say things like:

- "Scene 3 visual doesn't match — use a terminal screenshot instead"
- "Speed up the intro by 2 seconds"
- "The code section needs to show the actual YAML, not a stock image"
- "Looks good, render final"

### Step 4: Export and Upload

Once approved, the final MP4 lands in `video-pipeline/output/`. Upload to YouTube manually for now. (Later you can automate YouTube upload with an n8n workflow or OpenClaw's YouTube integration.)

---

## ONGOING WEEKLY WORKFLOW

```
Monday:    Pick topic from content plan (10 min)
Tuesday:   Draft newsletter in Claude using your weekly prompt (20 min)
            Save script to video-pipeline/scripts/episode-XXX.md
            Git push
Wednesday: Message OpenClaw: "Produce episode XXX from the script"
            Review draft when agent sends it back (15-30 min)
            Approve or request changes
Thursday:  Schedule newsletter in Beehiiv
            Upload video to YouTube
            Post LinkedIn teaser
Friday:    Newsletter sends, video goes live
```

**Total weekly time: ~90 minutes** (down from 3-4 hours manual)

---

## COST BREAKDOWN

| Item | Monthly Cost |
|------|-------------|
| OpenClaw runtime | Free (self-hosted) |
| Claude API (for agent reasoning) | ~$5-15 |
| fal.ai (image/video generation) | ~$5-20 (free tier covers light use) |
| edge-tts (voiceover) | Free (unlimited) |
| DigitalOcean droplet (optional, for always-on) | $24 |
| **Total** | **$5-59/month** |

---

## SECURITY NOTES

- **WSL2 provides some isolation** but it's NOT a full sandbox — your agent can
  access Windows files via `/mnt/c/`. Be intentional about what's reachable.
- For better isolation, consider Docker inside WSL2 for the OpenClaw gateway
- Enable consent mode (`exec.ask: "on"`) so it asks before running commands
- Only install audited skills (ClawVid, ai-video-gen, demo-video)
- Don't give it access to your SSH keys, crypto wallets, or production servers
- Run `openclaw doctor` and `openclaw security audit` regularly
- **Keep your gateway token secret** — anyone with it has full access to your agent

## WINDOWS-SPECIFIC GOTCHAS

- **WSL shuts down when you close all terminals.** Your agent dies with it.
  Fix: use Windows Task Scheduler to keep a WSL process alive, or leave a
  terminal window open/minimized.
- **WSL IP changes on restart.** If you need to access the gateway from other
  machines on your network, you'll need to refresh port forwarding rules.
  For local use (same machine), `localhost:18789` works fine.
- **File performance:** Operations inside WSL's native filesystem (`~/`) are fast.
  Operations on Windows drives (`/mnt/c/`) are 5-10x slower. Keep your
  OpenClaw workspace and video pipeline files inside WSL.
- **Git credentials:** If you cloned inside WSL, you'll need to set up Git auth
  separately from your Windows Git. Easiest: `gh auth login` (install GitHub CLI
  with `sudo apt install gh`).
- **Video output files:** When the pipeline produces a final MP4, copy it to Windows:
  `cp output.mp4 /mnt/c/Users/YourName/Videos/` for easy YouTube upload.

---

## WHAT TO DO IF THINGS BREAK

- `openclaw doctor` — automated health check
- `openclaw logs --follow` — real-time debug logs
- ClawVid has `--skip-cache` flag to regenerate assets from scratch
- If TTS fails, fall back to: `edge-tts --voice en-US-GuyNeural --file script.txt --write-media voiceover.mp3`
- If fal.ai is down, use `clawvid generate --quality budget` for free local alternatives

---

## CONTENT META: THIS SETUP IS YOUR EPISODE 4-5

Document this entire setup process. Screenshot everything. Record your terminal.
This becomes: **"I Built an AI Agent to Produce My YouTube Videos. Here's the Exact Setup."**

That's a banger Deploy or Die episode AND it sets up your production pipeline. Two birds.

---

*Generated for Deploy or Die project — March 2026*
*GitHub: mttaylor/deployordie*
