# scripts/remove-food-create.sh
#!/usr/bin/env bash
# scripts/remove-food-create.sh

set -euo pipefail

paths=(
  # Pages de création d'aliment
  "app/dashboard/foods/new/page.tsx"
  "app/dashboard/foods/new/actions.ts"
  "app/dashboard/foods/new/loader.ts"
  "app/dashboard/foods/new/components/*"

  # API de création d'aliment (si présentes)
  "app/api/foods/create/route.ts"
  "app/api/foods/new/route.ts"

  # Composants/formulaires de création d'aliment
  "components/foods/create/*"
  "components/create/*"

  # Validations/form types spécifiques à la création de Food
  "lib/validations/food.ts"
  "lib/validations/food.schema.ts"
)

in_git_repo() { git rev-parse --is-inside-work-tree >/dev/null 2>&1; }

delete_path() {
  local p="$1"
  shopt -s nullglob
  for f in $p; do
    if [[ -e "$f" ]]; then
      if in_git_repo; then git rm -rf "$f"; else rm -rf "$f"; fi
      echo "Removed: $f"
    else
      echo "Skip (not found): $f"
    fi
  done
}

echo "==> Removing all Food-creation related code…"
for p in "${paths[@]}"; do
  delete_path "$p"
done

# Nettoyer dossiers vides
prunable_dirs=(
  "app/dashboard/foods/new"
  "components/foods/create"
  "components/create"
  "app/api/foods/create"
  "app/api/foods/new"
)
for d in "${prunable_dirs[@]}"; do
  [[ -d "$d" ]] && find "$d" -type d -empty -print -delete || true
done

echo "==> Done."
echo "Conseil: lance un typecheck pour vérifier qu’aucune import résiduelle ne traîne."
echo "Ex: npm run typecheck || pnpm typecheck || yarn typecheck"
