# Lipeaks FC Games

🎮 Lipeaks FC Games is a web-based platform for playing classic FC/NES games online, built with Vue 3 and Vite. It leverages EmulatorJS to provide a smooth, in-browser emulation experience.

## ✨ Features

-   **Game Library**: Browse games by categories such as Action, RPG, Sports, and more.
-   **Instant Play**: Play classic FC/NES games directly in your browser with no installation required.
-   **Search Functionality**: Quickly find your favorite games using the search feature.
-   **Multi-language Support**: Fully localized interface supporting English, Chinese, Japanese, and Arabic.
-   **Responsive Design**: Enjoy a seamless gaming experience on both desktop and mobile devices.
-   **Modern Tech Stack**: Built with the latest web technologies including Vue 3, Vite, and Pinia for a fast and reliable experience.

## 🛠️ Tech Stack

-   **Frontend**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [Vue Router](https://router.vuejs.org/)
-   **State Management**: [Pinia](https://pinia.vuejs.org/)
-   **Internationalization**: [Vue I18n](https://vue-i18n.intlify.dev/)
-   **Emulator**: [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16.0 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/fx0883/lipeaks_fc_games.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd lipeaks_fc_games
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```

The optimized static files will be generated in the `dist/` directory.

## 📂 Project Structure

The project follows a standard Vue 3 application structure:

```
lipeaks_fc_games/
├── public/              # Static assets, including EmulatorJS and game data
├── src/
│   ├── adapters/        # Adapters for third-party services (e.g., EmulatorJS)
│   ├── assets/          # Static assets like images and fonts
│   ├── components/      # Reusable Vue components (Header, Footer, Emulator)
│   ├── i18n/            # Internationalization locales and configuration
│   ├── router/          # Vue Router configuration
│   ├── services/        # Business logic and services
│   ├── stores/          # Pinia state management stores
│   ├── views/           # Page-level components
│   ├── App.vue          # Root Vue component
│   └── main.js          # Application entry point
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 📄 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgements

-   This project is powered by [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS), which makes in-browser emulation possible.
-   Game ROMs and cover images are sourced from the internet and are the property of their respective owners.
