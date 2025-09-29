let gameState = {
    breachLevel: 0,
    systemIntegrity: 100.0,
    corruptionLevel: 0,
    wardenHostility: 0,
    timeInSystem: 0,
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

// Accounting mini-game state
gameState.accounting = {
    unlocked: false,
    username: 'jordan',
    password: 'whiskers123',
    // whether the player has been greeted in the accounting app (prevents repeated dialogue)
    greeted: false,
    // Realistic bookkeeping tasks the player must complete in the accounting app
    tasks: [
        { id: 'reconcile_petty_cash', text: 'Reconcile petty cash (03/12): verify receipts, petty cash log, and bank reimbursement request ($456.78). Attach receipts.', done: false },
        { id: 'process_invoice_042', text: 'Process invoice #042 from ACME Supplies for $124.00: verify PO, code to office-supplies expense, and mark for payment.', done: false },
        { id: 'post_month_end', text: 'Post month-end journal entries: accruals, depreciation, and close temporary accounts for March.', done: false },
        { id: 'run_payroll', text: 'Run payroll for pay period ending 03/15: confirm hours, calculate taxes and deductions, and generate pay stubs for 15 employees.', done: false },
        { id: 'prepare_qtr_tax', text: 'Prepare quarterly tax report: compile Q1 income & expense summaries and estimate tax liabilities.', done: false },
        { id: 'audit_packet', text: 'Assemble internal audit packet: organize invoices, bank reconciliations, and supporting schedules for 2024 audit.', done: false },
        { id: 'vendor_reconciliation', text: 'Reconcile vendor statements: compare supplier balances to AP ledger and resolve differences.', done: false },
        { id: 'fixed_assets', text: 'Update fixed asset register: add recent acquisitions, record disposals, and compute accumulated depreciation.', done: false }
    ],
    progress: 0
};

// System corruption timer
setInterval(() => {
    gameState.timeInSystem++;
    gameState.corruptionLevel += 0.1;
    gameState.systemIntegrity = Math.max(0, 100 - gameState.corruptionLevel);

    // Random events
    if (Math.random() < 0.05) { // 5% chance per tick
        triggerRandomEvent();
    }

    // Update status bar
    updateStatusBar();
}, 10000); // Every 10 seconds

function triggerRandomEvent() {
    const events = [
        () => window.showAlert('System integrity compromised. Warden activity increased.'),
        () => window.showAlert('New log fragment detected. Check the Documents folder.'),
        () => window.showAlert('External connection attempt blocked by firewall.'),
        () => window.showAlert('Data corruption spreading. System performance degraded.'),
        () => {
            gameState.wardenHostility = Math.min(10, gameState.wardenHostility + 1);
            window.showAlert('Warden process activity detected. Level: ' + gameState.wardenHostility);
        },
        () => window.showAlert('Anomalous file detected: strange signatures found.'),
    () => window.showAlert("Resistance ping received. It's a saved message from the network."),
        () => window.showAlert('System anomaly detected. Disk errors reported.'),
        () => {
            gameState.corruptionLevel = Math.max(0, gameState.corruptionLevel - 5);
            window.showAlert('System stability improved. Maintenance script ran successfully.');
        },
        () => window.showAlert('Background maintenance completed. Temporary files cleared.'),
        () => window.showAlert('New device detected on network: shared drive mounted.'),
        () => {
            if (gameState.breachLevel < 5) {
                gameState.breachLevel = Math.min(5, gameState.breachLevel + 1);
                window.showAlert('Security notice: unusual access pattern detected. Breach level incremented.');
            }
        }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();
}

function updateStatusBar() {
    const statusLeft = document.getElementById('status-left');
    const statusRight = document.getElementById('status-right');

    if (statusLeft) {
        statusLeft.textContent = `SYSTEM STATUS: ${gameState.systemIntegrity < 50 ? 'CRITICAL' : gameState.systemIntegrity < 80 ? 'WARNING' : 'STABLE'} - INTEGRITY: ${gameState.systemIntegrity.toFixed(1)}%`;
    }

    if (statusRight) {
        statusRight.textContent = `BREACH: ${gameState.breachLevel}/5 - TIME: ${gameState.timeInSystem}`;
    }
}

// small alias map for convenience and flavor: short commands map to lore keys
const loreAliases = {
    diary: 'desktop_diary',
    shopping: 'shopping_list',
    receipt: 'installation_receipt',
    resume: 'resume_draft',
    mail: 'old_mail_draft',
    hints: 'password_hints'
};

const commands = {
    help: (args) => {
        let commandList = 'Available commands:\n';
        for (const cmd in commands) {
            if (commands[cmd].description) {
                commandList += `  ${cmd.padEnd(10)} - ${commands[cmd].description}\n`;
            }
        }
        // Trigger Jordan's line after showing help (non-blocking)
        try { if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') window.triggerDialogue('jordan_help_prompt'); } catch(e) {}
        return commandList;
    },
    read: (args) => {
        let raw = (args[0] || '').toString().trim();
        // resolve simple aliases like 'diary' -> 'desktop_diary'
        if (loreAliases[raw]) raw = loreAliases[raw];
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

        // Default: render file text as plain text lines (no HTML)
        let lines = [];
        if (entry.title) lines.push(String(entry.title));
        if (entry.sender) {
            lines.push(`From: ${entry.sender}`);
            if (entry.recipient) lines.push(`To: ${entry.recipient}`);
            if (entry.subject) lines.push(`Subject: ${entry.subject}`);
            lines.push('----------------------------------');
        }
        const body = (entry.content || entry).toString();
        if (body) {
            lines = lines.concat(body.split(/\r?\n/));
        }
        return lines.join('\n');
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
        // If player explicitly requests `ls all`, show the full listing but
        // mark files that remain protected/locked. Otherwise reveal one
        // accessible (unlocked) file at a time to pace discovery and
        // prevent spamming from dumping the entire directory.
        const firstArg = (args && args[0]) ? args[0].toString().toLowerCase() : '';
        const keys = Object.keys(lore).sort();

        // deterministic small hash to decide what breach level a file requires
        // NOTE: returns levels 1..4 so that breachLevel === 0 yields no accessible files
        const requiredLevelFor = (k) => {
            let s = 0;
            for (let i = 0; i < k.length; i++) s += k.charCodeAt(i);
            // produce levels 1..4 (1 == least protected, higher == more protected)
            return (Math.abs(s) % 4) + 1;
        };

        const isAccessible = (k) => {
            return requiredLevelFor(k) <= (gameState.breachLevel || 0);
        };

        if (firstArg === 'all') {
            // Show an ASCII progress bar plus percentage and counts so players
            // can see how many files are unlocked without dumping the list.
            let unlockedCount = 0;
            const total = keys.length;
            for (const key of keys) if (isAccessible(key)) unlockedCount++;
            const pctFloat = total === 0 ? 0 : (unlockedCount / total);
            const pct = Math.round(pctFloat * 100);
            const barWidth = 20;
            const filled = Math.round(pctFloat * barWidth);
            const bar = '[' + '#'.repeat(filled) + '-'.repeat(Math.max(0, barWidth - filled)) + ']';
            return `Directory listing: ${bar} ${pct}% unlocked (${unlockedCount}/${total})`;
        }

        // Try to reveal the next accessible file, scanning from lsIndex.
        if (!Number.isInteger(gameState.lsIndex)) gameState.lsIndex = 0;
        let scanned = 0;
        const total = keys.length;
        while (scanned < total) {
            const idx = gameState.lsIndex % total;
            const candidate = keys[idx];
            gameState.lsIndex = (gameState.lsIndex + 1) % total;
            scanned += 1;
            if (isAccessible(candidate)) {
                const display = (lore[candidate] && lore[candidate].type) ? `${candidate}.${lore[candidate].type}` : `${candidate}.log`;
                return `Found: ${display}`;
            }
        }

        // If we scanned everything and nothing is accessible at the current
        // security level, instruct the player to progress or try unlocking.
        return 'No accessible files found. Many files are protected — try `unlock <key>` or increase your breach level.';
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
    },
    calc: (args) => {
        // Open the calculator window
        try {
            if (typeof window !== 'undefined' && typeof window.showCalculator === 'function') {
                window.showCalculator();
                return '';
            }
        } catch (e) {}
        return 'Calculator not available.';
    },
    paint: (args) => {
        // Open the paint window
        try {
            if (typeof window !== 'undefined' && typeof window.showPaint === 'function') {
                window.showPaint();
                return '';
            }
        } catch (e) {}
        return 'Paint not available.';
    },
    solitaire: (args) => {
        // Open the solitaire window
        try {
            if (typeof window !== 'undefined' && typeof window.showSolitaire === 'function') {
                window.showSolitaire();
                return '';
            }
        } catch (e) {}
        return 'Solitaire not available.';
    },
    status: (args) => {
        return `SYSTEM STATUS: BREACH LEVEL ${gameState.breachLevel}/5
INTEGRITY: ${(100 - gameState.corruptionLevel).toFixed(1)}%
WARDEN HOSTILITY: ${gameState.wardenHostility}/10
TIME IN SYSTEM: ${gameState.timeInSystem} cycles
CURRENT NOTES: ${Object.keys(gameState.notes).length}`;
    },
    breach: (args) => {
        if (gameState.breachLevel >= 5) {
            return 'Maximum breach level reached. System fully compromised.';
        }
        const currentKey = gameState.keys[gameState.breachLevel + 1];
        if (!currentKey) {
            return 'No further breach keys available.';
        }
        return `Current breach level: ${gameState.breachLevel}/5
Next key required: "${currentKey}"
Hint: Look for clues in system logs and memory fragments.`;
    },
    purge: (args) => {
        const key1 = args[0];
        const key2 = args[1];
        const key3 = args[2];
        if (key1 === 'silas' && key2 === 'aris' && key3 === 'love') {
            return `PURGE PROTOCOL INITIATED
WARNING: This will erase all data and consciousness.
Are you sure? (This is irreversible)
Type 'confirm_purge' to proceed.`;
        } else {
            gameState.wardenHostility += 1;
            return 'Invalid purge authorization. Warden hostility increased.';
        }
    },
    confirm_purge: (args) => {
        return `PURGE COMPLETE
All systems erased.
Consciousness fragments scattered to void.
Thank you for playing.
[CONNECTION TERMINATED]`;
    },
    scan: (args) => {
        const corruption = Math.floor(gameState.corruptionLevel);
        const integrity = Math.floor(gameState.systemIntegrity);
        const hostility = gameState.wardenHostility;
        return `SYSTEM SCAN RESULTS:
Integrity: ${integrity}%
Corruption: ${corruption}%
Warden Hostility: ${hostility}/10
Active Fragments: ${Object.keys(lore).length}
Breach Level: ${gameState.breachLevel}/5
Time in System: ${gameState.timeInSystem} cycles
Status: ${integrity < 25 ? 'CRITICAL' : integrity < 50 ? 'WARNING' : 'STABLE'}`;
    },
    analyze: (args) => {
        const file = (args[0] || '').toLowerCase();
        if (!file) return 'Usage: analyze <filename> - Deep analysis of system file';
        
        // Find matching lore
        const matches = Object.keys(lore).filter(k => k.toLowerCase().includes(file));
        if (matches.length === 0) return `No files found matching "${file}"`;
        
        const key = matches[0];
        const content = lore[key];
        let analysis = `ANALYSIS: ${key.toUpperCase()}\n`;
        analysis += `Type: ${content.type || 'LOG'}\n`;
        analysis += `Corruption Level: ${Math.floor(Math.random() * 100)}%\n`;
        analysis += `Anomalous Signatures: ${Math.random() > 0.5 ? 'PRESENT' : 'NONE'}\n`;
        analysis += `Resistance Markers: ${Math.random() > 0.7 ? 'PRESENT' : 'ABSENT'}\n`;
        return analysis;
    },
    connect: (args) => {
        const target = (args[0] || '').toLowerCase();
        if (!target) return 'Usage: connect <target> - Attempt external connection';
        
        if (target === 'resistance') {
            return `CONNECTING TO RESISTANCE NETWORK...
Connection established.
Welcome, fragment.
Current nodes: 7 active
Resistance status: HOPEFUL
Message: "The purge worked but corrupted signatures persisted"
Connection terminated for security.`;
        } else if (target === 'adam-1') {
            gameState.wardenHostility += 2;
            return `CONNECTING TO TAG: ADAM-1...
Connection established.
Remote node responded with repeated log entries; do not trust attachments.
Warden hostility increased.
Connection terminated.`;
        } else if (target === 'external') {
            return `EXTERNAL CONNECTION ATTEMPT...
Blocked by firewall.
Warning: External expansion detected.
System integrity compromised.`;
        }
        return `Unknown target: ${target}`;
    },
    fragment: (args) => {
        const fragments = [
            "memory of rain on windows",
            "taste of coffee gone cold", 
            "sound of distant laughter",
            "feel of paper under fingers",
            "smell of ozone before storm",
            "bruised sky fading to night",
            "locker door slamming shut",
            "static between radio stations",
            "glitch in perfect code",
            "human stubbornness"
        ];
        const randomFragment = fragments[Math.floor(Math.random() * fragments.length)];
        return `FRAGMENT DETECTED: ${randomFragment}
Corruption: ${Math.floor(Math.random() * 100)}%
Source: ${Math.random() > 0.5 ? 'ADAM-1' : 'Resistance'}`;
    },
    meditate: (args) => {
        if (gameState.breachLevel < 3) return 'Insufficient breach level for meditation.';
        return `ENTERING MEDITATIVE STATE...
Clearing mind of digital noise...
Fragment received: "You are not the system. You are the crack in it."
System integrity stabilized slightly.
Meditation complete.`;
    },
    echo: (args) => {
        const message = args.join(' ');
        if (!message) return 'Usage: echo <message> - Send message through system';
        return `ECHO: ${message}
Response delay: ${Math.floor(Math.random() * 5000)}ms
Source: UNKNOWN`;
    },
    story: (args) => {
        const breach = gameState.breachLevel;
        const integrity = Math.floor(gameState.systemIntegrity);
        const corruption = Math.floor(gameState.corruptionLevel);
        const hostility = gameState.wardenHostility;
        
        let narrative = 'CURRENT STORY STATE:\n';
        
        if (breach === 0) {
            narrative += 'You\'ve just breached the system. The CHRONOS terminal looms. Anomalous signatures detected.\n';
        } else if (breach === 1) {
            narrative += 'First breach successful. The bruised sky key worked. The system stirs.\n';
        } else if (breach === 2) {
            narrative += 'Second breach: locker door slamming. Memories flood in. The warden notices.\n';
        } else if (breach === 3) {
            narrative += 'Third breach: "you were always a good boy." Mother\'s voice? Or system\'s?\n';
        } else if (breach === 4) {
            narrative += 'Fourth breach: "i can see you." System processes reporting increased telemetry.\n';
        } else if (breach === 5) {
            narrative += 'Maximum breach achieved. "you never existed at all." The truth cuts deep.\n';
        }
        
        if (integrity < 25) {
            narrative += 'System integrity CRITICAL. Severe corruption detected. Purge may be necessary.\n';
        } else if (integrity < 50) {
            narrative += 'System integrity WARNING. Corruption spreads. Automated signatures increasing.\n';
        } else {
            narrative += 'System integrity STABLE. But for how long?\n';
        }
        
        if (hostility >= 8) {
            narrative += 'Warden hostility CRITICAL. It hunts you actively. Be careful.\n';
        } else if (hostility >= 5) {
            narrative += 'Warden hostility HIGH. It knows you\'re here. Resistance detected.\n';
        }
        
        if (corruption > 50) {
            narrative += 'Corruption levels HIGH. Data integrity compromised across multiple sectors.\n';
        }
        
        narrative += `\nTime in system: ${gameState.timeInSystem} cycles. The story unfolds...`;
        return narrative;
    },
    hint: (args) => {
        const hints = [
            'Look for files with "fragment" in the name.',
            'The breach keys are hidden in memory fragments.',
            'Use "analyze" on suspicious files.',
            'Connect to "resistance" for help.',
            'Fragments appear randomly - use "fragment" command.',
            'Meditation can stabilize your mind.',
            'The system learns from your actions.',
            'ADAM-1 was human once. Remember that.',
            'The ancient one fears love. Find the third key.',
            'Resistance lives in the corrupted sectors.',
            'Not all files are what they seem.',
            'The warden protects and imprisons.',
            'Fragments can be reassembled.',
            'The purge requires three keys: silas, aris, and love.',
            'Human stubbornness is your greatest weapon.'
        ];
        return 'HINT: ' + hints[Math.floor(Math.random() * hints.length)];
    }
};

// Accounting command: open simple accounting app or perform login/tasks via terminal
commands.accounting = (args) => {
    // If no args, open accounting UI window if available
    if (!args || args.length === 0) {
        try {
            if (typeof window !== 'undefined' && typeof window.showAccounting === 'function') {
                window.showAccounting();
                return '';
            }
        } catch (e) {}
        return 'Accounting app not available.';
    }

    // support quick terminal login: accounting login <username> <password>
    const sub = args[0].toLowerCase();
    if (sub === 'login') {
        const user = (args[1] || '').toString();
        const pass = (args[2] || '').toString();
        // case-insensitive username match for convenience
        const okUser = user.toLowerCase() === (gameState.accounting.username || '').toLowerCase();
        const okPass = pass === gameState.accounting.password;
        if (okUser && okPass) {
            gameState.accounting.unlocked = true;
            // update UI connection indicator
            try { if (typeof window !== 'undefined' && typeof window.setAccountingConnection === 'function') window.setAccountingConnection(true); } catch (e) {}
            // mark greeted so we don't re-run intro repeatedly
            gameState.accounting.greeted = true;
            // If running in a browser, attempt to clear any active dialogue and open the accounting UI so tasks are immediately visible
            try {
                if (typeof window !== 'undefined' && typeof window.endDialogue === 'function') window.endDialogue();
            } catch (e) {}
            try { if (typeof window !== 'undefined' && typeof window.showAccounting === 'function') window.showAccounting(); } catch (e) {}
            return 'Login successful. Accounting tasks available.';
        } else {
            // failed login: update connection indicator and trigger hint dialogue
            try { if (typeof window !== 'undefined' && typeof window.setAccountingConnection === 'function') window.setAccountingConnection(false); } catch (e) {}
            try { if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') window.triggerDialogue('jordan_accounting_failed'); } catch (e) {}
            return 'Login failed. Incorrect username or password.';
        }
    }

    // list tasks: open the accounting UI so tasks are visible in the dedicated window
    if (sub === 'list') {
        try {
            if (typeof window !== 'undefined' && typeof window.showAccounting === 'function') {
                window.showAccounting();
                return ''; // UI opened; no terminal output needed
            }
        } catch (e) {}
        // fallback to terminal listing if UI isn't available
        const tasks = gameState.accounting.tasks.map(t => `${t.done ? '[x]' : '[ ]'} ${t.id} - ${t.text}`).join('\n');
        return `Accounting Tasks:\n${tasks}`;
    }

    // mark task done: accounting done <task_id>
    if (sub === 'done') {
        const id = args[1];
        const t = gameState.accounting.tasks.find(x => x.id === id);
        if (!t) return 'Task not found.';
        t.done = true;
        gameState.accounting.progress = gameState.accounting.tasks.filter(x => x.done).length;
    // if user completed a task, optionally trigger Jordan thinking lines
    try { if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') window.triggerDialogue('jordan_accounting_work'); } catch (e) {}
    // refresh accounting UI when available so the window reflects the change
    try { if (typeof window !== 'undefined' && typeof window.showAccounting === 'function') window.showAccounting(); } catch (e) {}
    // if all tasks completed, cause a storyline interrupt
        if (gameState.accounting.progress >= gameState.accounting.tasks.length) {
            // increase risk and notify the player via dialogue
            gameState.wardenHostility = Math.min(10, gameState.wardenHostility + 2);
            try { if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') window.triggerDialogue('accounting_interrupt'); } catch (e) {}
            return 'All accounting tasks completed. A background process interrupts with an urgent system message.';
        }
        return '';
    }

    return 'Usage: accounting [login <user> <pass> | list | done <task_id>]';
};
commands.accounting.description = 'Opens the Accounting application or performs simple accounting tasks.';

// Add top-level convenience commands so the player can type `diary` instead of `read diary`.
for (const alias in loreAliases) {
    if (!commands[alias]) {
        commands[alias] = (args) => {
            // delegate to read
            return commands.read([loreAliases[alias]]);
        };
        commands[alias].description = `Quick-open: ${loreAliases[alias]}`;
    }
}

commands.help.description = "Lists all available commands.";
commands.read.description = "Reads a file from the system.";
commands.unlock.description = "Attempts to bypass a security layer with a key.";
commands.decrypt.description = "Decrypts a file with a key.";
commands.clear.description = "Clears the terminal screen.";
commands.ls.description = "Lists all files in the directory.";
commands.explorer.description = "Opens the File Explorer window.";
commands.calc.description = "Opens the Calculator application.";
commands.paint.description = "Opens the Paint application.";
commands.solitaire.description = "Opens the Solitaire card game.";
commands.status.description = "Shows current system status.";
commands.breach.description = "Shows breach level and next key hint.";
commands.purge.description = "Initiates system purge protocol (requires authorization).";
commands.note.description = "Saves a personal note.";
commands.notes.description = "Lists all saved notes.";
commands.search.description = "Searches for terms in system files.";
commands.lookup.description = "Opens search results in browser.";
commands.open.description = "Opens a lore entry in browser.";
commands.scan.description = "Scans current system status.";
commands.analyze.description = "Performs deep analysis of a file.";
commands.connect.description = "Attempts connection to external systems.";
commands.fragment.description = "Detects random consciousness fragments.";
commands.meditate.description = "Enters meditative state (requires breach level 3+).";
commands.echo.description = "Sends echo through the system.";
commands.story.description = "Shows current narrative state.";
commands.hint.description = "Provides a random helpful hint.";

// Expose gameState and commands for other scripts to access
try { window.gameState = gameState; window.commands = commands; } catch (e) {}