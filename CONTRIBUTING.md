# Contributing to AttestFlow

Thank you for your interest in contributing to AttestFlow!

## Git Workflow
- **Do NOT use `git add .`**: Please review and stage your files explicitly before committing. This ensures clean commit histories and prevents unintended file inclusions.

## Commit Message Standard
We strictly follow Conventional Commits. Your commit messages should be formatted as follows:
`<type>(<scope>): <subject>`

Accepted types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `chore`: Changes to the build process or auxiliary tools
- `test`: Adding missing tests or correcting existing tests

## Monorepo Workflow
This project uses `pnpm` workspaces. When running commands, filter them to the specific package:
- `pnpm --filter @attestflow/sdk build`
- `pnpm --filter @attestflow/web dev`
