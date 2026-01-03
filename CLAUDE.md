# Claude Project Context

This project uses the **Auto Claude** system to maintain a shared "brain" and automated documentation, working in tandem with the Conductor (Gemini) system.

## Current Focus
- **Integration**: Ensuring Auto Claude and Conductor work seamlessly together.
- **Documentation**: Maintaining high-quality specs and plans in `.auto-claude/specs/`.
- **Automation**: Using `claude-sync.js` to automate documentation updates.
- **Bidirectional Sync**: Automatic synchronization between Auto Claude specs and Conductor tracks.

## Useful Commands
- `./claude.sh sync`: Auto-sync docs with code, refresh Claude's context, and sync with Conductor.
- `./claude.sh sync-conductor`: Sync only Auto Claude specs to Conductor tracks.
- `./claude.sh new-spec`: Start a new specification for a feature.
- `./conductor.sh sync`: Sync using the Gemini system (includes Auto Claude sync).
- `./conductor.sh sync-claude`: Sync only Auto Claude specs to Conductor tracks.

## Directory Structure
- `.auto-claude/`: Primary data directory for Claude (ignored by git, shared via brain).
- `conductor/`: Shared documentation directory (tracked by git).
- `lib/storage.ts`: Core business logic and storage.
- `lib/navigation.ts`: Role-based navigation rules.

## Integration with Conductor

- **Auto Claude** works alongside **Conductor** (Gemini).
- Both systems should be kept in sync through automatic synchronization **triggers**.
- Use `conductor/` for shared documentation (tracked by git) and `.auto-claude/` for Claude-specific insights and planning (ignored by git, shared via brain).

### Synchronization Triggers (Gatilhos)

1. **Commit Trigger**: A Git `pre-commit` hook automatically runs `conductor-sync.js` and `claude-sync.js`.
2. **Manual Trigger**: `./claude.sh sync` or `./conductor.sh sync` synchronizes specs and code.
3. **Spec Trigger**: Creating or updating specs in `.auto-claude/specs/` triggers a need for sync to reflect changes in Conductor tracks.

### Synchronization Flow

1. **Auto Claude** creates specs in `.auto-claude/specs/[feature-name]/`:
   - `implementation_plan.json`: Structured implementation plan
   - `requirements.json`: Feature requirements

2. **Automatic Sync** converts specs to Conductor tracks:
   ```bash
   ./claude.sh sync
   # or
   ./conductor.sh sync
   ```

3. **Conductor Tracks** are created/updated in `conductor/tracks/[feature-name]/plan.md`:
   - Formatted markdown for readability
   - Preserves existing content if track was manually edited

4. **Claude Code as Assistant**: Claude Code can help in the Conductor workflow:
   - Analyze specs and suggest improvements
   - Generate formatted tracks automatically
   - Intelligent synchronization (only syncs when needed)
   - Automatic documentation updates

### Sync Script

The `auto-claude-conductor-sync.js` script handles bidirectional synchronization:
- Converts Auto Claude specs to Conductor tracks
- Preserves manual edits in tracks
- Updates changelog with sync information
- Reads insights from Auto Claude sessions

## Design System
The project follows a modern, tactile design system inspired by **v0 by Vercel**, with enhanced animations and Fun Mode support. See `GEMINI.md` for full design tokens and component patterns.
