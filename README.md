# Learn League

A modern web application for learning League of Legends champions. Explore champion abilities, playstyles, strengths, weaknesses, and more.

https://devinvisible.github.io/LearnLeague/

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

You can verify your installation by running:

```bash
node --version
npm --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LearnLeague
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Sync Champion Data

Before running the development server, you need to download champion data and assets from Riot's Data Dragon API:

```bash
npm run sync:ddragon
```

This script will:
- Fetch the latest Data Dragon version
- Download champion data (names, abilities, etc.)
- Download champion icons, loading art, and ability icons
- Store everything locally in `public/assets/`

**Note:** This step may take a few minutes as it downloads assets for all champions (~50-100MB).

### 4. Build Champion Data

After syncing Data Dragon, build the application's champion data file:

```bash
npm run build:app-data
```

This generates `public/app-data/champions.json` by merging Data Dragon data with manual champion content.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

- **`npm run dev`** - Start the development server with hot module replacement
- **`npm run build`** - Build the application for production (outputs to `dist/`)
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run sync:ddragon`** - Download/update champion data and assets from Data Dragon
- **`npm run build:app-data`** - Generate `public/app-data/champions.json` from Data Dragon and manual content

## License

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! When contributing:

1. Make sure your code follows the existing style
2. Run `npm run lint` to check for linting errors
3. Test your changes locally with `npm run dev`
4. Ensure the production build works: `npm run build`

## Acknowledgments

- Champion data and assets provided by [Riot Games Data Dragon API](https://developer.riotgames.com/docs/lol#data-dragon)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
