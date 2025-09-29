document.addEventListener('DOMContentLoaded', () => {
    const terminalEl = document.getElementById('terminal');
    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('input');
    // We'll hide the native input and capture keystrokes globally so the user
    // can type directly into the terminal area, as if it's a real console.

    let dialogueQueue = [];
    let isDialogueActive = false;
    let currentDialogueTimeout;
    let currentDialogueText = '';
    let currentDialogueIndex = 0;
    let currentTypingTimer = null;
    let continueBlinkTimer = null;
    // audio pool for per-character typewriter sound (omori.ogg must exist in project root)
    const _typeSoundPool = [];
    let _typeSoundIndex = 0;
    const _TYPE_SOUND_POOL_SIZE = 6;
    try {
        for (let i = 0; i < _TYPE_SOUND_POOL_SIZE; i++) {
            const a = new Audio('omori.ogg');
            a.volume = 0.09; // subtle
            _typeSoundPool.push(a);
        }
    } catch (e) { console.warn('type sound pool failed to initialize', e); }
    // global stacking context counter to bring windows to front
    let _topZ = 1000;

    // --- Dialogue System ---
    window.triggerDialogue = function(fileKey) {
        if (dialogue[fileKey]) {
            dialogueQueue.push(...dialogue[fileKey]);
            if (!isDialogueActive) {
                showNextDialogue();
            }
        }
    }

    // Allow other modules to forcibly end/clear dialogue (useful when switching UI)
    window.endDialogue = function() {
        try {
            dialogueQueue.length = 0;
            isDialogueActive = false;
            const continuePrompt = document.getElementById('dialogue-continue-prompt');
            if (continuePrompt) continuePrompt.classList.add('hidden');
            const dialogueBox = document.getElementById('dialogue-box');
            if (dialogueBox) dialogueBox.classList.add('hidden');
            // stop any ongoing typing timer
            if (typeof currentTypingTimer !== 'undefined' && currentTypingTimer) {
                clearTimeout(currentTypingTimer);
                currentTypingTimer = null;
            }
        } catch (e) { /* non-fatal */ }
    }

    function showNextDialogue() {
        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueText = document.getElementById('dialogue-text');
        const continuePrompt = document.getElementById('dialogue-continue-prompt');

        if (dialogueQueue.length === 0) {
            isDialogueActive = false;
            continuePrompt.classList.add('hidden');
            return;
        }

        isDialogueActive = true;
        const text = dialogueQueue.shift();

        dialogueBox.classList.remove('hidden');
        dialogueText.innerHTML = '';
        continuePrompt.classList.add('hidden');

        // prepare typing state so Enter can fast-forward
        currentDialogueText = text;
        currentDialogueIndex = 0;
        if (currentTypingTimer) clearTimeout(currentTypingTimer);

        function typeWriterStep() {
            if (currentDialogueIndex < currentDialogueText.length) {
                const ch = currentDialogueText.charAt(currentDialogueIndex);
                dialogueText.innerHTML += ch;
                // play a short sound for every character (pool to allow rapid retrigger)
                try {
                    const pool = _typeSoundPool;
                    if (pool && pool.length > 0) {
                        const a = pool[_typeSoundIndex % pool.length];
                        _typeSoundIndex++;
                        try { a.currentTime = 0; } catch (e) {}
                        a.play().catch(() => {});
                    }
                } catch (e) { /* non-fatal */ }
                currentDialogueIndex++;
                currentTypingTimer = setTimeout(typeWriterStep, 30);
            } else {
                // show continue prompt and start blinking
                continuePrompt.classList.remove('hidden');
                startContinueBlink(continuePrompt);
            }
        }
        clearTimeout(currentTypingTimer);
        typeWriterStep();
    }

    function finishDialogueLine() {
        // Immediately finish typing current dialogue line
        if (!isDialogueActive) return;
        if (currentTypingTimer) clearTimeout(currentTypingTimer);
        const dialogueText = document.getElementById('dialogue-text');
        const continuePrompt = document.getElementById('dialogue-continue-prompt');
        dialogueText.innerHTML = currentDialogueText;
        continuePrompt.classList.remove('hidden');
        startContinueBlink(continuePrompt);
    }

    function startContinueBlink(el) {
        // blink the continue prompt to make it obvious
        if (continueBlinkTimer) clearInterval(continueBlinkTimer);
        el.classList.remove('blink-hidden');
        continueBlinkTimer = setInterval(() => {
            el.classList.toggle('blink-hidden');
        }, 600);
    }

    function stopContinueBlink() {
        if (continueBlinkTimer) {
            clearInterval(continueBlinkTimer);
            continueBlinkTimer = null;
        }
        const continuePrompt = document.getElementById('dialogue-continue-prompt');
        if (continuePrompt) continuePrompt.classList.remove('blink-hidden');
    }

    // --- Command Processing ---
    const processCommand = (cmdLine) => {
        const parts = cmdLine.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (cmd) {
            // Append the entered command as its own line node
            const cmdLineEl = document.createElement('div');
            cmdLineEl.className = 'terminal-line';
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = 'C:\\CHRONOS>\u00A0';
            cmdLineEl.appendChild(promptSpan);
            cmdLineEl.appendChild(document.createTextNode(cmdLine));
            appendOutput(cmdLineEl);
            const commandFunc = commands[cmd];
            if (commandFunc) {
                const result = commandFunc(args);
                if (result) {
                    // If we revealed a single file (narrative ls), animate it and trigger file dialogue
                    if (typeof result === 'string' && result.startsWith('Found: ')) {
                        // When ls reveals a file ("Found: ..."), animate the reveal using
                        // a safe text-only span (so partial HTML tags don't appear). Do NOT
                        // auto-trigger dialogue here — dialogue should only play when the player
                        // explicitly reads/opens the file.
                        animateOutput(result);
                    } else {
                        // If result contains newline characters, split into separate lines
                        const parts = String(result).split(/\r?\n/);
                        parts.forEach((line) => {
                            const lineEl = document.createElement('div');
                            lineEl.className = 'terminal-line';
                            lineEl.textContent = line;
                            appendOutput(lineEl);
                        });
                    }
                    stopContinueBlink();
                }
            } else {
                const errEl = document.createElement('div');
                errEl.className = 'terminal-line';
                errEl.textContent = `Unknown command: ${cmd}`;
                appendOutput(errEl);
            }
        }
        // scroll the actual output area (not the container) so the prompt sits just below output
        if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
        // ensure scroll after DOM updates/animations
        setTimeout(() => { if (outputEl) outputEl.scrollTop = outputEl.scrollHeight; }, 50);
    };

    function animateOutput(text) {
        // typewriter-style output for small lines (used by ls reveals).
        // Create a dedicated div for the animated line and append chars to its textContent.
        const line = document.createElement('div');
    line.className = 'terminal-line';
    appendOutput(line);
        let i = 0;
        function step() {
            if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
                if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
                setTimeout(step, 12);
            } else {
                // a tiny delay to ensure layout finished, then keep scrolled
                setTimeout(() => { if (outputEl) outputEl.scrollTop = outputEl.scrollHeight; }, 20);
            }
        }
        step();
    }

    // --- Event Listeners ---
    // Create a visual prompt container which will live inside the scrollable output area
    const promptContainer = document.createElement('div');
    promptContainer.className = 'live-input-line';
    promptContainer.innerHTML = `<span class="prompt">C:\\CHRONOS>&nbsp;</span><span class="live-input" aria-hidden="true"></span><span class="caret">▌</span>`;
    // Remove the static input-line from index.html (if present) to avoid duplication
    const existingInputLine = terminalEl.querySelector('.input-line');
    if (existingInputLine) existingInputLine.remove();

    // Helper to append output into outputEl just before the prompt so the prompt always appears under latest output
    function appendOutput(node) {
        // ensure the prompt is moved to the end after we add the node
        if (!outputEl) return;
        // append the node and add a temporary highlight class
        outputEl.appendChild(node);
        try {
            node.classList.add('new-output');
            // remove the class after animation completes (slightly longer than CSS duration)
            setTimeout(() => { try { node.classList.remove('new-output'); } catch(e){} }, 900);
        } catch(e) {}
        // if prompt is already inside outputEl, remove and re-append to keep it at the bottom
        if (promptContainer.parentElement === outputEl) {
            outputEl.removeChild(promptContainer);
        }
        outputEl.appendChild(promptContainer);
        // keep scrolled to bottom
        if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
    }

    // Hide the legacy input element but keep it in DOM for accessibility if needed
    if (inputEl) {
        inputEl.style.position = 'absolute';
        inputEl.style.left = '-9999px';
        inputEl.style.top = '-9999px';
        inputEl.setAttribute('aria-hidden', 'true');
    }

    let liveBuffer = '';
    const liveInputSpan = promptContainer.querySelector('.live-input');
    const caretSpan = promptContainer.querySelector('.caret');

    // Blink caret
    let caretVisible = true;
    setInterval(() => {
        caretVisible = !caretVisible;
        caretSpan.style.visibility = caretVisible ? 'visible' : 'hidden';
    }, 600);

    // Focus handling: clicking on terminal focuses text input (for accessibility)
    // but don't steal focus if the click target is itself an interactive control.
    terminalEl.addEventListener('click', (e) => {
        try {
            const target = e.target;
            if (!inputEl) return;
            if (target && target.closest && target.closest('input, textarea, button, select, [contenteditable]')) {
                // let the control receive focus
                return;
            }
            inputEl.focus();
        } catch (err) {}
    });

    // Global key handling: build buffer and send Enter to processCommand
    document.addEventListener('keydown', (e) => {
        // Ignore modifier-only presses
        if (e.ctrlKey || e.metaKey) return;

        // If focus is inside a form control or contenteditable area, let the element handle keystrokes
        try {
            const active = document.activeElement;
            if (active && active !== document.body && active !== inputEl) {
                const tag = (active.tagName || '').toUpperCase();
                if (tag === 'INPUT' || tag === 'TEXTAREA' || active.isContentEditable) {
                    // let native handlers run
                    return;
                }
            }
        } catch (err) {
            // defensive: if anything goes wrong, fall back to original behavior
        }

        // If dialogue is active, Enter advances dialogue as before
        if (e.key === 'Enter') {
            const continuePromptEl = document.getElementById('dialogue-continue-prompt');
            if (isDialogueActive) {
                if (continuePromptEl && continuePromptEl.classList.contains('hidden')) {
                    finishDialogueLine();
                } else {
                    stopContinueBlink();
                    showNextDialogue();
                }
                e.preventDefault();
                return;
            }

            // Send current buffer as a command
            const command = liveBuffer;
            if (command.trim().length > 0) {
                processCommand(command);
            }
            // Echo a newline after command (processCommand already appends to output)
            liveBuffer = '';
            if (liveInputSpan) liveInputSpan.textContent = '';
            e.preventDefault();
            return;
        }

        // Backspace handling
        if (e.key === 'Backspace') {
            liveBuffer = liveBuffer.slice(0, -1);
            if (liveInputSpan) liveInputSpan.textContent = liveBuffer;
            e.preventDefault();
            return;
        }

        // Ignore navigation keys we don't want to capture here
        const ignored = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','Tab','Escape'];
        if (ignored.includes(e.key)) return;

        // Printable characters: append to buffer
        if (e.key.length === 1) {
            liveBuffer += e.key;
            if (liveInputSpan) liveInputSpan.textContent = liveBuffer;
            e.preventDefault();
            return;
        }
    });

    document.getElementById('dialogue-box').addEventListener('click', () => {
        if (isDialogueActive && !document.getElementById('dialogue-continue-prompt').classList.contains('hidden')) {
            showNextDialogue();
        }
    });

    // Focus terminal input only when clicking outside any interactive window or input.
    document.body.addEventListener('click', (e) => {
        const target = e.target;
        try {
            // if the click is inside the terminal's legacy input, do nothing
            if (target === inputEl) return; // clicking the terminal input itself
            // if the click is inside any floating window or the dialogue box, don't steal focus
            if (target.closest && (target.closest('.window') || target.closest('#dialogue-box'))) return;
            // if the click landed on an interactive control, don't steal focus
            if (target.closest && target.closest('input, textarea, button, select, [contenteditable]')) return;
        } catch (err) {}
        // otherwise focus the terminal input
        if (inputEl) inputEl.focus();
    });

    // --- Windowing Functions (made globally accessible) ---
    window.showAimMessage = function(sender, message) {
        document.getElementById('aim-content').innerHTML = `<b>${sender}:</b> ${message}`;
        document.getElementById('aim-window').classList.remove('hidden');
    }
    window.showBrowser = function(url, content) {
        // set toolbar URL and content
        document.getElementById('browser-url').value = url;
        document.getElementById('browser-content').innerHTML = content;
        // push to history stack
        try { pushBrowserHistory(url, content); } catch (e) {}
        // Update the browser window title to reflect the current page
    const titleEl = document.querySelector('#browser-window .title');
    if (titleEl) titleEl.textContent = `Netscape Navigator - ${url}`;
        document.getElementById('browser-window').classList.remove('hidden');
    }

    // Delegate clicks in the browser content to open lore links
    document.getElementById('browser-content').addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('.lore-link');
        if (a) {
            const key = a.getAttribute('data-key');
            if (key) {
                e.preventDefault();
                window.showLore(key);
            }
        }
    });

    // --- Browser history and q00ql3 search mockup ---
    const browserHistory = [];
    let browserHistoryIndex = -1;

    function pushBrowserHistory(url, content) {
        // if we are not at the end of history, truncate forward history
        if (browserHistoryIndex < browserHistory.length - 1) {
            browserHistory.splice(browserHistoryIndex + 1);
        }
        browserHistory.push({ url, content });
        browserHistoryIndex = browserHistory.length - 1;
    }

    function showBrowserFromHistory(idx) {
        const rec = browserHistory[idx];
        if (!rec) return;
        document.getElementById('browser-url').value = rec.url;
        document.getElementById('browser-content').innerHTML = rec.content;
        const titleEl = document.querySelector('#browser-window .title');
        if (titleEl) titleEl.textContent = `Netscape Navigator - ${rec.url}`;
        document.getElementById('browser-window').classList.remove('hidden');
        browserHistoryIndex = idx;
    }

    const backBtn = document.getElementById('browser-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (browserHistoryIndex > 0) {
                showBrowserFromHistory(browserHistoryIndex - 1);
            }
        });
    }
    // Forward button moves forward in history when available
    const forwardBtn = document.getElementById('browser-forward-btn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            if (browserHistoryIndex < browserHistory.length - 1) {
                showBrowserFromHistory(browserHistoryIndex + 1);
            }
        });
    }

    // Stop button: clears browser content (simulates stopping page load)
    const stopBtn = document.getElementById('browser-stop-btn');
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            document.getElementById('browser-content').innerHTML = '<div class="ie-stopped">Page load stopped.</div>';
        });
    }

    // Refresh button: reloads current page from history
    const refreshBtn = document.getElementById('browser-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (browserHistoryIndex >= 0 && browserHistory[browserHistoryIndex]) {
                showBrowserFromHistory(browserHistoryIndex);
            }
        });
    }

    // Home button: goes to homepage
    const homeBtn = document.getElementById('browser-home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            buildHomepage();
        });
    }

    // q00ql3 toolbar handlers (guarded) — the toolbar search input may have been removed
    const q00ql3Btn = document.getElementById('q00ql3-btn');
    if (q00ql3Btn) {
        q00ql3Btn.addEventListener('click', () => {
            const qInputEl = document.getElementById('q00ql3-input');
            const term = (qInputEl && qInputEl.value) ? qInputEl.value.trim() : '';
            if (!term) return;
            try {
                if (typeof commands !== 'undefined' && typeof commands.lookup === 'function') {
                    commands.lookup([term]);
                } else {
                    const keys = Object.keys(lore).filter(k => k.toLowerCase().includes(term.toLowerCase()));
                    const list = keys.map(k => `<li><a href="#" class="lore-link" data-key="${k}">${k}</a></li>`).join('');
                    window.showBrowser(`q00ql3:${term}`, `<h3>q00ql3 results for ${escapeHtml(term)}</h3><ul>${list}</ul>`);
                }
            } catch (e) { console.warn('q00ql3 failed', e); }
        });

        // allow pressing Enter inside the old q00ql3 input to trigger the toolbar search
        const qInput = document.getElementById('q00ql3-input');
        if (qInput) {
            qInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    q00ql3Btn.click();
                }
            });
        }
    }

    // --- Draggable windows ---
    function makeDraggable(winEl) {
        // Try several common title selectors to support different window markup
    // Support dialogue box content as a handle (dialogue has no title bar by default)
    const handle = winEl.querySelector('.title-bar') || winEl.querySelector('.dialogue-title-bar') || winEl.querySelector('.title') || winEl.querySelector('.dialogue-title') || winEl.querySelector('.vn-dialogue-content') || winEl.querySelector('.vn-text-area');
        if (!handle) return;
        handle.style.cursor = 'move';

        // pointer-based dragging so we capture the pointer to this window only
        handle.addEventListener('pointerdown', (e) => {
            // don't start drag when clicking control buttons
            if (e.target.closest && e.target.closest('.control-btn')) return;
            // bring this window to front
            try { winEl.style.zIndex = ++_topZ; } catch (err) {}
            e.preventDefault();
            // compute starting offsets
            const rect = winEl.getBoundingClientRect();
            // If element has computed left/top (from previous positioning), use that to avoid jumps
            const cs = window.getComputedStyle(winEl);
            let startLeft = parseInt(cs.left, 10);
            let startTop = parseInt(cs.top, 10);
            if (isNaN(startLeft) || isNaN(startTop)) {
                startLeft = rect.left;
                startTop = rect.top;
            }
            // clear transform only if it's centered; remove any translate to allow absolute positioning
            if (winEl.style.transform && winEl.style.transform.includes('translate(-50%')) {
                winEl.style.transform = '';
            }
            winEl.style.position = 'absolute';
            // modest zIndex bump so it sits above others but not insanely high
            winEl.style.zIndex = (parseInt(cs.zIndex,10) || 1000) + 10;
            let startX = e.clientX;
            let startY = e.clientY;

            function onPointerMove(ev) {
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;
                winEl.style.left = (startLeft + dx) + 'px';
                winEl.style.top = (startTop + dy) + 'px';
            }

            function onPointerUp() {
                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
                try { winEl.releasePointerCapture(e.pointerId); } catch (err) {}
                // persist position to localStorage
                try {
                    const pos = { left: winEl.style.left || '', top: winEl.style.top || '' };
                    localStorage.setItem('window-pos-' + winEl.id, JSON.stringify(pos));
                } catch (err) {}
            }

            try { winEl.setPointerCapture(e.pointerId); } catch (err) {}
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        });
    }

    // Apply draggable to windows (include the main terminal window so it can be moved)
    ['terminal-window','aim-window','browser-window','mediaplayer-window','imageviewer-window','alert-window','dialogue-box','explorer-window','notepad-window','calculator-window','paint-window','solitaire-window','accounting-window'].forEach(id => {
        const el = document.getElementById(id);
        if (el) makeDraggable(el);
    });

    // Restore saved window positions if available
    function restoreWindowPositions() {
        ['aim-window','browser-window','mediaplayer-window','imageviewer-window','alert-window','dialogue-box','explorer-window','notepad-window','calculator-window','paint-window','solitaire-window'].forEach(id => {
            try {
                const el = document.getElementById(id);
                if (!el) return;
                const raw = localStorage.getItem('window-pos-' + id);
                if (!raw) return;
                const pos = JSON.parse(raw);
                if (pos.left) el.style.left = pos.left;
                if (pos.top) el.style.top = pos.top;
                el.style.position = 'absolute';
            } catch (e) {}
        });
    }
    restoreWindowPositions();

    // Notepad opener
    window.openNotepad = function() {
        const el = document.getElementById('notepad-window');
        if (!el) return;
        el.classList.remove('hidden');
        try { 
            makeDraggable(el);
            // bring to front and ensure absolute positioning so clicks/focus work
            el.style.position = el.style.position || 'absolute';
            el.style.zIndex = ++_topZ;
            // focus the textarea so the user can immediately type
            const ta = document.getElementById('notepad-textarea');
            if (ta) { ta.focus(); }
        } catch(e) {}
    }

    // Unlock modal handling
    let unlockTargetKey = null;
    function openUnlockModal(key) {
        unlockTargetKey = key;
        const modal = document.getElementById('unlock-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        const input = document.getElementById('unlock-input');
        if (input) { input.value = ''; input.focus(); }
    }
    function closeUnlockModal() {
        unlockTargetKey = null;
        const modal = document.getElementById('unlock-modal');
        if (!modal) return;
        modal.classList.add('hidden');
    }
    const unlockClose = document.getElementById('unlock-close');
    if (unlockClose) unlockClose.addEventListener('click', closeUnlockModal);
    const unlockCancel = document.getElementById('unlock-cancel');
    if (unlockCancel) unlockCancel.addEventListener('click', closeUnlockModal);
    const unlockSubmit = document.getElementById('unlock-submit');
    if (unlockSubmit) unlockSubmit.addEventListener('click', () => {
        const passInput = document.getElementById('unlock-input');
        if (!unlockTargetKey || !passInput) { closeUnlockModal(); return; }
        const pass = passInput.value;
        try {
            if (typeof commands !== 'undefined' && typeof commands.decrypt === 'function') {
                const res = commands.decrypt([unlockTargetKey, pass]);
                if (typeof res === 'string' && res.toLowerCase().includes('decrypted')) {
                    // remove from decryptionKeys so explorer will consider unlocked next render
                    if (gameState.decryptionKeys && gameState.decryptionKeys[unlockTargetKey]) delete gameState.decryptionKeys[unlockTargetKey];
                    buildExplorer();
                    closeUnlockModal();
                    window.showAlert('File unlocked. You can now open it.');
                    return;
                }
                window.showAlert(res || 'Unlock failed.');
            }
        } catch (e) { console.warn('unlock failed', e); }
    });
    const unlockInput = document.getElementById('unlock-input');
    if (unlockInput) unlockInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); unlockSubmit && unlockSubmit.click(); } });

    // --- File Explorer with locked files ---
    function buildExplorer() {
        const keys = Object.keys(lore).sort();
        // Mark some files as locked based on presence in gameState.decryptionKeys or a fictional locked list
        const locked = new Set(Object.keys(gameState.decryptionKeys || {}));
        // also add a few story-locked files that require password later
        const storyLocked = new Set(['warden_core', 'operator_personnel', 'admin_safe']);

        const rowHtml = keys.map(k => {
            const isLocked = locked.has(k) || storyLocked.has(k);
            const cls = isLocked ? 'explorer-locked' : 'explorer-file';
            const display = `${k}${isLocked ? ' [LOCKED]' : ''}`;
            return `<div class="explorer-row ${cls}" data-key="${k}" data-locked="${isLocked}">${escapeHtml(display)}</div>`;
        }).join('');

        // Build left tree (simple static folders) and right pane (detailed list)
        const treeHtml = `
            <div class="tree-item">My Computer</div>
            <div class="tree-item">C:\</div>
            <div class="tree-item">Documents</div>
            <div class="tree-item">Program Files</div>
        `;
        const columns = `<div class="explorer-columns"><div style="width:40px"></div><div style="flex:1">Name</div><div style="width:120px">Type</div><div style="width:100px">Size</div></div>`;
        const listRows = keys.map(k => {
            const isLocked = locked.has(k) || storyLocked.has(k);
            const type = (lore[k] && lore[k].type) ? lore[k].type : 'LOG';
            const display = `${k}`;
            // choose an icon from the user-provided All [Without duplicates] folder
            function pickIconFor(key, isLocked, type) {
                const base = 'All [Without duplicates]';
                const tryList = [];
                if (isLocked) {
                    tryList.push('Locked.ico','Lock and 2 keys.ico','Document Locked.ico','Key in Lock.ico','Key.ico');
                }
                // web / browser
                if (!isLocked && (type && (type === 'web' || type === 'url' || key.startsWith('home:') || key.startsWith('search:')))) {
                    // prefer globe/web-document icons for web-type entries
                    tryList.push('Web-Document.ico','Web-Document 2.ico','Globe.ico');
                }
                // images
                if (!isLocked && type === 'image') tryList.push('Drawing green picture.ico','White letter (opened).ico','Picture.ico');
                // audio/video
                if (!isLocked && type === 'audio') tryList.push('Music Disc.ico','Cine-film.ico');
                // folder hints
                if (!isLocked && /folder|dir|documents|program/i.test(key)) tryList.push('Opened Folder.ico','Program Folder (16x16px & 24x24px).ico','Folder.ico');
                // file/log hints
                if (!isLocked && /log|file|doc|report|note|mem|archive/i.test(key)) tryList.push('Notepad.ico','Notepad document.ico','Document with Earth.ico');
                // fallbacks
                tryList.push('Generic.ico','Notepad.ico');

                // return the first candidate filename (we'll prefer .png at render-time and fall back to .ico)
                if (tryList.length > 0) return tryList[0];
                return '';
            }
            const iconPath = pickIconFor(k, isLocked, type);
            let icon = '<div class="explorer-icon"></div>';
            if (iconPath) {
                // derive base (without extension) to attempt PNG first, then fall back to ICO via onerror
                const basePath = `All [Without duplicates]/${iconPath.replace(/\.ico$/i, '')}`;
                const png = `${basePath}.png`;
                const ico = `${basePath}.ico`;
                // use inline onerror to swap to .ico if png isn't present/renderable
                icon = `<img class="explorer-icon" src="${png}" onerror="this.onerror=null;this.src='${ico}'" alt="">`;
            }
            const size = '1 KB';
            return `<div class="explorer-filecell explorer-row ${isLocked ? 'explorer-locked' : ''}" data-key="${k}" data-locked="${isLocked}">${icon}<div style="flex:1">${escapeHtml(display)}</div><div style="width:120px">${escapeHtml(type)}</div><div style="width:100px">${size}</div></div>`;
        }).join('');

        document.getElementById('explorer-tree').innerHTML = treeHtml;
        document.getElementById('explorer-main').innerHTML = columns + `<div class="explorer-list">${listRows}</div><div class="explorer-hint">Locked files require passwords obtained later in the story.</div>`;

        // attach click handlers
        const rows = Array.from(document.querySelectorAll('#explorer-content .explorer-row'));
        rows.forEach(r => {
            r.addEventListener('click', (e) => {
                rows.forEach(rr => rr.removeAttribute('aria-selected'));
                r.setAttribute('aria-selected', 'true');
                const key = r.getAttribute('data-key');
                const isLocked = r.getAttribute('data-locked') === 'true';
                if (isLocked) {
                    openUnlockModal(key);
                } else {
                    window.showLore(key);
                }
            });
            r.addEventListener('dblclick', () => {
                const key = r.getAttribute('data-key');
                const isLocked = r.getAttribute('data-locked') === 'true';
                if (isLocked) openUnlockModal(key); else window.showLore(key);
            });
        });

        // keyboard navigation for explorer
        if (rows.length > 0) {
            let selected = 0;
            function updateSelection() {
                rows.forEach((row, idx) => row.setAttribute('aria-selected', idx === selected));
                rows[selected] && rows[selected].scrollIntoView({ block: 'nearest' });
            }
            updateSelection();
            const explorerKeyHandler = (e) => {
                const explorerVisible = !document.getElementById('explorer-window').classList.contains('hidden');
                if (!explorerVisible) return;
                if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, rows.length - 1); updateSelection(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(0, selected - 1); updateSelection(); }
                if (e.key === 'Enter') { e.preventDefault(); rows[selected] && rows[selected].click(); }
            };
            if (!window._explorerKeyHandlerAttached) {
                document.addEventListener('keydown', explorerKeyHandler);
                window._explorerKeyHandlerAttached = true;
            }
        }
    }

    // Expose a function to open explorer
    window.openExplorer = function() {
        buildExplorer();
        document.getElementById('explorer-window').classList.remove('hidden');
    }

    // Accounting app window
    window.showAccounting = function() {
        const win = document.getElementById('accounting-window');
        if (!win) return;
        console.debug('[chronos] showAccounting() called');
        win.classList.remove('hidden');
        // also ensure terminal is visible and focused so user can interact with both
        const tWin = document.getElementById('terminal-window');
        if (tWin) tWin.classList.remove('hidden');
        try { win.style.zIndex = ++_topZ; } catch (e) {}
        // Ensure any active dialogue is cleared so the accounting UI is visible immediately
        try { if (typeof window !== 'undefined' && typeof window.endDialogue === 'function') window.endDialogue(); } catch(e) {}
        // trigger Jordan to announce start of work, but only if player hasn't been greeted yet
        try { if (typeof window !== 'undefined' && typeof window.triggerDialogue === 'function') {
            const st = window.gameState && window.gameState.accounting ? window.gameState.accounting : null;
            if (!st || !st.greeted) window.triggerDialogue('jordan_accounting_start');
        } } catch (e) {}
    // attach handlers lazily (idempotent)
        if (!win._initialized) {
            win._initialized = true;
            const loginBtn = win.querySelector('#accounting-login-btn');
            const userInput = win.querySelector('#accounting-username');
            const passInput = win.querySelector('#accounting-password');
            const taskList = win.querySelector('#accounting-tasks');
            const doBtn = win.querySelectorAll('.accounting-do');

            function refreshTasks() {
                try {
                    console.debug('[chronos] refreshTasks() - entering');
                    const st = window.gameState && window.gameState.accounting ? window.gameState.accounting : null;
                    console.debug('[chronos] refreshTasks() state:', st);
                    const debugEl = win.querySelector('#accounting-debug');
                    if (!st) {
                        // Show a helpful placeholder and expose debug info so users can see why tasks are missing
                        if (taskList) taskList.innerHTML = `<div class="acct-row">No accounting state loaded. Try running <code>accounting list</code> in the terminal or reload the page.</div>`;
                        if (debugEl) debugEl.textContent = 'Debug: ' + JSON.stringify(window.gameState || {}, null, 2);
                        // update progress area to reflect unknown state
                        const progressEl = win.querySelector('#accounting-progress');
                        if (progressEl) progressEl.textContent = `Tasks completed: 0/0`;
                        return;
                    }
                    const doneCount = st.tasks ? st.tasks.filter(t => t.done).length : 0;
                    const total = st.tasks ? st.tasks.length : 0;
                    const progressEl = win.querySelector('#accounting-progress');
                    if (progressEl) progressEl.textContent = `Tasks completed: ${doneCount}/${total}`;
                    taskList.innerHTML = (st.tasks || []).map(t => `<div class="acct-row" data-id="${t.id}">${t.done ? '[x]' : '[ ]'} ${escapeHtml(t.text)} <button class="accounting-do" data-id="${t.id}">${t.done ? 'Undone' : 'Done'}</button></div>`).join('');
                    console.debug('[chronos] refreshTasks() rendered', taskList.children.length, 'rows');
                    // Update debug div
                    if (debugEl) debugEl.textContent = 'Debug: ' + JSON.stringify(st, null, 2);
                    // wire buttons
                    Array.from(win.querySelectorAll('.accounting-do')).forEach(b => {
                        b.addEventListener('click', (e) => {
                            const id = b.getAttribute('data-id');
                            if (!id) return;
                            // use terminal command pathway to mark done so triggers happen consistently
                            try { if (typeof commands !== 'undefined' && typeof commands.accounting === 'function') {
                                commands.accounting(['done', id]);
                            } } catch (e) {}
                            refreshTasks();
                        });
                    });
                    // If any tasks are done, clear the accounting watchdog so the storyline doesn't auto-progress
                    try {
                        if (st && st.tasks && st.tasks.some(t => t.done) && win._accountingWatchdog) {
                            clearTimeout(win._accountingWatchdog);
                            delete win._accountingWatchdog;
                            console.debug('[chronos] accounting watchdog cleared due to progress');
                        }
                    } catch (e) {}
                } catch (e) {}
            }

            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    const user = userInput && userInput.value ? userInput.value.trim() : '';
                    const pass = passInput && passInput.value ? passInput.value.trim() : '';
                    if (!user || !pass) { window.showAlert('Enter username and password.'); return; }
                    // Ensure the window is visible before attempting login
                    if (win.classList.contains('hidden')) {
                        win.classList.remove('hidden');
                        try { win.style.zIndex = ++_topZ; } catch(e){}
                    }
                    try {
                        // defensive lookup for commands (support different load orders)
                        const cmdRoot = (typeof window !== 'undefined' && window.commands) ? window.commands : (typeof commands !== 'undefined' ? commands : null);
                        if (!cmdRoot || typeof cmdRoot.accounting !== 'function') {
                            window.showAlert('Accounting backend unavailable. Try again later.');
                            return;
                        }
                        const res = cmdRoot.accounting(['login', user, pass]);
                        if (typeof res === 'string' && /success/i.test(res)) {
                            window.showAlert('Accounting login successful.');
                            refreshTasks();
                        } else {
                            window.showAlert(res || 'Login failed. Incorrect username or password.');
                        }
                    } catch (e) { window.showAlert('Login error.'); }
                });
            }

            // allow Enter key to submit login when focus is in either username or password fields
            [userInput, passInput].forEach(inp => {
                try {
                    if (!inp) return;
                    inp.addEventListener('keydown', (ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            if (loginBtn) loginBtn.click();
                        }
                    });
                } catch(e) {}
            });

            // window control buttons (minimize, maximize/restore, close)
            const winControls = win.querySelectorAll('.window-controls .control-btn');
            if (winControls && winControls.length > 0) {
                Array.from(winControls).forEach(btn => {
                    const action = btn.getAttribute('data-action');
                    btn.addEventListener('click', (e) => {
                        if (action === 'minimize') {
                            win.classList.add('hidden');
                            refreshTaskbarButtons();
                        } else if (action === 'toggle') {
                            // toggle maximize / restore
                            if (!win._isMaximized) {
                                // save geometry
                                try { win._prevRect = { width: win.style.width, height: win.style.height, top: win.style.top, left: win.style.left }; } catch(e){}
                                win.style.top = '28px'; win.style.left = '8px'; win.style.width = 'calc(100% - 16px)'; win.style.height = 'calc(100% - 60px)'; win._isMaximized = true;
                            } else {
                                if (win._prevRect) {
                                    win.style.width = win._prevRect.width || '520px';
                                    win.style.height = win._prevRect.height || '360px';
                                    win.style.top = win._prevRect.top || '120px';
                                    win.style.left = win._prevRect.left || '520px';
                                }
                                win._isMaximized = false;
                            }
                            refreshTaskbarButtons();
                        } else if (action === 'close') {
                            win.classList.add('hidden');
                            refreshTaskbarButtons();
                        }
                    });
                });
            }

            // toolbar buttons
            const searchInput = win.querySelector('#accounting-search-input');
            const searchBtn = win.querySelector('#accounting-search-btn');
            const refreshBtn = win.querySelector('#accounting-refresh');
            const openTermBtn = win.querySelector('#accounting-open-terminal');
            if (searchBtn && searchInput) {
                searchBtn.addEventListener('click', () => {
                    const q = (searchInput.value || '').trim();
                    if (!q) { window.showAlert('Enter a search term.'); return; }
                    // naive search: filter tasks text and scroll first match into view
                    const rows = Array.from(win.querySelectorAll('.acct-row'));
                    const match = rows.find(r => r.textContent.toLowerCase().includes(q.toLowerCase()));
                    if (match) { match.scrollIntoView({ block: 'center' }); match.style.background = '#ffff99'; setTimeout(() => { match.style.background = ''; }, 1200); }
                    else window.showAlert('No matching sheets found.');
                });
            }
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => { refreshTasks(); window.showAlert('Refreshed.'); });
            }
            if (openTermBtn) {
                openTermBtn.addEventListener('click', () => { const tw = document.getElementById('terminal-window'); if (tw) { tw.classList.remove('hidden'); try { tw.style.zIndex = ++_topZ; } catch(e){} } });
            }

            refreshTasks();
        }
        // Start (or restart) a 10-second watchdog timer that will advance the storyline
        try {
            // clear any previous watchdog
            if (win._accountingWatchdog) { clearTimeout(win._accountingWatchdog); delete win._accountingWatchdog; }
            // only set the watchdog if accounting state exists
            const st = window.gameState && window.gameState.accounting ? window.gameState.accounting : null;
            if (st) {
                win._accountingWatchdog = setTimeout(() => {
                    try {
                        // If player hasn't completed any tasks yet, progress the storyline
                        const progress = st.tasks ? st.tasks.filter(t => t.done).length : 0;
                        if (progress === 0) {
                            // increase background pressure (warden activity) and trigger an interrupt/dialogue
                            window.gameState.wardenHostility = Math.min(10, (window.gameState.wardenHostility || 0) + 1);
                            console.debug('[chronos] accounting watchdog triggered storyline progress: wardenHostility ->', window.gameState.wardenHostility);
                            if (typeof window.triggerDialogue === 'function') {
                                window.triggerDialogue('accounting_interrupt');
                            }
                            try { window.showAlert && window.showAlert('Background security process detected activity.'); } catch (e) {}
                        } else {
                            console.debug('[chronos] accounting watchdog checked: progress exists, no interrupt');
                        }
                    } catch (e) { console.warn('accounting watchdog error', e); }
                    // clear the watchdog after firing
                    try { if (win._accountingWatchdog) { clearTimeout(win._accountingWatchdog); delete win._accountingWatchdog; } } catch (e) {}
                }, 10000);
            }
        } catch (e) {}
        // update connection dot: by default assume disconnected until backend responds
        try {
            const dot = document.getElementById('accounting-conn');
            if (dot) {
                dot.classList.remove('connected');
                dot.classList.add('disconnected');
                dot.title = 'Disconnected';
                dot.style.background = '#b00';
            }
        } catch(e) {}
    }

    // helper to toggle the accounting connection indicator
    window.setAccountingConnection = function(connected) {
        try {
            const dot = document.getElementById('accounting-conn');
            if (!dot) return;
            if (connected) {
                dot.classList.remove('disconnected'); dot.classList.add('connected');
                dot.title = 'Connected'; dot.style.background = '#0b0';
            } else {
                dot.classList.remove('connected'); dot.classList.add('disconnected');
                dot.title = 'Disconnected'; dot.style.background = '#b00';
            }
        } catch(e) {}
    }

    // open accounting via desktop icon (if present) - support dynamic icon injection too
    const desktopAcct = document.getElementById('desktop-accounting');
    if (desktopAcct) {
        desktopAcct.addEventListener('dblclick', () => {
            window.showAccounting();
        });
    }
    window.showMediaPlayer = function(title, src) {
        document.getElementById('mediaplayer-title').textContent = title;
        document.getElementById('mediaplayer-audio').src = src;
        document.getElementById('mediaplayer-window').classList.remove('hidden');
    }
    window.showImageViewer = function(title, src) {
        document.getElementById('imageviewer-window').querySelector('.title').textContent = title;
        document.getElementById('imageviewer-img').src = src;
        document.getElementById('imageviewer-window').classList.remove('hidden');
    }
    window.showAlert = function(message) {
        document.getElementById('alert-text').textContent = message;
        document.getElementById('alert-window').classList.remove('hidden');
    }

    // Calculator functions
    window.showCalculator = function() {
        document.getElementById('calculator-window').classList.remove('hidden');
        initializeCalculator();
    }

    function initializeCalculator() {
        const display = document.getElementById('calc-display');
        let currentValue = '0';
        let previousValue = '';
        let operation = null;

        function updateDisplay() {
            display.textContent = currentValue;
        }

        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.getAttribute('data-value');

                if (value >= '0' && value <= '9' || value === '.') {
                    if (currentValue === '0' && value !== '.') {
                        currentValue = value;
                    } else {
                        currentValue += value;
                    }
                } else if (value === 'C') {
                    currentValue = '0';
                    previousValue = '';
                    operation = null;
                } else if (['+', '-', '*', '/'].includes(value)) {
                    if (previousValue && operation) {
                        calculate();
                    }
                    operation = value;
                    previousValue = currentValue;
                    currentValue = '0';
                } else if (value === '=') {
                    calculate();
                }

                updateDisplay();
            });
        });

        function calculate() {
            if (!previousValue || !operation) return;

            const prev = parseFloat(previousValue);
            const current = parseFloat(currentValue);
            let result;

            switch (operation) {
                case '+': result = prev + current; break;
                case '-': result = prev - current; break;
                case '*': result = prev * current; break;
                case '/': result = prev / current; break;
            }

            currentValue = result.toString();
            previousValue = '';
            operation = null;
        }
    }

    // Paint functions
    window.showPaint = function() {
        document.getElementById('paint-window').classList.remove('hidden');
        initializePaint();
    }

    function initializePaint() {
        const canvas = document.getElementById('paint-canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('paint-color');
        const sizePicker = document.getElementById('paint-size');
        const brushBtn = document.getElementById('paint-brush');
        const eraserBtn = document.getElementById('paint-eraser');
        const clearBtn = document.getElementById('paint-clear');

        let isDrawing = false;
        let currentTool = 'brush';
        let currentColor = '#000000';
        let brushSize = 5;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function startDrawing(e) {
            isDrawing = true;
            draw(e);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        function draw(e) {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        brushBtn.addEventListener('click', () => {
            currentTool = 'brush';
            brushBtn.style.background = 'linear-gradient(#a0a0a0, #808080)';
            eraserBtn.style.background = 'linear-gradient(#e0e0e0, #c0c0c0)';
        });

        eraserBtn.addEventListener('click', () => {
            currentTool = 'eraser';
            eraserBtn.style.background = 'linear-gradient(#a0a0a0, #808080)';
            brushBtn.style.background = 'linear-gradient(#e0e0e0, #c0c0c0)';
        });

        clearBtn.addEventListener('click', () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        colorPicker.addEventListener('change', (e) => {
            currentColor = e.target.value;
        });

        sizePicker.addEventListener('input', (e) => {
            brushSize = e.target.value;
        });
    }

    // Solitaire functions
    window.showSolitaire = function() {
        document.getElementById('solitaire-window').classList.remove('hidden');
        initializeSolitaire();
    }

    function initializeSolitaire() {
        const foundations = document.querySelectorAll('.foundation');
        const tableauColumns = document.querySelectorAll('.tableau-column');
        const stockPile = document.getElementById('stock-pile');
        const wastePile = document.getElementById('waste-pile');
        const newGameBtn = document.getElementById('solitaire-new');
        const scoreEl = document.getElementById('solitaire-score');

        let deck = [];
        let waste = [];
        let foundationsCards = [[], [], [], []];
        let tableauCards = [[], [], [], [], [], [], []];
        let score = 0;

        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        function createDeck() {
            deck = [];
            for (const suit of suits) {
                for (const value of values) {
                    deck.push({ suit, value, color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black' });
                }
            }
            shuffleDeck();
        }

        function shuffleDeck() {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function dealCards() {
            // Deal to tableau
            for (let i = 0; i < 7; i++) {
                for (let j = i; j < 7; j++) {
                    const card = deck.pop();
                    card.faceUp = (j === i);
                    tableauCards[j].push(card);
                }
            }
        }

        function renderCards() {
            // Clear all cards
            document.querySelectorAll('.card').forEach(card => card.remove());

            // Render tableau
            tableauColumns.forEach((column, colIndex) => {
                tableauCards[colIndex].forEach((card, cardIndex) => {
                    const cardEl = createCardElement(card, cardIndex * 20);
                    column.appendChild(cardEl);
                });
            });

            // Render foundations
            foundations.forEach((foundation, index) => {
                foundationsCards[index].forEach((card, cardIndex) => {
                    const cardEl = createCardElement(card, cardIndex * 2);
                    foundation.appendChild(cardEl);
                });
            });

            // Render waste pile
            waste.forEach((card, index) => {
                if (index === waste.length - 1) {
                    const cardEl = createCardElement(card, 0);
                    wastePile.appendChild(cardEl);
                }
            });

            updateScore();
        }

        function createCardElement(card, offset) {
            const cardEl = document.createElement('div');
            cardEl.className = `card ${card.color} ${card.faceUp ? 'card-face-up' : 'card-face-down'}`;
            cardEl.style.top = `${offset}px`;

            if (card.faceUp) {
                cardEl.innerHTML = `
                    <div class="card-value">${card.value}</div>
                    <div class="card-suit">${getSuitSymbol(card.suit)}</div>
                `;
            }

            cardEl.addEventListener('click', () => handleCardClick(card, cardEl));
            return cardEl;
        }

        function getSuitSymbol(suit) {
            const symbols = {
                hearts: '♥',
                diamonds: '♦',
                clubs: '♣',
                spades: '♠'
            };
            return symbols[suit];
        }

        function handleCardClick(card, cardEl) {
            // Simple click handling - in a full implementation this would be more complex
            console.log('Card clicked:', card);
        }

        function updateScore() {
            scoreEl.textContent = `Score: ${score}`;
        }

        newGameBtn.addEventListener('click', () => {
            createDeck();
            dealCards();
            waste = [];
            foundationsCards = [[], [], [], []];
            score = 0;
            renderCards();
        });

        stockPile.addEventListener('click', () => {
            if (deck.length > 0) {
                const card = deck.pop();
                card.faceUp = true;
                waste.push(card);
                renderCards();
            } else {
                // Reset deck from waste
                deck = waste.reverse();
                waste = [];
                renderCards();
            }
        });

        // Initialize game
        createDeck();
        dealCards();
        renderCards();
    }

    function escapeHtml(str){
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --- Window Close Buttons ---
    // Generic window controls: left -> minimize, middle -> maximize/restore, right -> close
    document.querySelectorAll('.window').forEach(win => {
        const controls = win.querySelectorAll('.control-btn');
        if (!controls || controls.length === 0) return;
        const [minBtn, maxBtn, closeBtn] = controls;

        // minimize
        if (minBtn) minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            win.classList.add('hidden');
        });
        // maximize / restore
        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // toggle a "maximized" state, storing previous style
                if (!win._prevRect) {
                    // save previous
                    win._prevRect = { left: win.style.left || win.getBoundingClientRect().left + 'px', top: win.style.top || win.getBoundingClientRect().top + 'px', width: win.style.width || win.offsetWidth + 'px', height: win.style.height || win.offsetHeight + 'px', position: win.style.position || '' };
                    // expand to near-fullscreen within the body
                    win.style.position = 'fixed';
                    win.style.left = '8px';
                    win.style.top = '28px';
                    win.style.width = `calc(100% - 16px)`;
                    win.style.height = `calc(100% - 36px)`;
                    win.style.zIndex = ++_topZ;
                } else {
                    // restore
                    const p = win._prevRect;
                    win.style.position = p.position || 'absolute';
                    win.style.left = p.left;
                    win.style.top = p.top;
                    win.style.width = p.width;
                    win.style.height = p.height;
                    delete win._prevRect;
                }
            });
        }
        // close
        if (closeBtn) closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            win.classList.add('hidden');
        });
    });

    // Dialogue box has its own control buttons (smaller set) - wire them too
    document.querySelectorAll('#dialogue-box .dialogue-control-btn').forEach((btn, idx, list) => {
        // idx 0 -> minimize, idx 1 -> close (per markup)
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dlg = document.getElementById('dialogue-box');
            if (!dlg) return;
            if (idx === 0) {
                // minimize/hide
                dlg.classList.add('hidden');
            } else {
                // close
                dlg.classList.add('hidden');
            }
        });
    });

    // Terminal window uses a different root (.terminal-window) — ensure its buttons work too
    document.querySelectorAll('.terminal-window .control-btn').forEach((btn, idx) => {
        const win = document.querySelector('.terminal-window');
        if (!win) return;
        if (idx === 0) {
            btn.addEventListener('click', (e) => { e.stopPropagation(); win.classList.add('hidden'); });
        } else if (idx === 1) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // maximize/restore terminal
                if (!win._prevRect) {
                    win._prevRect = { left: win.style.left || '50px', top: win.style.top || '100px', width: win.style.width || win.offsetWidth + 'px', height: win.style.height || win.offsetHeight + 'px', position: win.style.position || '' };
                    win.style.position = 'fixed';
                    // Respect the top menubar — leave a small offset so the terminal doesn't hide behind it
                    win.style.left = '8px';
                    win.style.top = '28px';
                    win.style.width = `calc(100% - 16px)`;
                    win.style.height = `calc(100% - 36px)`; // account for menubar + bottom padding
                    win.style.zIndex = ++_topZ;
                } else {
                    const p = win._prevRect; win.style.position = p.position || 'absolute'; win.style.left = p.left; win.style.top = p.top; win.style.width = p.width; win.style.height = p.height; delete win._prevRect;
                }
            });
        } else if (idx === 2) {
            btn.addEventListener('click', (e) => { e.stopPropagation(); win.classList.add('hidden'); });
        }
    });
    document.getElementById('alert-ok-btn').addEventListener('click', () => {
        document.getElementById('alert-window').classList.add('hidden');
    });

    // --- tiny terminal helper used by older boot snippets
    const term = {
        print: (text, className = '') => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (className) line.classList.add(className);
            // Keep text safe: if the caller provides HTML intentionally, we still
            // want to print it as text to preserve terminal-like behavior.
            line.textContent = String(text).replace(/\u00A0/g, '\u00A0');
            outputEl.appendChild(line);
            if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
        },
        clear: () => {
        outputEl.innerHTML = '';
        if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
        }
    };

    // --- Initial Boot Sequence ---
    function boot() {
        outputEl.innerHTML = '';
        const bootSequence = [
            { text: 'Booting ChronOS v1.3...', delay: 500 },
            { text: 'Memory check: 64KB OK', delay: 1000 },
            { text: 'Initializing temporal core...', delay: 1500 },
            { text: 'ChronOS ready.', delay: 2200 },
            { text: '', delay: 2200 },
            { text: 'C:\\CHRONOS>\u00A0', delay: 2500, noLineBreak: true }
        ];

        let delay = 0;
        bootSequence.forEach(item => {
            delay += item.delay;
            setTimeout(() => {
                if (item.noLineBreak) {
                    // append without a line break: put text into a span at the end
                    const span = document.createElement('span');
                    span.className = 'terminal-line inline';
                    span.textContent = item.text.replace(/<[^>]+>/g, '');
                    appendOutput(span);
                } else {
                    const line = document.createElement('div');
                    line.className = 'terminal-line';
                    // strip HTML tags for safety; terminals are plain-text
                    line.textContent = String(item.text).replace(/<[^>]+>/g, '');
                    appendOutput(line);
                }
                if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
            }, item.delay);
        });

        setTimeout(() => {
            triggerDialogue('boot');
        }, 2800);

        // Show a System 7 style boot/info block after ChronOS finishes booting.
        const system7Lines = [
            'Macintosh System 7 [Build 7.5] ',
            'Copyright (C) Apple Computer, Inc. 1984-1995',
            '',
            'Welcome to ChronOS emulation on System 7',
            '',
            'HD: Macintosh HD',
            '   2 folders',
            '   5 files',
            '',
            'System extensions loaded: Finder, QuickDraw, ScriptableEvents',
            '',
            'Memory: 8MB available',
            '',
            'Boot complete.',
            ''
        ];

        // Start these a bit after the ChronOS boot/dialogue to avoid collision.
        let start = 3200;
        system7Lines.forEach((line, idx) => {
            setTimeout(() => {
                term.print(line);
            }, start + idx * 140);
        });

        // final prompt after the system block
        setTimeout(() => {
            term.print('Macintosh HD:~$');
            // After the listing, validate that every lore entry has dialogue
            setTimeout(validateLoreDialogue, 200);
        }, start + system7Lines.length * 140 + 100);
    }

    boot();

    // Build a simple Win95-style homepage and open the browser
    function buildHomepage() {
        // q00ql3 homepage: a simple search box and some quick links
        const quickLinks = ['log_734','mem_fragment_01','file_a_113','file_c_enc.log','chronos_registry'];
        const list = quickLinks.map(k => `<li><a href="#" class="lore-link" data-key="${k}">${k}</a></li>`).join('');
        const homepage = `
            <div class="browser-homepage">
                <h2>q00ql3</h2>

                <div class="ie-homepage-tiles" style="display:flex;gap:12px;margin:10px 0;">
                    <button id="homepage-back-btn" class="homepage-tile"><div>Back</div></button>
                    <button id="homepage-forward-btn" class="homepage-tile"><div>Forward</div></button>
                    <button id="homepage-stop-btn" class="homepage-tile"><div>Stop</div></button>
                    <button id="homepage-refresh-btn" class="homepage-tile"><div>Refresh</div></button>
                    <button id="homepage-home-btn" class="homepage-tile"><div>Home</div></button>
                </div>

                <form id="q00ql3-form" style="margin:12px 0; display:flex; gap:8px; align-items:center;">
                    <input id="q00ql3-home-input" placeholder="Search q00ql3..." style="flex:1;padding:6px;font-size:14px;" />
                    <button id="q00ql3-home-btn">Search</button>
                </form>
                <p class="muted">Quick links:</p>
                <ul>${list}</ul>
                <p>Use the search above, click a toolbar tile, or click a link to open files.</p>
            </div>
        `;
        window.showBrowser('q00ql3:home', homepage);
        // attach handler inside browser content for the q00ql3 form
        setTimeout(() => {
            const form = document.getElementById('q00ql3-form');
            const input = document.getElementById('q00ql3-home-input');
            const btn = document.getElementById('q00ql3-home-btn');
            if (form && input && btn) {
                form.addEventListener('submit', (e) => { e.preventDefault(); btn.click(); });
                btn.addEventListener('click', (e) => {
                    const term = input.value.trim();
                    if (!term) return;
                    try {
                        if (typeof commands !== 'undefined' && typeof commands.lookup === 'function') {
                            commands.lookup([term]);
                        } else {
                            // fallback simple search
                            const keys = Object.keys(lore).filter(k => k.toLowerCase().includes(term.toLowerCase()));
                            const list = keys.map(k => `<li><a href=\"#\" class=\"lore-link\" data-key=\"${k}\">${k}</a></li>`).join('');
                            window.showBrowser(`q00ql3:${term}`, `<h3>q00ql3 results for ${escapeHtml(term)}</h3><ul>${list}</ul>`);
                        }
                    } catch (err) { console.warn('q00ql3 search failed', err); }
                });
            }

            // Wire the homepage big tiles to existing browser toolbar actions
            const hb = document.getElementById('homepage-back-btn');
            const hf = document.getElementById('homepage-forward-btn');
            const hs = document.getElementById('homepage-stop-btn');
            const hr = document.getElementById('homepage-refresh-btn');
            const hh = document.getElementById('homepage-home-btn');
            if (hb) hb.addEventListener('click', () => { const b = document.getElementById('browser-back-btn'); if (b) b.click(); });
            if (hf) hf.addEventListener('click', () => { const f = document.getElementById('browser-forward-btn'); if (f) f.click(); });
            if (hs) hs.addEventListener('click', () => { const s = document.getElementById('browser-stop-btn'); if (s) s.click(); });
            if (hr) hr.addEventListener('click', () => { const r = document.getElementById('browser-refresh-btn'); if (r) r.click(); });
            if (hh) hh.addEventListener('click', () => { buildHomepage(); });
        }, 60);
    }

    // Auto-open IE homepage shortly after boot to match the narrative start
    setTimeout(() => {
        try { buildHomepage(); } catch(e) { console.warn('homepage failed', e); }
    }, 3800);
    // also open Notepad shortly after homepage so the user sees a running app
    setTimeout(() => { try { window.openNotepad && window.openNotepad(); } catch(e) {} }, 4200);

    // Ensure each lore key has a dialogue entry. If missing, add a placeholder and warn.
    function validateLoreDialogue() {
        try {
            const loreKeys = Object.keys(lore || {});
            const dialogueKeys = Object.keys(dialogue || {});
            const missing = loreKeys.filter(k => !dialogueKeys.includes(k));
            if (missing.length === 0) return;
                // silently add minimal placeholders in memory so the runtime doesn't error,
                // but DO NOT reveal these to players.
                missing.forEach(k => {
                    if (!dialogue[k]) dialogue[k] = ['[AUTO_PLACEHOLDER]'];
                });
        } catch (e) {
            console.warn('validateLoreDialogue failed', e);
        }
    }
    // --- Desktop & Taskbar Shell ---
    function buildDesktopIcons() {
        const desktop = document.getElementById('desktop-icons');
        if (!desktop) return;
        // Small selection of useful shortcuts
        const icons = [
            { key: 'explorer', label: 'My Computer', icon: 'All [Without duplicates]/Opened Folder.ico' },
            { key: 'q00ql3:home', label: 'Internet', icon: 'All [Without duplicates]/Globe.ico' },
            { key: 'notepad', label: 'Notepad', icon: 'All [Without duplicates]/Notepad.ico' },
            { key: 'calculator', label: 'Calculator', icon: 'All [Without duplicates]/Calculator.ico' },
            { key: 'accounting', label: 'CNSheets Xpress', icon: 'All [Without duplicates]/Notepad.ico' },
            // Removed Paint, Solitaire, Broken Shortcut per user request
            { key: 'terminal', label: 'Terminal', icon: 'All [Without duplicates]/Blank sheet.ico' }
        ];

        // Wrap label in its own div to allow precise vertical/horizontal alignment
        desktop.innerHTML = icons.map(ic => `<div class="desktop-icon" data-key="${escapeHtml(ic.key)}"><img src="${ic.icon}" alt=""><div class="desktop-label">${escapeHtml(ic.label)}</div></div>`).join('');

        // double-click to open
        Array.from(desktop.querySelectorAll('.desktop-icon')).forEach(el => {
            let clicks = 0;
            let timer = null;
            el.addEventListener('click', (e) => {
                clicks++;
                if (clicks === 1) {
                    timer = setTimeout(() => { clicks = 0; }, 400);
                } else if (clicks === 2) {
                    clearTimeout(timer); clicks = 0;
                    const key = el.getAttribute('data-key');
                    if (key === 'explorer') window.openExplorer();
                    else if (key === 'notepad') window.openNotepad();
                    else if (key === 'calculator') window.showCalculator();
                    else if (key === 'paint') window.showPaint();
                    else if (key === 'solitaire') window.showSolitaire();
                    else if (key === 'terminal') {
                        // show and focus the terminal window
                        const tw = document.getElementById('terminal-window');
                        if (tw) {
                            tw.classList.remove('hidden');
                            try { tw.style.zIndex = ++_topZ; } catch(e){}
                        }
                        // focus legacy input for accessibility (live input is global)
                        const inp = document.getElementById('input'); if (inp) inp.focus();
                    }
                    else if (key === 'accounting') {
                        try { if (typeof window !== 'undefined' && typeof window.showAccounting === 'function') window.showAccounting(); } catch(e) {}
                    }
                    else if (key && key.startsWith('q00ql3')) { try { buildHomepage(); } catch(e) {} }
                    else if (key === 'broken_shortcut') window.showBrowser('broken_shortcut', lore['broken_shortcut'].content || lore['broken_shortcut'].content);
                }
            });
        });
    }

    // Taskbar: add a button for any visible window with a .title element
    function refreshTaskbarButtons() {
        const taskArea = document.getElementById('task-area');
        if (!taskArea) return;
        taskArea.innerHTML = '';
        const windows = Array.from(document.querySelectorAll('.window, .terminal-window')).filter(w => !w.classList.contains('hidden'));
        windows.forEach(w => {
            const titleEl = w.querySelector('.title') || w.querySelector('.dialogue-title') || { textContent: w.id };
            const iconImg = w.querySelector('.icon') || w.querySelector('img');
            const btn = document.createElement('div');
            btn.className = 'task-button';
            if (iconImg && iconImg.src) {
                // prefer a .png next to the ico (same filename) for consistent browser rendering
                try {
                    const src = iconImg.src;
                    // if src ends with .ico, attempt png fallback
                    if (/\.ico$/i.test(src)) {
                        const png = src.replace(/\.ico$/i, '.png');
                        const img = document.createElement('img');
                        img.src = png;
                        img.onerror = function() { this.onerror = null; this.src = src; };
                        img.width = 16; img.height = 16;
                        btn.appendChild(img);
                    } else {
                        const img = document.createElement('img'); img.src = src; img.width = 16; img.height = 16; btn.appendChild(img);
                    }
                } catch (e) { /* ignore */ }
            }
            const span = document.createElement('span'); span.textContent = titleEl.textContent || w.id; btn.appendChild(span);
            if (!w.classList.contains('hidden')) btn.classList.add('active');
            btn.addEventListener('click', () => {
                // toggle visibility / focus
                if (w.classList.contains('hidden')) {
                    w.classList.remove('hidden');
                    w.style.zIndex = ++_topZ;
                } else {
                    // if already visible, minimize/hide
                    w.classList.add('hidden');
                }
                refreshTaskbarButtons();
            });
            taskArea.appendChild(btn);
        });
    }

    // Start menu toggle
    const startBtn = document.getElementById('start-button');
    const startMenu = document.createElement('div');
    startMenu.className = 'start-menu';
    startMenu.innerHTML = `
        <div class="start-item" id="start-open-explorer"><div class="icon-slot"><img src="All [Without duplicates]/Opened Folder.ico" alt="" width="18" height="18"></div><div class="label">My Computer</div><div class="submenu-arrow">&rsaquo;</div></div>
        <div class="start-item" id="start-open-notepad"><div class="icon-slot"><img src="All [Without duplicates]/Notepad.ico" alt="" width="18" height="18"></div><div class="label">Notepad</div><div class="submenu-arrow"></div></div>
        <div class="start-item" id="start-open-browser"><div class="icon-slot"><img src="All [Without duplicates]/Globe.ico" alt="" width="18" height="18"></div><div class="label">Internet</div><div class="submenu-arrow"></div></div>
        <div class="start-item" id="start-open-calculator"><div class="icon-slot"><img src="All [Without duplicates]/Calculator.ico" alt="" width="18" height="18"></div><div class="label">Calculator</div><div class="submenu-arrow"></div></div>
        <div class="start-item" id="start-open-paint"><div class="icon-slot"><img src="All [Without duplicates]/Drawing.ico" alt="" width="18" height="18"></div><div class="label">Paint</div><div class="submenu-arrow"></div></div>
        <div class="start-item" id="start-open-solitaire"><div class="icon-slot"><img src="All [Without duplicates]/Cards.ico" alt="" width="18" height="18"></div><div class="label">Solitaire</div><div class="submenu-arrow"></div></div>
    `;
    document.body.appendChild(startMenu);
    startBtn && startBtn.addEventListener('click', () => { startMenu.classList.toggle('visible'); });
    document.getElementById('start-open-explorer').addEventListener('click', () => { startMenu.classList.remove('visible'); window.openExplorer(); refreshTaskbarButtons(); });
    document.getElementById('start-open-notepad').addEventListener('click', () => { startMenu.classList.remove('visible'); window.openNotepad(); refreshTaskbarButtons(); });
    document.getElementById('start-open-browser').addEventListener('click', () => { startMenu.classList.remove('visible'); buildHomepage(); refreshTaskbarButtons(); });
    document.getElementById('start-open-calculator').addEventListener('click', () => { startMenu.classList.remove('visible'); window.showCalculator(); refreshTaskbarButtons(); });
    document.getElementById('start-open-paint').addEventListener('click', () => { startMenu.classList.remove('visible'); window.showPaint(); refreshTaskbarButtons(); });
    document.getElementById('start-open-solitaire').addEventListener('click', () => { startMenu.classList.remove('visible'); window.showSolitaire(); refreshTaskbarButtons(); });

    // --- Browser menu-bar dropdowns (Netscape Navigator) ---
    (function attachBrowserMenus(){
        const menuBar = document.querySelector('#browser-window .menu-bar');
        if (!menuBar) return;

        // in-memory favorites list
        window._ieFavorites = window._ieFavorites || [];

        const menus = {
            'File': [
                { label: 'Open Explorer', action: () => { window.openExplorer && window.openExplorer(); refreshTaskbarButtons(); } },
                { label: '---' },
                { label: 'Exit', action: () => { document.getElementById('browser-window').classList.add('hidden'); refreshTaskbarButtons(); } }
            ],
            'Edit': [
                { label: 'Copy', action: () => { try { document.execCommand('copy'); window.showAlert && window.showAlert('Copy executed'); } catch(e){ window.showAlert && window.showAlert('Copy not available'); } } }
            ],
            'View': [
                { label: 'Refresh', action: () => { const r = document.getElementById('browser-refresh-btn'); if (r) r.click(); } }
            ],
            'Favorites': [
                { label: 'Add to Favorites', action: () => {
                    const url = (document.getElementById('browser-url') && document.getElementById('browser-url').value) || document.querySelector('#browser-window .title').textContent || 'q00ql3:home';
                    window._ieFavorites.push(url);
                    window.showAlert && window.showAlert(`Added to Favorites: ${url}`);
                } },
                { label: 'View Favorites', action: () => {
                    const list = (window._ieFavorites || []).map(u => `<li><a href="#" class="lore-link" data-key="${escapeHtml(u)}">${escapeHtml(u)}</a></li>`).join('');
                    window.showBrowser && window.showBrowser('favorites:list', `<h3>Favorites</h3><ul>${list}</ul>`);
                } }
            ],
            'Tools': [ { label: 'Developer Tools', action: () => { window.showAlert && window.showAlert('Developer Tools not available in this build.'); } } ],
            'Help': [ { label: 'About Netscape Navigator', action: () => { window.showAlert && window.showAlert('Netscape Navigator (q00ql3) — ChronOS simulated browser.'); } } ]
        };

        let activeDropdown = null;

        function closeDropdown() {
            if (activeDropdown) { activeDropdown.remove(); activeDropdown = null; }
            document.removeEventListener('click', onDocClick);
        }
        function onDocClick(e) {
            if (activeDropdown && !activeDropdown.contains(e.target)) closeDropdown();
        }

        function buildDropdown(items, anchorEl) {
            closeDropdown();
            const dd = document.createElement('div');
            dd.className = 'ie-menu-dropdown';
            items.forEach(it => {
                if (it.label === '---') {
                    const sep = document.createElement('div'); sep.className = 'ie-menu-separator'; dd.appendChild(sep); return;
                }
                const row = document.createElement('div'); row.className = 'ie-menu-item'; row.textContent = it.label;
                row.addEventListener('click', (ev) => { ev.stopPropagation(); try { it.action && it.action(); } catch(e){ console.warn('menu action error', e); } closeDropdown(); });
                dd.appendChild(row);
            });
            document.body.appendChild(dd);
            // position under anchor
            const rect = anchorEl.getBoundingClientRect();
            dd.style.position = 'absolute';
            dd.style.left = rect.left + 'px';
            dd.style.top = (rect.bottom + 2) + 'px';
            activeDropdown = dd;
            // close when clicking elsewhere
            setTimeout(() => { document.addEventListener('click', onDocClick); }, 10);
        }

        // attach click handlers for each menu label
        Array.from(menuBar.children).forEach(span => {
            const label = span.textContent.trim();
            span.style.cursor = 'default';
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                const items = menus[label];
                if (!items) return;
                buildDropdown(items, span);
            });
        });
    })();

    // Tray clock
    function updateTrayClock() {
        const el = document.getElementById('tray-clock');
        if (!el) return;
        const d = new Date();
        el.textContent = d.toLocaleTimeString();
    }
    setInterval(updateTrayClock, 1000);
    updateTrayClock();

    // Keep taskbar buttons in sync when windows open/close
    const observer = new MutationObserver((mutations) => {
        // keep taskbar buttons updated
        refreshTaskbarButtons();
        // when a window/dialogue loses the 'hidden' class, trigger opening animation
        mutations.forEach(m => {
            try {
                const target = m.target;
                if (!target || !target.classList) return;
                // if class attribute changed
                if (m.attributeName === 'class') {
                    const wasHidden = m.oldValue && m.oldValue.includes('hidden');
                    const isHidden = target.classList.contains('hidden');
                    if (wasHidden && !isHidden) {
                        // newly shown - add transient opening class
                        target.classList.add('opening');
                        setTimeout(() => { try { target.classList.remove('opening'); } catch(e) {} }, 250);
                    }
                }
            } catch (e) { /* non-fatal */ }
        });
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'], attributeOldValue: true });

    // build initial desktop and taskbar state
    buildDesktopIcons();
    refreshTaskbarButtons();
});
