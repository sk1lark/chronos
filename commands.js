let gameState = {
    breachLevel: 0,
    systemIntegrity: 100.0,
    corruptionLevel: 0,
    wardenHostility: 0,
    timeInSystem: 0,
    // pointer used by `ls` to leak files one-by-one for narrative pacing
    lsIndex: 0,
    notes: {},
    keys: {
        1: "a bruised sky",
        2: "a locker door slamming shut",
        3: "you were always a good boy",
        4: "i can see you",
        5: "you never existed at all"
    },
    decryptionKeys: {
        "file_c_enc.log": "janus"
    }
};

const commands = {
    help: (args) => {
        let commandList = 'Available commands:\n';
        for (const cmd in commands) {
            if (commands[cmd].description) {
                commandList += `  ${cmd.padEnd(10)} - ${commands[cmd].description}\n`;
            }
        }
        return commandList;
    },
    read: (args) => {
        let raw = (args[0] || '').toString().trim();
        if (!raw) return 'Error: No file specified. Usage: read <filename>';

        // Prepare candidates and do case-insensitive matching against lore keys
        const extless = raw.replace(/\.(log|txt|enc|web|html|json|mp3|wav|png|jpg)$/i, '');
        const candidates = new Set([
            raw,
            extless,
            raw.toLowerCase(),
            extless.toLowerCase()
        ]);

        // Also include adding/removing a single .log in case ls printed .log for keys that already contain it
        if (!/\.log$/i.test(raw)) candidates.add(`${raw}.log`);
        if (!/\.log$/i.test(extless)) candidates.add(`${extless}.log`);

        // Search for best match (prefer exact key, then case-insensitive)
        let entry = null;
        let matchedKey = null;
        const keys = Object.keys(lore);

        // Exact match first
        for (const k of keys) {
            if (k === raw || k === extless) {
                entry = lore[k]; matchedKey = k; break;
            }
        }
        // Case-insensitive match next
        if (!entry) {
            const low = raw.toLowerCase();
            const lowExt = extless.toLowerCase();
            for (const k of keys) {
                if (k.toLowerCase() === low || k.toLowerCase() === lowExt) {
                    entry = lore[k]; matchedKey = k; break;
                }
            }
        }
        // Fuzzy: startsWith or contains
        if (!entry) {
            for (const k of keys) {
                if (k.toLowerCase().includes(extless.toLowerCase())) {
                    entry = lore[k]; matchedKey = k; break;
                }
            }
        }

        if (!entry) return `File not found: ${raw}`;

        // Trigger any dialogue associated with this file (if the terminal has that handler)
        try {
            if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') {
                window.triggerDialogue(matchedKey || raw);
            } else if (typeof triggerDialogue === 'function') {
                triggerDialogue(matchedKey || raw);
            }
        } catch (e) {
            // non-fatal if dialogue trigger isn't present yet
            console.warn('triggerDialogue not available yet', e);
        }

        // UI-driven types (these show windows instead of printing text)
        if (entry.type === 'aim') {
            if (typeof window !== 'undefined' && typeof window.showAimMessage === 'function') {
                window.showAimMessage(entry.sender, entry.message);
            }
            return '';
        }
        if (entry.type === 'web') {
            if (typeof window !== 'undefined' && typeof window.showBrowser === 'function') {
                window.showBrowser(entry.url, entry.content);
            }
            return '';
        }
        if (entry.type === 'audio') {
            if (typeof window !== 'undefined' && typeof window.showMediaPlayer === 'function') {
                window.showMediaPlayer(entry.title, entry.src);
            }
            return '';
        }
        if (entry.type === 'image') {
            if (typeof window !== 'undefined' && typeof window.showImageViewer === 'function') {
                window.showImageViewer(entry.title, entry.src);
            }
            return '';
        }
        if (entry.type === 'alert') {
            if (typeof window !== 'undefined' && typeof window.showAlert === 'function') {
                window.showAlert(entry.message);
            }
            return '';
        }

        // Default: render file text
        let content = '';
        if (entry.title) content += `<strong>${entry.title}</strong><br>`;
        if (entry.sender) {
            content += `From: ${entry.sender}<br>`;
            if (entry.recipient) content += `To: ${entry.recipient}<br>`;
            if (entry.subject) content += `Subject: ${entry.subject}<br>`;
            content += `----------------------------------<br>`;
        }
        const body = (entry.content || entry).toString();
        content += body.replace(/\n/g, '<br>');
        return content;
    },
    unlock: (args) => {
        const key = args.join(' ');
        if (gameState.keys[gameState.breachLevel + 1] === key) {
            gameState.breachLevel++;
            return `Breach successful. Security layer ${gameState.breachLevel} bypassed.`;
        } else {
            return 'Incorrect key. Access denied.';
        }
    },
    decrypt: (args) => {
        const file = args[0];
        const key = args[1];
        if (gameState.decryptionKeys[file] === key) {
            return `File ${file} decrypted. You can now read its contents.`;
        } else {
            return 'Decryption failed. Invalid key.';
        }
    },
    clear: () => {
        document.getElementById('output').innerHTML = '';
        return '';
    },
    ls: (args) => {
        // If player explicitly requests `ls all`, show the full listing
        // otherwise reveal a single file each time `ls` is called to pace discovery.
        const firstArg = (args && args[0]) ? args[0].toString().toLowerCase() : '';
        const keys = Object.keys(lore).sort();

        if (firstArg === 'all') {
            const fileList = keys.map(key => {
                if (lore[key] && lore[key].type) return `${key}.${lore[key].type}`;
                return `${key}.log`;
            }).join('\n');
            return `Directory listing:\n${fileList}`;
        }

        // Reveal the next file in sequence
        if (gameState.lsIndex >= keys.length) {
            // once exhausted, reset pointer and inform player
            gameState.lsIndex = 0;
            return 'No more files to reveal.';
        }

        const nextKey = keys[gameState.lsIndex++];
        const display = (lore[nextKey] && lore[nextKey].type) ? `${nextKey}.${lore[nextKey].type}` : `${nextKey}.log`;
        return `Found: ${display}`;
    }
    ,
    note: (args) => {
        const key = args[0];
        const text = args.slice(1).join(' ');
        if (!key || !text) return 'Usage: note <key> <text>'; 
        gameState.notes[key] = text;
        return `Note saved: ${key}`;
    },
    notes: () => {
        const entries = Object.keys(gameState.notes);
        if (entries.length === 0) return 'No notes saved.';
        return entries.map(k => `${k}: ${gameState.notes[k]}`).join('\n');
    },
    search: (args) => {
        const term = (args.join(' ') || '').toLowerCase();
        if (!term) return 'Usage: search <term>'; 
        const keys = Object.keys(lore);
        const matches = [];
        for (const k of keys) {
            const v = lore[k];
            const text = (typeof v === 'string') ? v : JSON.stringify(v);
            if (k.toLowerCase().includes(term) || text.toLowerCase().includes(term)) {
                matches.push(k);
            }
            if (matches.length >= 12) break; // limit results
        }
        if (matches.length === 0) return 'No matches.';
        return `Matches:\n${matches.join('\n')}`;
    }
    ,
    lookup: (args) => {
        const term = (args.join(' ') || '').trim();
        if (!term) return 'Usage: lookup <term>  (opens results in browser)';
        const keys = Object.keys(lore);
        const matches = [];
        for (const k of keys) {
            const v = lore[k];
            const text = (typeof v === 'string') ? v : JSON.stringify(v);
            if (k.toLowerCase().includes(term.toLowerCase()) || text.toLowerCase().includes(term.toLowerCase())) {
                matches.push(k);
            }
            if (matches.length >= 40) break; // safety cap
        }
        if (matches.length === 0) return 'No results found.';

        // Build a simple Win95-style results page
        const list = matches.map(k => `<li><a href="#" class="lore-link" data-key="${k}">${k}</a></li>`).join('');
        const html = `<div class="lookup-results"><h3>Search results for "${escapeHtml(term)}"</h3><ul>${list}</ul></div>`;
        if (typeof window !== 'undefined' && typeof window.showBrowser === 'function') {
            window.showBrowser(`search:${term}`, html);
            return '';
        }
        return `Matches:\n${matches.join('\n')}`;
    },
    open: (args) => {
        const key = (args[0] || '').trim();
        if (!key) return 'Usage: open <lore_key>  (opens lore entry in the browser)';
        if (typeof window !== 'undefined' && typeof window.showLore === 'function') {
            window.showLore(key);
            return '';
        }
        return `Cannot open ${key}`;
    }
    ,
    explorer: (args) => {
        // Open the file explorer window
        try {
            if (typeof window !== 'undefined' && typeof window.openExplorer === 'function') {
                window.openExplorer();
                return '';
            }
        } catch (e) {}
        return 'File explorer not available.';
    }
};

commands.help.description = "Lists all available commands.";
commands.read.description = "Reads a file from the system.";
commands.unlock.description = "Attempts to bypass a security layer with a key.";
commands.decrypt.description = "Decrypts a file with a key.";
commands.clear.description = "Clears the terminal screen.";
commands.ls.description = "Lists all files in the directory.";
commands.explorer.description = "Opens the File Explorer window.";