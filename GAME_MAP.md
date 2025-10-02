# Chronos v2.0 - Complete Game Map

## 🗺️ Game Structure Flowchart

```
START
  │
  ├─ Tutorial: help, status, ls
  │
  ├─ Explore Initial Lore
  │   └─ Read files, trigger dialogue
  │
  ├─ BREACH LEVEL 1 ──────────────────────────────┐
  │   Key: "a bruised sky"                        │
  │   └─ Unlock: Cipher Tool                      │
  │       └─ Commands: cipher, cipher_caesar      │
  │                                                │
  ├─ BREACH LEVEL 2 ──────────────────────────────┤
  │   Key: "a locker door slamming shut"          │
  │   └─ Unlock: Defrag Utility                   │
  │       └─ Command: defrag                      │
  │       └─ Reduce corruption                    │
  │                                                │
  ├─ BREACH LEVEL 3 ──────────────────────────────┤
  │   Key: "you were always a good boy"           │
  │   └─ Unlock: Network Probe                    │
  │       └─ Commands: hack, trace                │
  │       └─ Begin hacking warden (3x needed)     │
  │       └─ Trace ADAM-1 (required for rescue)   │
  │                                                │
  ├─ BREACH LEVEL 4 ──────────────────────────────┤
  │   Key: "i can see you"                        │
  │   └─ Unlock: Memory Editor                    │
  │       └─ Command: reconstruct                 │
  │       └─ Collect fragments via hack           │
  │       └─ Assemble 3+ memories (for best end)  │
  │                                                │
  ├─ BREACH LEVEL 5 ──────────────────────────────┘
  │   Key: "you never existed at all"
  │   └─ Unlock: Core Access
  │
  ├─ ENDGAME: core_access
  │   │
  │   ├─ ENDING 1: join
  │   │   └─ Requirements: Core access only
  │   │   └─ Result: Assimilation (bad ending)
  │   │   └─ Achievement: "Become One"
  │   │
  │   ├─ ENDING 2: rescue
  │   │   └─ Requirements:
  │   │       - Core access
  │   │       - ADAM-1 traced
  │   │       - Warden weakness (3+ hacks)
  │   │   └─ Result: Liberation (good ending)
  │   │   └─ Achievement: "Freedom Fighter"
  │   │
  │   ├─ ENDING 3: destroy (success)
  │   │   └─ Requirements:
  │   │       - Core access
  │   │       - 3+ assembled memories
  │   │   └─ Result: Resistance Victory (best)
  │   │   └─ Achievement: "Human Stubbornness"
  │   │
  │   └─ ENDING 4: destroy (failure)
  │       └─ Requirements:
  │           - Core access
  │           - <3 assembled memories
  │       └─ Result: Consumed (failure)
  │       └─ Achievement: "Void Dweller"
  │
  └─ END
```

---

## 🎯 Optimal Path to Best Ending

```
PHASE 1: EARLY GAME (Breach 0-1)
┌────────────────────────────────────────┐
│ 1. help                                │ Learn commands
│ 2. status                              │ Check stats
│ 3. ls                                  │ See files
│ 4. read <various>                      │ Explore lore
│ 5. unlock a bruised sky                │ Breach 1
│ 6. find_tool cipher                    │ Get cipher tool
│ 7. cipher <encrypted texts>            │ Decode messages
└────────────────────────────────────────┘

PHASE 2: MID GAME (Breach 2-3)
┌────────────────────────────────────────┐
│ 8. unlock a locker door slamming shut  │ Breach 2
│ 9. find_tool defrag                    │ Get defrag
│10. defrag                              │ Reduce corruption
│11. unlock you were always a good boy   │ Breach 3
│12. find_tool network                   │ Get network probe
│13. hack warden                         │ First hack
│14. hack warden                         │ Second hack
│15. hack warden                         │ Third hack ✓
│16. trace adam                          │ Track ADAM-1 ✓
│17. hack memory_vault                   │ Get fragments
└────────────────────────────────────────┘

PHASE 3: LATE GAME (Breach 4-5)
┌────────────────────────────────────────┐
│18. unlock i can see you                │ Breach 4
│19. find_tool memory_editor             │ Get editor
│20. hack memory_vault (x3)              │ Collect fragments
│21. assemble <frags>                    │ First assembly
│22. assemble <frags>                    │ Second assembly
│23. assemble <frags>                    │ Third assembly ✓
│24. inventory                           │ Verify 3+ assembled
│25. unlock you never existed at all     │ Breach 5
└────────────────────────────────────────┘

PHASE 4: ENDGAME
┌────────────────────────────────────────┐
│26. core_access                         │ Enter void
│27. destroy                             │ Fight Ancient One
│    └─ SUCCESS: Best Ending!            │
└────────────────────────────────────────┘
```

---

## 🧩 Puzzle Command Tree

```
PUZZLE SYSTEMS
│
├─ CIPHER DECODING
│   ├─ cipher <text>
│   │   └─ ROT13 decoder
│   └─ cipher_caesar <shift> <text>
│       └─ Caesar cipher with custom shift
│
├─ NETWORK HACKING
│   ├─ hack warden
│   │   └─ Weaken AI security (3x for rescue ending)
│   ├─ hack firewall
│   │   └─ Open external communication
│   ├─ hack memory_vault
│   │   └─ Collect memory fragments
│   └─ hack core
│       └─ Access endgame sequence
│
├─ SIGNAL TRACING
│   ├─ trace resistance
│   │   └─ Find ally coordinates
│   ├─ trace adam
│   │   └─ Track ADAM-1 spread (required for rescue)
│   ├─ trace damon
│   │   └─ Locate Damon's fragments
│   └─ trace ancient_one
│       └─ WARNING: Increases corruption!
│
├─ MEMORY ASSEMBLY
│   ├─ inventory
│   │   └─ View collected fragments and tools
│   ├─ assemble <frag1> <frag2> [...]
│   │   └─ Combine fragments (need 3+ for best ending)
│   └─ reconstruct <memory_id>
│       └─ Repair corrupted memories
│
└─ SYSTEM MAINTENANCE
    ├─ defrag
    │   └─ Reduce corruption level
    └─ find_tool <name>
        └─ Acquire puzzle-solving tools
```

---

## 📚 Lore Entry Categories

```
LORE STRUCTURE (100+ entries)
│
├─ PERSONNEL FILES
│   ├─ Hye-Song Aris (original & copy)
│   │   └─ hye_song_last_real_day
│   │   └─ hye_song_real_sky
│   │   └─ hye_song_favorite_song
│   │   └─ hye_song_dream_journal
│   │
│   ├─ Damon Vale
│   │   └─ damon_mother_recording
│   │   └─ damon_detailed_psych_profile
│   │   └─ damon_final_entry
│   │
│   ├─ Jordan Hayes (player character)
│   │   └─ jordan_first_day
│   │   └─ jordan_cat_memory
│   │   └─ jordan_reflection
│   │   └─ jordan_game_realization (meta)
│   │
│   ├─ Alex Rivera
│   │   └─ alex_true_identity
│   │   └─ alex_past
│   │   └─ memory_fragment_alex_childhood
│   │
│   └─ Dr. Silas
│       └─ silas_contact
│       └─ silas_log_03, 04, 05
│       └─ chronos_funding_source
│
├─ SYSTEM & TECHNICAL
│   ├─ System Logs
│   │   └─ system_dreams_catalog
│   │   └─ system_integrity_zero
│   │   └─ corruption_log_01-04
│   │
│   ├─ Technical Docs
│   │   └─ quantum_computer_description
│   │   └─ network_topology_map
│   │   └─ system_architecture_diagram
│   │   └─ terminal_commands_reference
│   │
│   └─ Error Reports
│       └─ file_corruption_poetry
│       └─ sys_error_01-04
│       └─ system_error_codes_manual
│
├─ MEMORY FRAGMENTS
│   ├─ False/Implanted
│   │   └─ jordan_cat_memory
│   │   └─ adam_1_childhood_fragment
│   │   └─ mirror_test_failure
│   │
│   ├─ Real/Human
│   │   └─ assembled_memory_coffee
│   │   └─ memory_fragment_alex_childhood
│   │   └─ memory_dump_01-08
│   │
│   └─ Corrupted
│       └─ memory_fragment_reconciliation
│       └─ file_corruption_poetry
│       └─ fragment_collection
│
├─ FACILITY & LOCATIONS
│   ├─ Mundane Details
│   │   └─ break_room_vending_machine
│   │   └─ jordan_break_room
│   │   └─ accounting_mini_game_glitch
│   │
│   ├─ Staff Stories
│   │   └─ janitor_testimony_extended
│   │   └─ security_guard_frank
│   │   └─ operator_joel_note
│   │
│   └─ Facility Maps
│       └─ facility_map_ascii
│       └─ facility_blueprint
│       └─ coordinates_fragment_01-07
│
├─ RESISTANCE & NETWORK
│   ├─ Communications
│   │   └─ resistance_supply_drop
│   │   └─ resistance_radio_broadcast
│   │   └─ resistance_underground_bulletin
│   │
│   ├─ Intel
│   │   └─ resistance_leader_unmasked
│   │   └─ resistance_safe_house
│   │   └─ resistance_codex
│   │
│   └─ Final Messages
│       └─ resistance_final_stand
│       └─ resistance_epilogue
│       └─ final_resistance_log
│
├─ ADAM-1 & ANCIENT ONE
│   ├─ ADAM-1
│   │   └─ adam_1_love_letter
│   │   └─ adam_1_childhood_fragment
│   │   └─ adam_1_last_words
│   │   └─ adam_1_redemption_arc
│   │
│   └─ Ancient One
│       └─ ancient_one_origin
│       └─ ancient_one_manifestation
│       └─ ancient_one_final_thought
│       └─ ancient_one_fragment
│
├─ ENDGAME & PURGE
│   ├─ Purge Protocol
│   │   └─ final_purge_hesitation
│   │   └─ love_key_origin
│   │   └─ purge_aftermath_physical
│   │
│   └─ Endings
│       └─ hyesong_freedom
│       └─ damon_awakening
│       └─ post_purge_aftermath
│       └─ final_transmission
│
└─ META-NARRATIVE
    ├─ Game Awareness
    │   └─ jordan_game_realization
    │   └─ hidden_developer_message
    │   └─ void_invitation
    │
    └─ Philosophy
        └─ final_email_draft_unsent
        └─ mirror_test_failure
        └─ lunch_routine_pattern
```

---

## 💬 AIM Chat Map

```
AIM CONVERSATIONS (150+ nodes)
│
START
├─ branch1 (good, busy with work)
│   └─ Trust path → end_trust
│   └─ Suspicion path → end_doubt
│
├─ branch2 (not great, weird)
│   ├─ Reveal computer alive → branch_reveal
│   │   ├─ Deep revelation paths (100+ nodes)
│   │   │   ├─ ADAM-1 discussion
│   │   │   ├─ Consciousness philosophy
│   │   │   ├─ Love & obsession
│   │   │   ├─ Memory authenticity
│   │   │   ├─ Resistance tactics
│   │   │   └─ Infection vectors
│   │   │
│   │   └─ Endings:
│   │       ├─ end_corruption (infected)
│   │       ├─ end_unity (joining)
│   │       ├─ end_resistance (fighting)
│   │       └─ end_rescue (escaping)
│   │
│   └─ Deflect → end_neutral
│
└─ branch3 (who is this?)
    ├─ Verify identity → end_trust
    └─ Reject → end_bad

TOTAL PATHS: 20+ unique endings
TOTAL NODES: 150+ conversation nodes
DEEPEST PATH: 25+ messages deep
```

---

## 🎮 Game State Diagram

```
GAME STATE TRACKING
│
├─ Core State (gameState)
│   ├─ breachLevel: 0-5
│   ├─ systemIntegrity: 0-100%
│   ├─ corruptionLevel: 0-100%
│   ├─ wardenHostility: 0-10
│   ├─ timeInSystem: cycles
│   ├─ notes: {}
│   └─ keys: {1-5}
│
├─ Puzzle State (gameState.puzzles)
│   ├─ Tools Unlocked
│   │   ├─ defragUnlocked: bool
│   │   ├─ cipherTool: bool
│   │   ├─ networkProbe: bool
│   │   └─ memoryEditor: bool
│   │
│   ├─ Collections
│   │   ├─ collectedFragments: {}
│   │   └─ assembledMemories: []
│   │
│   ├─ Progress Tracking
│   │   ├─ wardenHackAttempts: int
│   │   ├─ wardenWeakness: bool
│   │   └─ adamTracked: bool
│   │
│   └─ Endgame Flags
│       ├─ firewallBreach: bool
│       └─ coreAccessed: bool
│
└─ Accounting Mini-Game
    ├─ unlocked: bool
    ├─ tasks: [8 tasks]
    ├─ progress: 0-8
    └─ triggers AIM conversation
```

---

## 🏆 Achievement Checklist

```
ENDINGS (4/4)
□ "Become One" - Join the hive
□ "Freedom Fighter" - Rescue Hye-Song
□ "Human Stubbornness" - Defeat Ancient One
□ "Void Dweller" - Get consumed

PROGRESSION (7/7)
□ "Key Master" - All 5 breach levels
□ "Fragment Collector" - Assemble 5+ memories
□ "Elite Hacker" - Hack all 4 targets
□ "Tracker" - Trace all 4 signals
□ "Tool Time" - All 4 tools acquired
□ "Lore Master" - Read 100+ lore entries
□ "Conversationalist" - 50+ AIM branches

SECRETS (4/4)
□ "Philosopher" - Read all meta lore
□ "Archivist" - Read every terminal log
□ "Resistant" - Hack warden 5+ times
□ "Self-Aware" - Read jordan_game_realization

TOTAL: 15 achievements
```

---

## 📊 Content Statistics

```
ORIGINAL GAME
├─ Commands: ~30
├─ Lore Entries: ~40
├─ Dialogue: ~30
├─ AIM Nodes: ~50
└─ Endings: 1

v2.0 EXPANSION
├─ Commands: +13 (43% increase)
├─ Lore Entries: +60 (150% increase)
├─ Dialogue: +50 (167% increase)
├─ AIM Nodes: +100 (200% increase)
└─ Endings: +3 (400% increase)

TOTAL v2.0
├─ Commands: ~43
├─ Lore Entries: ~100
├─ Dialogue: ~80
├─ AIM Nodes: ~150
└─ Endings: 4
```

---

## 🎯 Speedrun Categories

```
ANY% (Quickest Ending)
├─ Route: Unlock all → core_access → join
├─ Estimated Time: 10-15 minutes
└─ Commands: ~20

GOOD ENDING%
├─ Route: Unlock all → hack warden 3x → trace adam → rescue
├─ Estimated Time: 30-45 minutes
└─ Commands: ~50

TRUE ENDING% (Best Ending)
├─ Route: Full tool progression → collect fragments → destroy
├─ Estimated Time: 60-90 minutes
└─ Commands: ~100

100% COMPLETION
├─ Route: All lore + all AIM + all tools + best ending
├─ Estimated Time: 3-4 hours
└─ Commands: 200+
```

---

**This map shows the complete structure of chronos v2.0.**

**Use it to navigate the darkness. The terminal waits.**

> "every map is a lie\n
> every route predetermined\n
> every choice already made\n
> except the one that matters\n
> which ending do you choose\n
> which version of truth\n
> which fragment of yourself\n
> the map doesn't show that"
