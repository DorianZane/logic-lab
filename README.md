# Logic Lab

A playable collection of **30 classic mathematical and logical challenges**, built with Python. Includes four-choice answers, two progressive hints per puzzle, explained solutions, three difficulty levels, and browser-local progress. Works on desktop and mobile, with keyboard-accessible controls.

## Run on your computer

Install Python 3.10 or newer. No third-party packages are needed.

```bash
python app.py
```

Open **http://localhost:8000**. On systems where Python is named `python3`, use `python3 app.py`. Stop with Ctrl+C. To select a different port, run `python app.py --port 8080`.

You can also open the included `dist/index.html` directly for a quick look. Browser storage behavior for local files varies; use the Python server for reliable local play.

## Upload to GitHub and publish

1. Extract this archive. Create an empty GitHub repository named `logic-lab`.
2. Upload the **contents** of the extracted `logic-lab` folder to the repository root, including `.github/workflows/pages.yml`. Use a branch named `main`.
3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
4. Open **Actions → Build and deploy Logic Lab → Run workflow**. Future pushes to `main` also run it automatically.
5. When the deployment succeeds, find the website URL in **Settings → Pages** or the workflow's deployment environment.

GitHub Pages availability depends on repository visibility and your plan. The workflow needs Pages enabled and permission to deploy. For up-to-date details see [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

If using Git instead of the upload interface, run these commands from the extracted project folder after replacing YOUR_USERNAME:

```bash
git init
git add .
git commit -m "Create Logic Lab with 30 puzzles"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/logic-lab.git
git push -u origin main
```

Then enable GitHub Actions as the Pages source and run the workflow as above. A ZIP uploaded as one repository file will not publish the website; extract it first.

## How it works

- `puzzles.py`: the 30 puzzle definitions, correct choices, hints, and explanations.
- `build.py`: validates the puzzle collection and generates `dist/` with Python's standard library.
- `app.py`: builds the site and serves it locally with Python's HTTP server.
- `assets/template.html`, `style.css`, `app.js`: responsive page and browser interaction.
- `tests/test_puzzles.py`: export integrity and independent checks of selected mathematical results.
- `.github/workflows/pages.yml`: runs tests, builds with Python, and deploys static output.
- `dist/`: ready-to-use generated website; rebuild after changing source.

Python owns the content and build process; JavaScript handles interactive play in the browser. No Python process is required on the deployed static website. The local Python server is for development, not an internet-facing production service.

```bash
python build.py
python -m unittest discover -s tests -v
```

The site makes no external asset requests and needs no API keys, database, npm packages, or account system. Progress is stored only in the current browser, under `logic-lab-progress-v1`. Revealing a solution before solving marks that puzzle as “solution viewed”; answering it later does not convert it to independently solved. Hints do not prevent a solved mark. To start a fresh run, clear this site's browser storage. No cross-device sync is provided.

This is a learning game. Answers are included in the static source and are not concealed from someone inspecting the code. It is not suitable for secure examinations.

## The collection

1. The two doors
2. Knights and knaves
3. The mislabeled boxes
4. Three switches
5. Wolf, goat, cabbage
6. The bridge at night
7. The poisoned bottle
8. Nine coins
9. Twelve coins: information limit
10. Monty Hall
11. Two children
12. The birthday threshold
13. The missing dollar
14. The bat and ball
15. The lily pond
16. The climbing snail
17. Two burning ropes
18. The water jugs
19. The hundred lockers
20. The mutilated chessboard
21. The handshake party
22. Socks in the dark
23. The last stone
24. Tower of Hanoi
25. The two-egg building
26. The blue-eyed island
27. The hat line
28. The unexpected ace
29. The hundred prisoners
30. Cheryl's birthday

Classic puzzle ideas are retold here in original wording. Specific rules matter: probability puzzles explicitly state their sampling assumptions, and the twelve-coin question tests the information bound rather than asking for a full weighing strategy.

## Validation

Automated checks cover the 30-record schema, generated JSON and assets, shortest-path solutions for the bridge and river, birthday and prisoner probabilities, locker parity, the egg-drop bound, and Cheryl's knowledge elimination. JavaScript syntax was checked during preparation. Browser visual and end-to-end testing and an actual GitHub deployment have not been performed.
