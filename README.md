# Tauri

A web application to manage projects, teams and grades for the Projet Génie Logiciel course.

Tauri lets the project leader import students, build balanced teams, and run the project sprint by sprint, while supervisors, coaches and students use it to review team line-ups, flag problems and enter or consult grades. It was developed by students at ESEO.

## Table of contents

- [Tauri](#tauri)
	- [Table of contents](#table-of-contents)
	- [How it works](#how-it-works)
	- [Tech stack](#tech-stack)
	- [Repository structure](#repository-structure)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
	- [Configuration](#configuration)
		- [Backend (`backend/src/main/resources/.env`)](#backend-backendsrcmainresourcesenv)
		- [Frontend (`frontend/.env`)](#frontend-frontendenv)
	- [Running locally](#running-locally)
	- [Useful scripts](#useful-scripts)
	- [API](#api)
	- [Tests and quality](#tests-and-quality)
	- [Deployment](#deployment)
	- [License](#license)

## How it works

1. **Login**: the user authenticates with an email and a password, checked against the database or an LDAP directory. The backend returns a JWT used on every following request.
2. **Roles and permissions**: each user has one or more roles (option leader, project leader, supervisor, coach, student). Roles carry permissions that control which resources can be read or modified.
3. **Student import**: the project leader imports the student list from a CSV file, then sets the number of teams and the male/female ratio.
4. **Team composition**: the project is in the `COMPOSING`, `PREPUBLISHED` or `PUBLISHED` phase. Supervisors and students flag problems in the line-ups and validate proposed changes.
5. **Sprints and grading**: the project is split into sprints. Grade types, grade scales, bonuses and feedback are entered per team and per student.
6. **Presentations and export**: the presentation order of the teams is managed, and grades and students can be downloaded.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Vue 3, Vite, TypeScript, Vue Router, TanStack Query and Table, Tailwind CSS 3, Radix Vue, VeeValidate, Zod, Vue Draggable, KaTeX |
| Backend | Java 17, Spring Boot 3.2, Spring Web, Spring Security (JWT, LDAP), Spring Data JPA, Hibernate, springdoc OpenAPI (Swagger UI), OpenCSV, Lombok |
| Data | MySQL or MariaDB |
| Tooling | Gradle 8.4, pnpm, ESLint, Vitest, JUnit 5, Selenium, JaCoCo, SonarQube |
| Deployment | GitLab CI, Tomcat (WAR), Docker (Selenium test image) |

## Repository structure

```
.
├── backend/                    Spring Boot API
│   └── src/main/java/fr/eseo/tauri/
│       ├── config/             Application configuration
│       ├── controller/         REST controllers
│       ├── exception/          Exceptions
│       ├── model/              JPA entities and enumerations
│       ├── repository/         Spring Data repositories
│       ├── security/           JWT and authentication
│       ├── seeder/             Initial data
│       ├── service/            Business logic
│       └── util/               Helpers and validation
├── frontend/                   Vue application
│   └── src/
│       ├── components/         atoms, molecules, organisms, templates, pages, ui
│       ├── factories/          Test data factories
│       ├── router/             Routes
│       ├── services/           API calls, one folder per resource
│       ├── types/              Zod schemas and types
│       └── utils/              Helpers
├── docker/                     Image used for Selenium tests in the CI
├── docs/                       Specifications, UML and database documentation
├── design/                     Logos and graphic charter
└── .gitlab-ci.yml              CI/CD pipeline
```

The frontend follows an atomic design layout. Each API resource has its own service folder with its tests next to it. Backend classes are named after their resource, for example `TeamController`, `TeamService` and `TeamRepository`. The frontend has its own [README](frontend/README.md) explaining how to add a feature.

## Prerequisites

- [JDK](https://adoptium.net/) 17
- [Node.js](https://nodejs.org/) 20 (matches the `@types/node` and `@tsconfig/node20` versions)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- MariaDB or MySQL, listening on port 3306
  - the database `tauri` is created on startup if it does not exist
- An LDAP server, only if `app.log.with.ldap` is set to `true`

## Installation

```bash
git clone <repository-url>
cd tauri-projet-gl
```

```bash
cd frontend
pnpm install
```

The backend dependencies are downloaded by the Gradle wrapper on first run.

## Configuration

Both applications read their settings from a `.env` file that is not versioned.

### Backend (`backend/src/main/resources/.env`)

The repository does not ship a `.env.example` for the backend. Create the file with these variables:

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_USERNAME` | Database user | `root` |
| `DATABASE_PASSWORD` | Database password | |
| `LDAP_PASSWORD` | Password of the LDAP admin account | |

Other settings are in `backend/src/main/resources/application.properties`, such as `spring.datasource.url` (default `jdbc:mysql://localhost:3306/tauri`), `server.port` (`8882`) and `cors.allowed.origins` (`http://localhost:5173`).

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_TAURI_API_URL` | Base URL of the backend API | `http://localhost:8882/api/` |
| `VITE_CRYPT_KEY` | Key used by the frontend to encrypt data | |

## Running locally

Start the database, then the backend and the frontend in two terminals.

```bash
cd backend
./gradlew bootRun
```

```bash
cd frontend
pnpm dev
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:8882>
- Swagger UI: <http://localhost:8882/api/swagger>

The backend can also be started from IntelliJ: import the Gradle project with JDK 17, then run `Tasks > application > bootRun`. In the frontend, enable ESLint automatic configuration and `Run eslint --fix on save` in the IDE settings.

`spring.jpa.hibernate.ddl-auto` is set to `create`, so the schema is recreated at every backend start.

## Useful scripts

| Command | Effect |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (in `frontend`) |
| `pnpm build` | Type-check and build the frontend |
| `pnpm build-only:dev` | Build the frontend in `serverdev` mode |
| `pnpm build-only:prod` | Build the frontend in `serverprod` mode |
| `pnpm type-check` | Run `vue-tsc` |
| `pnpm lint` / `pnpm lint:fix` | Lint the frontend, with or without auto-fix |
| `pnpm test` | Run the frontend tests once |
| `pnpm test:watch` | Run the frontend tests in watch mode |
| `pnpm test:coverage` | Run the frontend tests with coverage |
| `./gradlew bootRun` | Start the backend (in `backend`) |
| `./gradlew build` | Build the backend WAR |
| `./gradlew test` | Run the backend unit tests |
| `./gradlew seleniumTest` | Run the Selenium tests |

## API

The backend exposes a REST API under `/api`, documented with springdoc: OpenAPI JSON at `/api/docs` and Swagger UI at `/api/swagger`. Most resources follow the same pattern (`GET /`, `GET /{id}`, `POST /`, `PATCH /{id}`, `DELETE /{id}`). Routes are secured by JWT and by the user's permissions.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Log in and get a token |
| `POST` | `/api/auth/logon` | Log in with the LDAP directory |
| `POST` | `/api/auth/logout` | Log out |
| `*` | `/api/users` | Users, their roles, permissions, team and notifications |
| `*` | `/api/roles`, `/api/permissions` | Roles and permissions |
| `*` | `/api/students` | Students, with CSV import (`POST /upload`) and export (`GET /download`) |
| `*` | `/api/teams` | Teams, students, averages, feedback and presentation order |
| `*` | `/api/projects` | Projects, including the current one (`/actual`) |
| `*` | `/api/sprints` | Sprints, including the current one (`/current`) |
| `*` | `/api/grades`, `/api/grade-types` | Grades, grade types and grade scale files |
| `*` | `/api/bonuses`, `/api/bonuses/{bonusId}/validation` | Bonuses and their validation |
| `*` | `/api/flags`, `/api/flags/{flagId}/validation` | Flags on line-ups and their validation |
| `*` | `/api/comments`, `/api/notifications`, `/api/presentationOrders` | Comments, notifications, presentation order |

`*` means several methods are available on the resource.

## Tests and quality

```bash
cd backend
./gradlew test
```

```bash
cd frontend
pnpm test
pnpm lint
pnpm type-check
```

Backend unit tests are in `backend/src/test/java/fr/eseo/tauri/unit`. Selenium tests are excluded from `./gradlew test` and run with `./gradlew seleniumTest`, against a server given by `-DseleniumServerUrl=<url> -DseleniumOptions=on`. In IntelliJ, comment the `exclude "**/selenium/**"` line of the `test` block in `backend/build.gradle` to run them. Frontend tests use Vitest. JaCoCo coverage is sent to SonarQube by the pipeline.

## Deployment

The pipeline in [`.gitlab-ci.yml`](.gitlab-ci.yml) has five stages:

- `build-frontend`: build the frontend (`dev` branch in `serverdev` mode, `main` branch in `serverprod` mode)
- `build-backend`: copy the frontend build into the backend resources and build the WAR
- `sonar`: run the unit tests and send the analysis to SonarQube
- `deploy-server`: copy `tauri.war` over SSH to the Tomcat `webapps` folder of the dev or prod server
- `selenium`: run the Selenium tests against the deployed server

CI variables (database credentials, SonarQube, server addresses and SSH keys) are set in the GitLab project settings. Server preparation is documented in the OpenProject wiki of the team, section `Serveur`. The Selenium image is described in [`docker/Dockerfile`](docker/Dockerfile).

## License

This project is licensed under the [MIT License](LICENSE).
