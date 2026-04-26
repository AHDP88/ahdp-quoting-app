# Supplier Import Safety Update

This zip contains only the latest files changed for the supplier import safety update.

## How to apply

1. Open your AHDP quoting app repository folder in GitHub Desktop.
2. Extract this zip somewhere temporary.
3. Copy the extracted `server` and `client` folders into the root of your GitHub Desktop repository folder.
4. When prompted, replace the matching existing files.
5. Confirm GitHub Desktop shows only these files changed:
   - `server/settingsRoutes.ts`
   - `client/src/pages/Settings.tsx`
6. Commit with this message:
   `Make supplier imports safer`
7. Push the branch to origin.

Do not include `node_modules`, `dist`, `package-lock.json`, or unrelated files in the commit.
