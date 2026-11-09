# PostStream

![PostStream: typing a post into a plain text box while a character counter fills in, the post showing up at the top of the feed under an IRC-style log line, replying to someone with "agree, because it is always the third one" picked from a list, scrolling past posts colored by author, then the about page laid out like a man page](.github/readme/2026-11-recording.gif)

PostStream is a social network with the numbers taken out. There are no like
counts, no follower counts and no trending topics, so you can't see how popular
anyone is. You don't write replies, you pick one: agree, disagree, tell me more,
thank you for sharing, or brilliant.

[Try it at poststream.joekarlsson.com](https://poststream.joekarlsson.com) ·
[Read the full statement](https://www.joekarlsson.com/work/poststream/)

## Quick start

[Docker](https://docs.docker.com/get-docker/), or Node.js 22+ and PostgreSQL.

```bash
git clone https://github.com/JoeKarlsson/post-stream.git
cd post-stream
docker compose up --build    # production build, migrated and seeded, at http://localhost:3002
```

For development with hot reload:

```bash
npm install
docker compose up -d postgres        # or point server/config/config.js at your own Postgres
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
npm run db:migrate
npm run db:seed
npm run dev                          # app at http://localhost:3000, API at :3001
```

The seeders create `john@example.com`, `jane@example.com` and
`joe@example.com`, all with the password `password123`.

## Development

These need the dev database, migrated and seeded.

```bash
npm test             # API and unit tests (test:coverage adds a report)
npm run test:e2e     # Playwright on Chrome, iPhone and Pixel, with axe; starts npm run dev if needed
npm run test:visual  # screenshot tests in the pinned Playwright Docker image; add -- --update-snapshots after a design change
npm run lint
npm run type-check
```

| Path | What's in it |
| --- | --- |
| `app/` | The React app |
| `app/demo/` | The in-browser stand-in for the API used by the static demo |
| `server/` | The Express API: routes, Sequelize models, migrations and seeders |
| `shared/contextualResponses.mjs` | The reply kinds ("agree, because...") used by both sides |

`npm start` serves the API and the built front end in production; it reads
`NODE_ENV`, `PORT`, `DATABASE_URL` and `JWT_SECRET` (see `env.example`).
`npm run build:demo` builds the static demo into `dist-demo/`. CI runs every
check, including Lighthouse, on each push and deploys the demo to GitHub Pages
from `master`.

## Credits

Built by Ray Farias, Jacoby Young and Joe Karlsson. Inspired by
[Little Voices](http://www.littlevoicesapp.com) and
[Rainbow Stream](http://www.rainbowstream.org).

## License

MIT. See [LICENSE](LICENSE).
