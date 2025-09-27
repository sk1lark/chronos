document.addEventListener('DOMContentLoaded', () => {
    const terminalEl = document.getElementById('terminal');
    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('input');

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
            outputEl.innerHTML += `<span class="prompt">C:\\CHRONOS>&nbsp;</span>${cmdLine}<br>`;
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
                        outputEl.innerHTML += result + '<br>';
                    }
                    stopContinueBlink();
                }
            } else {
                outputEl.innerHTML += `Unknown command: ${cmd}<br>`;
            }
        }
        terminalEl.scrollTop = terminalEl.scrollHeight;
        // ensure scroll after DOM updates/animations
        setTimeout(() => { terminalEl.scrollTop = terminalEl.scrollHeight; }, 50);
    };

    function animateOutput(text) {
        // typewriter-style output for small lines (used by ls reveals).
        // Use a span with textContent so incremental characters are appended
        // as plain text (no partial HTML). Append a real <br> after animation.
        const span = document.createElement('span');
        outputEl.appendChild(span);
        let i = 0;
        function step() {
            if (i < text.length) {
                // append as text to avoid creating broken HTML tags while typing
                span.textContent += text.charAt(i);
                i++;
                terminalEl.scrollTop = terminalEl.scrollHeight;
                setTimeout(step, 12);
            } else {
                // finish with a proper line break element
                const br = document.createElement('br');
                outputEl.appendChild(br);
            }
        }
        step();
    }

    // --- Event Listeners ---
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const continuePromptEl = document.getElementById('dialogue-continue-prompt');
            if (isDialogueActive) {
                // If still typing, finish the line. If already finished, advance.
                if (continuePromptEl && continuePromptEl.classList.contains('hidden')) {
                    finishDialogueLine();
                } else {
                    stopContinueBlink();
                    showNextDialogue();
                }
                e.preventDefault();
                return;
            }

            const command = inputEl.value;
            processCommand(command);
            inputEl.value = '';
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
        // if the click is inside any floating window or the dialogue box, don't steal focus
        if (target === inputEl) return; // clicking the terminal input itself
        if (target.closest && (target.closest('.window') || target.closest('#dialogue-box'))) return;
        // otherwise focus the terminal input
        inputEl.focus();
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
        if (titleEl) titleEl.textContent = `Internet Explorer - ${url}`;
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
        if (titleEl) titleEl.textContent = `Internet Explorer - ${rec.url}`;
        document.getElementById('browser-window').classList.remove('hidden');
        browserHistoryIndex = idx;
    }

    document.getElementById('browser-back-btn').addEventListener('click', () => {
        if (browserHistoryIndex > 0) {
            showBrowserFromHistory(browserHistoryIndex - 1);
        }
    });
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
        const handle = winEl.querySelector('.title-bar') || winEl.querySelector('.dialogue-title-bar') || winEl.querySelector('.title') || winEl.querySelector('.dialogue-title');
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
    ['terminal-window','aim-window','browser-window','mediaplayer-window','imageviewer-window','alert-window','dialogue-box','explorer-window','notepad-window'].forEach(id => {
        const el = document.getElementById(id);
        if (el) makeDraggable(el);
    });

    // Restore saved window positions if available
    function restoreWindowPositions() {
        ['aim-window','browser-window','mediaplayer-window','imageviewer-window','alert-window','dialogue-box','explorer-window','notepad-window'].forEach(id => {
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

    // Render a lore entry into the browser window
    window.showLore = function(key) {
        const entry = lore[key];
        if (!entry) {
            window.showAlert(`File not found: ${key}`);
            return;
        }
        // special-case: desktop sticky note shown directly on desktop
        if (key === 'desktop_diary') {
            // remove any existing sticky
            const old = document.querySelector('.desktop-sticky');
            if (old) old.remove();
            const sticky = document.createElement('div');
            sticky.className = 'desktop-sticky';
            sticky.innerHTML = `<div class="sticky-title">Post-it</div><div class="sticky-body">${escapeHtml(typeof entry === 'string' ? entry : (entry.content || entry).toString())}</div>`;
            // clicking the sticky will dismiss it
            sticky.addEventListener('click', () => { sticky.remove(); });
            document.getElementById('desktop').appendChild(sticky);
            // trigger dialogue as normal
            setTimeout(() => { try { window.triggerDialogue && window.triggerDialogue(key); } catch (e) {} }, 200);
            return;
        }
        let html = `<div class="lore-entry"><h2>${escapeHtml(key)}</h2>`;
        if (typeof entry === 'string') {
            html += `<pre>${escapeHtml(entry)}</pre>`;
        } else if (entry.type === 'audio') {
            html += `<p><strong>${escapeHtml(entry.title || key)}</strong></p>`;
            html += `<audio controls src="${escapeHtml(entry.src)}"></audio>`;
        } else if (entry.type === 'image') {
            html += `<p><strong>${escapeHtml(entry.title || key)}</strong></p>`;
            html += `<img src="${escapeHtml(entry.src)}" alt="${escapeHtml(entry.title || key)}" style="max-width:100%">`;
        } else if (entry.type === 'alert') {
            html += `<p>${escapeHtml(entry.message)}</p>`;
        } else {
            // generic object -> stringify content if present
            const body = entry.content || entry;
            html += `<pre>${escapeHtml(body.toString())}</pre>`;
        }
        html += `</div>`;
        window.showBrowser(key, html);
        // trigger dialogue for reading this file
        setTimeout(() => { try { window.triggerDialogue && window.triggerDialogue(key); } catch (e) {} }, 200);
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
                    win.style.left = '8px'; win.style.top = '8px'; win.style.width = `calc(100% - 16px)`; win.style.height = `calc(100% - 16px)`; win.style.zIndex = ++_topZ;
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
            const cls = className ? ` class="${className}"` : '';
            outputEl.innerHTML += `<p${cls}>${text}</p>`;
            terminalEl.scrollTop = terminalEl.scrollHeight;
        },
        clear: () => {
            outputEl.innerHTML = '';
            terminalEl.scrollTop = terminalEl.scrollHeight;
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
            { text: '<br>', delay: 2200 },
            { text: '<span class="prompt">C:\\CHRONOS>&nbsp;</span>', delay: 2500, noLineBreak: true }
        ];

        let delay = 0;
        bootSequence.forEach(item => {
            delay += item.delay;
            setTimeout(() => {
                outputEl.innerHTML += item.text + (item.noLineBreak ? '' : '<br>');
                terminalEl.scrollTop = terminalEl.scrollHeight;
            }, item.delay);
        });

        setTimeout(() => {
            triggerDialogue('boot');
        }, 2800);

        // Re-add classic Windows 95 boot block after ChronOS boot finishes.
        // These use the older `term.print` helper so they match earlier backups.
        const windows95Lines = [
            'Microsoft Windows 95 [Version 4.00.950]',
            'Copyright (C) Microsoft Corp 1981-1995.',
            '',
            'C:\\>dir',
            ' Volume in drive C has no label.',
            ' Volume Serial Number is 1A2B-3C4D',
            '',
            ' Directory of C:\\',
            '',
            'WINDOWS      <DIR>        09-25-95   2:47p',
            'TEMP         <DIR>        09-25-95   8:15a',
            'CHRONOS      <DIR>        ??-??-??   ?:??p',
            'AUTOEXEC BAT         328  09-25-95   2:47p',
            'CONFIG   SYS         198  09-25-95   2:47p',
            '        2 file(s)        526 bytes',
            '        3 dir(s)  1,234,567,890 bytes free',
            '',
            'C:\\>cd chronos',
            'Access denied. Administrator privileges required.',
            ''
        ];

        // Start these a bit after the ChronOS boot/dialogue to avoid collision.
        let start = 3200;
        windows95Lines.forEach((line, idx) => {
            setTimeout(() => {
                term.print(line);
            }, start + idx * 140);
        });

        // final prompt after the windows95 block
        setTimeout(() => {
            term.print('C:\\>');
            // After the classic listing, validate that every lore entry has dialogue
            setTimeout(validateLoreDialogue, 200);
        }, start + windows95Lines.length * 140 + 100);
    }

    boot();

    // Build a simple Win95-style homepage and open the browser
    function buildHomepage() {
        // q00ql3 homepage: a simple search box and some quick links
        const quickLinks = ['log_734','mem_fragment_01','file_a_113','file_c_enc.log','chronos_registry'];
        const list = quickLinks.map(k => `<li><a href="#" class="lore-link" data-key="${k}">${k}</a></li>`).join('');
        const homepage = `
            <div class="ie-homepage">
                <h2>q00ql3</h2>

                <div class="ie-homepage-tiles" style="display:flex;gap:12px;margin:10px 0;">
                    <button id="homepage-back-btn" class="homepage-tile"><img src="All [Without duplicates]/Arrow (up).ico" alt="Back"><div>Back</div></button>
                    <button id="homepage-forward-btn" class="homepage-tile"><img src="All [Without duplicates]/Arrow (down).ico" alt="Forward"><div>Forward</div></button>
                    <button id="homepage-stop-btn" class="homepage-tile"><img src="All [Without duplicates]/Cross.ico" alt="Stop"><div>Stop</div></button>
                    <button id="homepage-refresh-btn" class="homepage-tile"><img src="All [Without duplicates]/Discover.ico" alt="Refresh"><div>Refresh</div></button>
                    <button id="homepage-home-btn" class="homepage-tile"><img src="All [Without duplicates]/Windows 95 logo.ico" alt="Home"><div>Home</div></button>
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
            { key: 'broken_shortcut', label: 'Broken Shortcut', icon: 'All [Without duplicates]/Document.ico' }
        ];
        desktop.innerHTML = icons.map(ic => `<div class="desktop-icon" data-key="${escapeHtml(ic.key)}"><img src="${ic.icon}" alt="">${escapeHtml(ic.label)}</div>`).join('');

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
    `;
    document.body.appendChild(startMenu);
    startBtn && startBtn.addEventListener('click', () => { startMenu.classList.toggle('visible'); });
    document.getElementById('start-open-explorer').addEventListener('click', () => { startMenu.classList.remove('visible'); window.openExplorer(); refreshTaskbarButtons(); });
    document.getElementById('start-open-notepad').addEventListener('click', () => { startMenu.classList.remove('visible'); window.openNotepad(); refreshTaskbarButtons(); });
    document.getElementById('start-open-browser').addEventListener('click', () => { startMenu.classList.remove('visible'); buildHomepage(); refreshTaskbarButtons(); });

    // --- Internet Explorer menu-bar dropdowns ---
    (function attachIEMenus(){
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
            'Help': [ { label: 'About Internet Explorer', action: () => { window.showAlert && window.showAlert('Internet Explorer (q00ql3) — ChronOS simulated browser.'); } } ]
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
    const observer = new MutationObserver(() => { refreshTaskbarButtons(); });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

    // build initial desktop and taskbar state
    buildDesktopIcons();
    refreshTaskbarButtons();
});
