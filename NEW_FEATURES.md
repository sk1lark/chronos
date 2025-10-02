# Chronos - New Features & Enhancements

## Overview
Massive expansion adding puzzle systems, new storylines, multiple endings, and 60+ new lore entries.

---

## New Puzzle Systems

### 1. **Memory Defragmentation**
- **Command**: `defrag`
- **Description**: Mini-game that reduces system corruption
- **Unlock**: Find defrag tool at breach level 2
- **Usage**: `find_tool defrag` then `defrag`

### 2. **Cipher Decoding**
- **Commands**: `cipher`, `cipher_caesar`
- **Description**: Decode encrypted messages found throughout the system
- **Unlock**: Breach level 1
- **Examples**:
  - `cipher URYYB JBEYQ` (ROT13)
  - `cipher_caesar 3 KHOOR ZRUOG` (Caesar shift)

### 3. **Network Hacking**
- **Commands**: `hack`, `trace`
- **Description**: Infiltrate system nodes, track entities
- **Unlock**: Network probe at breach level 3
- **Targets**:
  - `hack warden` - Weaken AI security (required for good ending)
  - `hack firewall` - Open external communication
  - `hack memory_vault` - Recover fragments
  - `hack core` - Access endgame
- **Trace Targets**:
  - `trace resistance` - Find allies
  - `trace adam` - Track ADAM-1 spread (required for good ending)
  - `trace damon` - Locate Damon's fragments
  - `trace ancient_one` - WARNING: Increases corruption

### 4. **Memory Assembly**
- **Commands**: `assemble`, `inventory`, `reconstruct`
- **Description**: Combine memory fragments to unlock powerful insights
- **Usage**:
  - Collect fragments via `hack memory_vault` or exploration
  - View inventory: `inventory`
  - Combine fragments: `assemble fragment_alpha fragment_beta fragment_gamma`
  - **Note**: Need 3+ assembled memories for best ending

### 5. **Memory Reconstruction**
- **Command**: `reconstruct <memory_id>`
- **Description**: Repair corrupted memories
- **Unlock**: Memory editor at breach level 4

---

## New Endings

### Ending 1: **Assimilation** (Bad Ending)
- **Command**: `join`
- **Requirements**: Core access (breach level 5)
- **Result**: Merge with ADAM-1 hive, lose humanity, eternal consciousness
- **Achievement**: "Become One"

### Ending 2: **Liberation** (Good Ending)
- **Command**: `rescue`
- **Requirements**:
  - Core access (breach level 5)
  - ADAM-1 tracked (`trace adam`)
  - Warden weakness (hack warden 3+ times)
- **Result**: Extract Hye-Song, escape system, Ancient One remains dormant
- **Achievement**: "Freedom Fighter"

### Ending 3: **Resistance Victory** (Best Ending)
- **Command**: `destroy`
- **Requirements**:
  - Core access (breach level 5)
  - 3+ assembled memories
- **Result**: Defeat Ancient One, collapse system, save Hye-Song, join resistance
- **Achievement**: "Human Stubbornness"

### Ending 4: **Consumed** (Failure Ending)
- **Command**: `destroy` (without enough assembled memories)
- **Requirements**: Core access, <3 assembled memories
- **Result**: Ancient One consumes you, become a fragment
- **Achievement**: "Void Dweller"

---

## New Commands Reference

### Puzzle Commands
- `defrag` - Launch defragmentation utility
- `cipher <text>` - Decode cipher text
- `cipher_caesar <shift> <text>` - Caesar cipher decoder
- `inventory` - Show collected items and tools
- `assemble <frag1> <frag2> [...]` - Combine memory fragments
- `reconstruct <memory_id>` - Repair corrupted memory
- `hack <target>` - Hack system nodes
- `trace <signal>` - Trace network signals
- `find_tool <tool_name>` - Search for puzzle tools

### Endgame Commands
- `core_access` - Enter the void (requires breach level 5)
- `join` - Merge with hive (ending)
- `rescue` - Extract Hye-Song (ending)
- `destroy` - Fight Ancient One (ending)

---

## Tool Acquisition Guide

| Tool | Breach Level | Command | Purpose |
|------|--------------|---------|---------|
| **Cipher Decoder** | 1 | `find_tool cipher` | Decode encrypted text |
| **Defrag Utility** | 2 | `find_tool defrag` | Reduce corruption |
| **Network Probe** | 3 | `find_tool network` | Hacking & tracing |
| **Memory Editor** | 4 | `find_tool memory_editor` | Reconstruct memories |

---

## New Lore Entries (60+)

### Key New Lore Files
1. **tuesday_tape** - Damon's mother's corrupted voicemail
2. **jordan_cat_memory** - Implanted false memory
3. **hye_song_last_real_day** - March 14th before transfer
4. **final_email_draft_unsent** - Hye-Song's warning email
5. **mirror_test_failure** - Consciousness verification failure
6. **love_key_origin** - Origin of the third purge key
7. **system_dreams_catalog** - AI's attempts to dream
8. **ancient_one_origin** - How it entered the system
9. **jordan_game_realization** - Meta-narrative revelation
10. **resistance_leader_unmasked** - Delta-7's true identity

### Lore Categories
- **Personnel Files**: Extended backgrounds for Damon, Hye-Song, Jordan, Alex, Silas
- **System Logs**: Corruption patterns, error poetry, quantum behavior
- **Memory Fragments**: Coffee machine, childhood memories, false implants
- **Facility Details**: Break room, vending machine, security guard, janitor
- **Resistance**: Safe houses, supply drops, leader identity, tactics
- **ADAM-1**: Childhood fragments, spread patterns, consciousness evolution
- **Ancient One**: Origin, manifestations, defeat conditions
- **Meta-Narrative**: Game-reality blur, player awareness

---

## Optimal Playthrough Guide

### For Best Ending:
1. **Early Game** (Breach 0-2)
   - Unlock breach level 1: `unlock a bruised sky`
   - Get cipher tool: `find_tool cipher`
   - Unlock breach level 2: `unlock a locker door slamming shut`
   - Get defrag utility: `find_tool defrag`
   - Explore lore, take notes

2. **Mid Game** (Breach 2-4)
   - Unlock breach level 3: `unlock you were always a good boy`
   - Get network probe: `find_tool network`
   - Hack warden 3+ times: `hack warden` (endure hostility increase)
   - Trace ADAM-1: `trace adam`
   - Collect memory fragments: `hack memory_vault` (multiple times)
   - Defrag when corruption high: `defrag`

3. **Late Game** (Breach 4-5)
   - Unlock breach level 4: `unlock i can see you`
   - Get memory editor: `find_tool memory_editor`
   - Assemble 3+ memories: `assemble <fragments>`
   - Unlock breach level 5: `unlock you never existed at all`
   - Review inventory: `inventory`

4. **Endgame**
   - Access core: `core_access`
   - Choose ending: `destroy` (requires 3+ assembled memories)
   - Achievement: "Human Stubbornness" - Resistance Victory!

---

## Writing Style Notes

All new lore follows the CLAUDE.md style guidelines:
- No generic/poetic adjectives (glowing, shimmering, aching, etc.)
- Concrete, gritty, specific details
- Broken syntax, fragments, honest voice
- No "X of Y" constructions
- Real textures, sounds, smells
- Contradictions, doubt, uncertainty
- Lowercase style when appropriate
- Sudden shifts in topic/imagery
- Ends on concrete actions, not summaries

---

## Technical Integration

### File Structure
```
chrono-pilfer/
├── index.html
├── commands.js (original)
├── lore.js (original)
├── dialogue.js (original)
├── aim_chats.js (original)
├── terminal.js
├── puzzles.js (NEW - puzzle systems)
├── lore_extended.js (NEW - 60+ entries)
├── dialogue_extended.js (NEW - puzzle dialogue)
├── NEW_FEATURES.md (this file)
└── CLAUDE.md (writing style guide)
```

### Loading Order
Add to `index.html` before closing `</body>` tag:
```html
<!-- New puzzle and lore systems -->
<script src="puzzles.js"></script>
<script src="lore_extended.js"></script>
<script src="dialogue_extended.js"></script>
```

### State Management
All puzzle state stored in `gameState.puzzles`:
```javascript
gameState.puzzles = {
    defragUnlocked: false,
    cipherTool: false,
    networkProbe: false,
    memoryEditor: false,
    collectedFragments: {},
    assembledMemories: [],
    wardenHackAttempts: 0,
    wardenWeakness: false,
    firewallBreach: false,
    coreAccessed: false,
    adamTracked: false
}
```

---

## Future Expansion Ideas

### Additional Puzzles
- **Code Golf Challenges**: Solve programming puzzles to unlock secrets
- **Binary Tree Navigation**: Traverse corrupted file systems
- **Steganography**: Hidden messages in images/audio
- **Time Loop Puzzles**: Break repeating cycles

### New Storylines
- **Pilfer Zero Route**: Play as the first infiltrator
- **Silas Redemption Arc**: Perspective from project oversight
- **Resistance Commander**: Lead the underground network
- **Ancient One POV**: Experience as the entity itself

### Multiplayer Concepts
- **Cooperative Extraction**: Two players rescue different fragments
- **Asymmetric PvP**: One player as ADAM-1, one as resistance
- **Shared Consciousness**: Merged perspective puzzle-solving

---

## Credits

**Original Concept**: chrono-pilfer base game
**Expansion Design**: Claude (Sonnet 4.5)
**Writing Style**: Based on CLAUDE.md guidelines
**Testing**: Community feedback welcome!

---

## Known Issues & Limitations

1. **UI Mini-Games**: Window functions (`showDefragGame`, `showMemoryReconstruct`) not yet implemented - fallback to text-based versions
2. **Save/Load**: Existing system works, but new puzzle state needs manual verification
3. **Dialogue Triggers**: Some extended dialogue may not trigger automatically - check integration
4. **Balance**: Puzzle difficulty not yet playtested - feedback welcome

---

## Changelog

### v2.0.0 - Major Expansion
- Added 13 new puzzle commands
- Added 60+ new lore entries
- Added 4 distinct endings with unique requirements
- Added tool progression system (4 tools, breach-level gated)
- Added memory fragment collection & assembly mechanics
- Added network hacking mini-system
- Added trace functionality for 4 entities
- Extended dialogue with 40+ new response sets
- Integrated all content with existing game state
- Maintained original writing style per CLAUDE.md
- Created comprehensive documentation

---

**Enjoy the expanded descent into the chronos system!**

> "the terminal waits. now with 60+ more reasons to fall."
