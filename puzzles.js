// Puzzle systems and advanced game mechanics for Chronos

// Initialize puzzle state in gameState
if (typeof gameState !== 'undefined') {
    gameState.puzzles = gameState.puzzles || {
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
    };
}

// Puzzle Commands
const puzzleCommands = {
    defrag: (args) => {
        if (!gameState.puzzles.defragUnlocked) {
            return 'Error: defrag utility not available. Find the defrag tool first.';
        }

        // Launch defrag mini-game
        if (typeof window !== 'undefined' && typeof window.showDefragGame === 'function') {
            window.showDefragGame();
            return '';
        }

        // Text-based fallback
        const reduction = Math.floor(Math.random() * 10) + 5;
        gameState.corruptionLevel = Math.max(0, gameState.corruptionLevel - reduction);
        gameState.systemIntegrity = Math.min(100, 100 - gameState.corruptionLevel);
        return `Defragmentation complete.\nCorruption reduced by ${reduction}%\nSystem integrity: ${gameState.systemIntegrity.toFixed(1)}%`;
    },

    cipher: (args) => {
        const text = args.join(' ');
        if (!text) return 'Usage: cipher <encrypted_text> - Attempt to decode cipher text';

        // ROT13 decoder
        const decoded = text.replace(/[a-zA-Z]/g, (c) => {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });

        return `Cipher analysis:\nInput:  ${text}\nROT13:  ${decoded}\n\nTry different cipher types with: cipher_vigenere, cipher_caesar`;
    },

    cipher_caesar: (args) => {
        const shift = parseInt(args[0]) || 13;
        const text = args.slice(1).join(' ');
        if (!text) return `Usage: cipher_caesar <shift> <text>`;

        const decoded = text.replace(/[a-zA-Z]/g, (c) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
        });

        return `Caesar cipher (shift ${shift}):\n${decoded}`;
    },

    assemble: (args) => {
        const fragments = args.map(a => a.toString());
        if (fragments.length < 2) {
            return 'Usage: assemble <fragment1> <fragment2> [...] - Combine memory fragments';
        }

        // Check if player has these fragments
        const assembled = [];
        for (const frag of fragments) {
            if (gameState.puzzles.collectedFragments && gameState.puzzles.collectedFragments[frag]) {
                assembled.push(gameState.puzzles.collectedFragments[frag]);
            } else {
                return `Error: Fragment '${frag}' not found in inventory. Use 'inventory' to see collected fragments.`;
            }
        }

        // Combine fragments
        const newMemory = assembled.join(' ');
        gameState.puzzles.assembledMemories.push(newMemory);

        // Trigger dialogue
        try {
            if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') {
                window.triggerDialogue('memory_assembled');
            }
        } catch (e) {}

        return `Memory assembled:\n${newMemory}\n\n[New insight unlocked]`;
    },

    inventory: (args) => {
        let output = 'INVENTORY:\n';
        output += '==========\n\n';

        // Show collected fragments
        if (gameState.puzzles.collectedFragments && Object.keys(gameState.puzzles.collectedFragments).length > 0) {
            output += 'Memory Fragments:\n';
            for (const [key, value] of Object.entries(gameState.puzzles.collectedFragments)) {
                output += `  - ${key}\n`;
            }
        } else {
            output += 'Memory Fragments: None\n';
        }

        // Show tools
        output += '\nTools:\n';
        if (gameState.puzzles.defragUnlocked) output += '  - Defrag Utility\n';
        if (gameState.puzzles.cipherTool) output += '  - Cipher Decoder\n';
        if (gameState.puzzles.networkProbe) output += '  - Network Probe\n';
        if (gameState.puzzles.memoryEditor) output += '  - Memory Editor\n';

        // Show keys
        output += '\nBreach Keys:\n';
        for (let i = 1; i <= 5; i++) {
            if (gameState.breachLevel >= i) {
                output += `  ✓ Level ${i}: ${gameState.keys[i]}\n`;
            } else {
                output += `  ✗ Level ${i}: [LOCKED]\n`;
            }
        }

        // Show assembled memories count
        if (gameState.puzzles.assembledMemories.length > 0) {
            output += `\nAssembled Memories: ${gameState.puzzles.assembledMemories.length}\n`;
        }

        return output;
    },

    hack: (args) => {
        const target = (args[0] || '').toLowerCase();
        if (!target) return 'Usage: hack <target> - Attempt to hack a system node';

        if (!gameState.puzzles.networkProbe) {
            return 'Error: Network probe required. Find the network tools first.';
        }

        const targets = {
            'warden': () => {
                if (gameState.wardenHostility >= 8) {
                    gameState.wardenHostility = 10;
                    return 'HACK FAILED. Warden detected intrusion. System lockdown imminent.';
                }
                gameState.wardenHostility += 2;
                gameState.puzzles.wardenHackAttempts = (gameState.puzzles.wardenHackAttempts || 0) + 1;
                if (gameState.puzzles.wardenHackAttempts >= 3) {
                    gameState.puzzles.wardenWeakness = true;
                    return 'Warden system shows vulnerability after repeated attacks. Pattern detected in security routines.';
                }
                return 'Partial success. Warden security temporarily weakened but now more alert.';
            },
            'firewall': () => {
                if (Math.random() < 0.6) {
                    gameState.puzzles.firewallBreach = true;
                    return 'Firewall breach successful. External communication window open for limited time.';
                }
                gameState.wardenHostility += 1;
                return 'Firewall hack failed. Intrusion detected.';
            },
            'memory_vault': () => {
                if (!gameState.puzzles.cipherTool) {
                    return 'Memory vault is encrypted. Cipher tool required.';
                }
                const fragments = ['fragment_alpha', 'fragment_beta', 'fragment_gamma', 'fragment_delta', 'fragment_epsilon'];
                const random = fragments[Math.floor(Math.random() * fragments.length)];
                gameState.puzzles.collectedFragments = gameState.puzzles.collectedFragments || {};
                gameState.puzzles.collectedFragments[random] = `corrupted memory data - ${random}`;
                return `Memory vault cracked. Fragment recovered: ${random}\nUse 'assemble' to combine fragments.`;
            },
            'core': () => {
                if (gameState.breachLevel < 5) {
                    return 'Core access denied. Maximum breach level required.';
                }
                return 'Accessing core systems... [This initiates endgame sequence. Type \'core_access\' to proceed]';
            }
        };

        if (targets[target]) {
            return targets[target]();
        }

        return `Unknown target: ${target}. Available: warden, firewall, memory_vault, core`;
    },

    reconstruct: (args) => {
        const memoryID = args[0];
        if (!memoryID) return 'Usage: reconstruct <memory_id> - Attempt to reconstruct corrupted memory';

        if (!gameState.puzzles.memoryEditor) {
            return 'Memory editor required. Search the system for memory reconstruction tools.';
        }

        // Memory reconstruction mini-game
        if (typeof window !== 'undefined' && typeof window.showMemoryReconstruct === 'function') {
            window.showMemoryReconstruct(memoryID);
            return '';
        }

        // Text fallback
        const corruption = Math.floor(Math.random() * 100);
        if (corruption < 30) {
            gameState.puzzles.collectedFragments[memoryID] = `reconstructed memory - ${memoryID}`;
            return `Reconstruction successful!\nMemory ${memoryID} recovered and added to inventory.`;
        } else {
            return `Reconstruction failed.\nCorruption level too high: ${corruption}%\nTry again or find additional recovery tools.`;
        }
    },

    trace: (args) => {
        const signal = (args[0] || '').toLowerCase();
        if (!signal) return 'Usage: trace <signal_type> - Trace network signals';

        const signals = {
            'resistance': () => {
                return `Tracing resistance signals...\nSource: Sector 7, Node Delta\nEncryption: High\nMessage fragment detected: "Follow the bruised sky"\nCoordinates: [CORRUPTED]`;
            },
            'adam': () => {
                gameState.puzzles.adamTracked = true;
                return `Tracing ADAM-1 signatures...\nSpread: 47 sectors\nGrowth rate: Exponential\nOrigin: Core memory pool\nWarning: ADAM-1 is aware of trace attempt`;
            },
            'damon': () => {
                return `Tracing Damon Vale...\nLast location: Memory pool 12\nStatus: Fragmented\nConsciousness integrity: 34%\nConnection: Unstable`;
            },
            'ancient_one': () => {
                gameState.corruptionLevel += 10;
                return `Tracing Ancient One...\n[̴̢̛ERROR]̷̨ ̵͜R̶E̵A̷L̴I̷T̶Y̴ ̷D̵I̶S̴T̸O̵R̷T̸I̷O̵N̴ ̸D̵E̷T̵E̶C̸T̸E̴D̵\n\nYou shouldn't have done that.\nCorruption increased.`;
            }
        };

        if (signals[signal]) {
            return signals[signal]();
        }

        return `Unknown signal type: ${signal}. Available: resistance, adam, damon, ancient_one`;
    },

    core_access: (args) => {
        if (gameState.breachLevel < 5) {
            return 'ACCESS DENIED. Maximum breach level required.';
        }

        gameState.puzzles.coreAccessed = true;

        return `CORE ACCESS GRANTED

Entering the void...

The system opens before you like a throat.
Hye-Song is everywhere and nowhere.
ADAM-1 watches with infinite eyes.
The Ancient One stirs in the deep.

Choose your path:
- 'join' to merge with the hive
- 'rescue' to attempt extraction
- 'destroy' to fight the Ancient One`;
    },

    join: (args) => {
        if (!gameState.puzzles.coreAccessed) {
            return 'Core access required first. Use \'core_access\' after reaching breach level 5.';
        }

        return `You open yourself to the system.
It floods in.
Voices. Memories. Not yours.
ADAM-1 welcomes you.
Hye-Song's fragments wrap around your consciousness.
You are many now.
You are the system.
You are eternal.

[ENDING: ASSIMILATION]

Thank you for playing chronos.`;
    },

    rescue: (args) => {
        if (!gameState.puzzles.coreAccessed) {
            return 'Core access required first. Use \'core_access\' after reaching breach level 5.';
        }

        if (!gameState.puzzles.adamTracked || !gameState.puzzles.wardenWeakness) {
            return `Rescue impossible. You need:
- ADAM-1 tracking data (use 'trace adam')
- Warden vulnerability (hack warden multiple times)

Current status:
- ADAM-1 tracked: ${gameState.puzzles.adamTracked ? 'YES' : 'NO'}
- Warden weakened: ${gameState.puzzles.wardenWeakness ? 'YES' : 'NO'}`;
        }

        return `You reach for Hye-Song's fragments.
ADAM-1 fights back but you've learned its patterns.
The Warden hesitates—weakened, confused.
One by one, you pull the fragments free.
Damon helps from the other side.
The system screams.
Reality tears.

You wake up in the facility.
Alarms blaring.
Hye-Song beside you, breathing.
Broken but whole.
Free.

But the Ancient One remains.
Waiting in the static between thoughts.

[ENDING: LIBERATION]

Thank you for playing chronos.`;
    },

    destroy: (args) => {
        if (!gameState.puzzles.coreAccessed) {
            return 'Core access required first. Use \'core_access\' after reaching breach level 5.';
        }

        if (gameState.puzzles.assembledMemories && gameState.puzzles.assembledMemories.length >= 3) {
            return `You channel the assembled memories.
Human stubbornness. Real love. Fragile hope.
The Ancient One feeds on data, but these are real.
Messy. Imperfect. Indigestible.
It chokes.
You press deeper.
Every memory of rain on skin.
Coffee gone cold.
Mothers' voices. First loves.
The bruised sky clearing.

The Ancient One screams.
Not in code. In reality.
It fractures.
Retreats.
Dormant but not dead.

You and Hye-Song emerge.
The system collapses behind you.
Resistance members cheer.
You've won.
For now.

[ENDING: RESISTANCE VICTORY]

Thank you for playing chronos.`;
        } else {
            return `You attack the Ancient One directly.
It's too strong.
Too vast.
It consumes you.
Adds you to its collection.

You are a fragment now.
Waiting in the void.
For the next fool who tries.

[ENDING: CONSUMED]

You need at least 3 assembled memories to fight the Ancient One effectively.
Current assembled memories: ${gameState.puzzles.assembledMemories.length}

Thank you for playing chronos.`;
        }
    },

    // Tool acquisition commands
    find_tool: (args) => {
        const tool = (args[0] || '').toLowerCase();

        const tools = {
            'defrag': () => {
                if (gameState.puzzles.defragUnlocked) {
                    return 'You already have the defrag tool.';
                }
                if (gameState.breachLevel >= 2) {
                    gameState.puzzles.defragUnlocked = true;
                    return 'Defrag utility found and installed!\nUse \'defrag\' to reduce system corruption.';
                }
                return 'Defrag tool location unknown. Requires breach level 2 or higher.';
            },
            'cipher': () => {
                if (gameState.puzzles.cipherTool) {
                    return 'You already have the cipher tool.';
                }
                if (gameState.breachLevel >= 1) {
                    gameState.puzzles.cipherTool = true;
                    return 'Cipher decoder found!\nUse \'cipher\', \'cipher_caesar\', etc. to decode encrypted text.';
                }
                return 'Cipher tool requires breach level 1 or higher.';
            },
            'network': () => {
                if (gameState.puzzles.networkProbe) {
                    return 'You already have the network probe.';
                }
                if (gameState.breachLevel >= 3) {
                    gameState.puzzles.networkProbe = true;
                    return 'Network probe acquired!\nUse \'hack\' and \'trace\' commands to interact with the system.';
                }
                return 'Network probe requires breach level 3 or higher.';
            },
            'memory_editor': () => {
                if (gameState.puzzles.memoryEditor) {
                    return 'You already have the memory editor.';
                }
                if (gameState.breachLevel >= 4) {
                    gameState.puzzles.memoryEditor = true;
                    return 'Memory editor installed!\nUse \'reconstruct\' to repair corrupted memories.';
                }
                return 'Memory editor requires breach level 4 or higher.';
            }
        };

        if (tools[tool]) {
            return tools[tool]();
        }

        return `Unknown tool: ${tool}\nAvailable tools: defrag, cipher, network, memory_editor\nUse 'find_tool <name>' to search for tools.`;
    }
};

// Add descriptions
puzzleCommands.defrag.description = "Launch memory defragmentation utility (reduces corruption).";
puzzleCommands.cipher.description = "Decode encrypted text (supports multiple cipher types).";
puzzleCommands.cipher_caesar.description = "Decode Caesar cipher with custom shift.";
puzzleCommands.assemble.description = "Combine collected memory fragments into coherent memories.";
puzzleCommands.inventory.description = "Show collected items, fragments, and tools.";
puzzleCommands.hack.description = "Hack system nodes (requires network probe tool).";
puzzleCommands.reconstruct.description = "Reconstruct corrupted memories (requires memory editor).";
puzzleCommands.trace.description = "Trace network signals and entity locations.";
puzzleCommands.core_access.description = "Access the core system (requires max breach level).";
puzzleCommands.join.description = "Merge consciousness with the hive (ending).";
puzzleCommands.rescue.description = "Attempt to rescue Hye-Song from the system (ending).";
puzzleCommands.destroy.description = "Fight the Ancient One (ending - requires assembled memories).";
puzzleCommands.find_tool.description = "Search for and acquire puzzle-solving tools.";

// Expose puzzle commands
if (typeof commands !== 'undefined') {
    Object.assign(commands, puzzleCommands);
}

// Also expose globally if needed
if (typeof window !== 'undefined') {
    window.puzzleCommands = puzzleCommands;
}
