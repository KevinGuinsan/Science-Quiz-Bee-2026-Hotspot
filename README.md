# Science Quiz Bee 2026 — Windows Hotspot Edition

This is a separate copy of [cassandranichieagustin-hub/Science-Quiz-Bee-2026](https://github.com/cassandranichieagustin-hub/Science-Quiz-Bee-2026), based on source commit `44528f7c3065cd0cff2b741edf5e7ce2af46cc40`. The original portal, grade pages, question banks, and player files remain in the repository for reference. The hotspot application is in `hotspot/` and follows the original blue/gray host styling.

**Run this edition on the Windows host laptop. GitHub stores the code; GitHub Pages cannot run its local server. Do not open the legacy root HTML pages to run a hotspot quiz.**

## Start on Windows

1. Download this repository using **Code → Download ZIP** and extract it on the host laptop. Install [Node.js 22 or newer](https://nodejs.org/) once, before going offline. There is no `npm install` step and no runtime CDN, cloud signaling service, or internet dependency.
2. Enable **Settings → Network & internet → Mobile hotspot**. Note the network name and password. Choose Wi-Fi sharing, and turn off the hotspot's power-saving/automatic shutoff option if available. Check its connected-device limit before planning the session.
3. Establish that the network has **no internet access** using the checks below. A hotspot is not automatically offline.
4. Double-click **START-HOTSPOT.cmd**. Select the **hotspot adapter**, not the office Wi-Fi, Ethernet, or VPN adapter. The usual Windows hotspot address is `192.168.137.1`, but select the actual address shown on your laptop. No Windows network or firewall settings are changed by the launcher.
5. If Windows prompts for network access, allow the Node.js server on the intended private hotspot network, subject to your organization's policy. Keep the firewall enabled. If policy blocks it, ask IT for access to TCP port 8080 on that adapter only.
6. Open the **HOST ONLY** link printed in the launcher, on the laptop. It begins with `http://127.0.0.1:8080/host.html#...`. Keep this host link private; the fragment is a temporary host credential. Leave the launcher window open.
7. Choose Grade 7 Set A or Grade 11 Set A, B, or C and create a session. Enter the hotspot's existing SSID and password in the host page to generate a **Wi-Fi QR**. These details only generate the QR in the page; they do not configure Windows and are not saved to the server or repository.
8. Players scan **QR 1** to join Wi-Fi, then scan **QR 2** to open the local quiz. They can also join Wi-Fi manually and type the displayed address. A single standard QR cannot reliably both configure Wi-Fi and launch a web page, so the two steps are explicit. Keep the Wi-Fi QR/password display within the room.
9. Players enter their names/sections. Start the timer when ready. Starting a question closes new joining. Reopen joining between rounds if required. Submitted answers are final; players who disconnect can reopen the same page in the same browser and resume.
10. At time-up, answers close automatically. Click **Reveal answer & score** to grade and update everyone's leaderboard. Select the next question. Replaying a question replaces its previous scores when the new answers are revealed.
11. Finish the quiz and export the CSV. Stop the launcher with Ctrl+C when finished.

## Make the network offline — required room check

[Microsoft's Mobile hotspot feature is designed to share an internet connection](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-your-windows-device-as-a-mobile-hotspot). Simply turning it on does **not** prevent internet browsing.

- The laptop's internet uplink must not be forwarded to players. With some adapters, you can enable the hotspot and disconnect the upstream internet connection while keeping the hotspot active. Test this on the actual Windows laptop; some Windows/driver configurations stop the hotspot without an uplink.
- On a test player device, disable mobile data (or use airplane mode and turn Wi-Fi back on), join the hotspot, verify the quiz opens, and verify a **new, uncached** internet page fails to load. Keep “No internet” Wi-Fi connected when prompted.
- Repeat with all intended devices connected. Recheck if the laptop reconnects to office Wi-Fi, Ethernet, a VPN, or another internet connection.
- If your Windows setup cannot keep the hotspot active offline, use an isolated Wi-Fi access point/router with its WAN unplugged, with the laptop and players on that network. Select the laptop's address on that isolated network when launching. This is a hardware/network limitation, not something a webpage can fix.

The server listens only on the selected IPv4 adapter plus a separate localhost host endpoint. LAN clients must be in that adapter's subnet. There is no internet relay, port forwarding, automatic router setup, or online fallback. Do not forward port 8080 or tunnel it to the internet.

**This reduces access to online material; it does not make personal devices cheat-proof.** A website cannot disable mobile data, switching Wi-Fi, other apps, downloaded notes, screenshots, or another device. Proctor the room and require mobile data off. Question banks are public in the source repository, so students with previously downloaded copies could still consult them.

## Scoring, reconnecting and saving

- The laptop validates timing and scores. Player requests cannot fetch future questions, answer keys, the source question files, host controls, or the saved session file through the local server.
- Players see the current question and its options before the timer starts, with answer controls disabled. Controls become selectable only while the timer is running. The correct answer is sent only after reveal.
- The server accepts one final answer per player per question attempt and rejects stale, duplicate, invalid, paused, and late submissions. Identification answers ignore capitalization and surrounding whitespace, but otherwise must match the source answer.
- Scores use each question's existing points. Ties share a rank. A replay replaces that question's old scores instead of adding them twice.
- The active session is saved in `hotspot/data/current.json`. Creating a new session also archives the previous one in `hotspot/data/`. This folder is gitignored. It contains participant names and reconnect credentials: keep it on the host laptop and do not publish it.
- After a server restart, the saved session loads again. A timer that was running pauses at its remaining time (or is closed if its deadline has passed). Open the new host link printed by the launcher. Players reconnect using the same browser and hotspot address.
- If you change the host IP, browser, device, or clear browser storage, the saved player reconnect key may not be available. Use the same browser and address throughout an event. Avoid private browsing.
- The host UI warns if disk saving fails. Export CSV before closing. CSV is a results report, not a restore file.
- Server shutdown/restart and changing sessions require the host. Students cannot control the quiz. Run only one host control tab to avoid conflicting operator actions.

## Development and verification

```sh
npm test
node hotspot/server.mjs --bind=192.168.137.1
```

The optional `--bind` address must be present on a private network adapter on the laptop. Without it, the launcher prompts for the adapter. It never assumes the office/VPN interface is the hotspot.

Tests cover server-authoritative scoring, hidden answers, late/duplicate/stale submission rejection, lobby locking, replay corrections, subnet filtering, HTTP authorization, restricted source files, CSV export, restart/reconnection, and offline asset loading. The HTTP tests use two loopback listeners; real hotspot connectivity, Windows firewall policy, QR scanning on your phones, device capacity, and absence of internet must still be checked on the event hardware.

`hotspot/banks.json` is a server-only snapshot of the original question banks. To regenerate after deliberately changing the original banks, run `node hotspot/extract-banks.mjs`.

QR generation uses the bundled `qrcode-generator` 1.4.4 by Kazuhiko Arase (MIT); its copyright/license headers and package documentation are retained under `hotspot/vendor/package/`.
