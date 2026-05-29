# DnD Starter Helper

A lightweight static Vue app for beginner-friendly D&D one-shot character selection. Players pick a class, an adventuring drive, something they care about, a flaw, enter their name, optionally answer one question, and then save or send the result.

## Player Flow

1. Intro
2. Character/Class
3. Adventuring Drive
4. Someone or Something You Care About
5. Flaw
6. Review, optional question, and save

The app is designed for GitHub Pages, stores in-progress choices in `localStorage`, and works without logins.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Build

```bash
npm run build
```

The site outputs to `dist/` and does not require a runtime server.

## GitHub Pages Deployment

This repo includes [deploy.yml](.github/workflows/deploy.yml).

1. Push the repo to GitHub.
2. In GitHub, enable GitHub Pages with **Build and deployment = GitHub Actions**.
3. Optionally set repository variables:
   - `VITE_BASE_PATH`
   - `VITE_SUBMISSION_ENDPOINT`

For a repository named `dnd-character-picker`, set:

```env
VITE_BASE_PATH=/dnd-character-picker/
```

If you do not set `VITE_BASE_PATH`, the workflow defaults it to `/<repo-name>/`.

## Environment Variables

Copy `.env.example` to `.env` if you want local overrides.

```env
VITE_BASE_PATH=/
VITE_SUBMISSION_ENDPOINT=
```

- `VITE_BASE_PATH` controls the Vite base path for GitHub Pages.
- `VITE_SUBMISSION_ENDPOINT` is optional. If set, the app will `POST` the saved JSON to that URL.

## Save Behavior

The app always saves a local draft in `localStorage`.

If `VITE_SUBMISSION_ENDPOINT` is configured:

- the app tries to `POST` the submission JSON
- a success state is shown if the request succeeds
- if the request fails, the player still gets download and copy fallbacks

If `VITE_SUBMISSION_ENDPOINT` is not configured:

- the app shows a clear fallback message
- the player can download the JSON file
- the player can copy the JSON to the clipboard
- they can send that JSON to the DM manually

## Google Sheets Saving

This repo includes [apps_script/Code.gs](apps_script/Code.gs) for an anonymous Google Apps Script endpoint.

1. Create a new Google Sheet.
2. Open **Extensions > Apps Script**.
3. Replace the default file contents with `apps_script/Code.gs`.
4. Save the project.
5. Click **Deploy > New deployment**.
6. Choose **Web app**.
7. Set access to **Anyone**.
8. Deploy and copy the Web App URL.
9. Set that URL as `VITE_SUBMISSION_ENDPOINT` in `.env` or GitHub repository variables.

The script appends these columns:

- `timestamp`
- `playerName`
- `characterTitle`
- `characterClassName`
- `adventuringDriveTitle`
- `careAboutTitle`
- `flawTitle`
- `optionalAnswer`
- `fullJsonPayload`

Do not store secrets in the frontend.

## Content Source And Updates

The original Markdown source lives in [markdown_files](markdown_files/).

- `02_character_class_cards.md`
- `03_adventuring_drive_cards.md`
- `04_someone_or_something_you_care_about_cards.md`
- `05_flaw_cards.md`

The app uses manually normalized data under [src/data](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data):

- [characters.ts](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data/characters.ts)
- [adventuringDrives.ts](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data/adventuringDrives.ts)
- [careAbout.ts](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data/careAbout.ts)
- [flaws.ts](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data/flaws.ts)
- [intro.ts](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/data/intro.ts)

To update card content later:

1. Edit the matching file in `markdown_files/` if you want to preserve the source deck.
2. Copy the wording into the corresponding `src/data/*.ts` file.
3. Keep the IDs stable if you want existing drafts to restore cleanly.

## Character Images

Place class art in `public/assets/characters/`.

The app expects normalized filenames like:

- `barbarian-female-token.png`
- `barbarian-female-avatar.png`
- `barbarian-male-token.png`
- `barbarian-male-avatar.png`

The original asset folder used `Artificier-*` for artificer images. The app normalizes those to `artificer-*` in `public/assets/characters/`.

If an image is missing, the UI falls back to a styled placeholder.

## Theme Basics

Theme styling lives in [src/styles.css](/c:/Users/Bailey/Documents/code-projects/dnd-starter-helper/src/styles.css).

Key customization points:

- `:root` CSS variables for colors and shadows
- serif headline stack via `--serif`
- layout spacing for cards, review, and summary panels

## Result Recovery

If a player downloads a `.json` file instead of sending it through a configured endpoint, you can:

1. open the JSON locally
2. review the selected cards and optional answer
3. paste or import it wherever you track player choices

## Project Structure

```text
.
|-- .env.example
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- apps_script/
|   `-- Code.gs
|-- images/
|-- markdown_files/
|-- public/
|   `-- assets/
|       `-- characters/
|-- src/
|   |-- components/
|   |-- data/
|   |-- utils/
|   |-- App.vue
|   |-- main.ts
|   |-- styles.css
|   `-- types.ts
|-- index.html
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```
