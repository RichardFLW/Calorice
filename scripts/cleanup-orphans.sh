# scripts/cleanup-orphans.sh
#!/usr/bin/env bash
# scripts/cleanup-orphans.sh

set -euo pipefail

paths=(
  "components/FoodSearch.tsx"
  "components/FoodSearchResultsBlock.tsx"
  "components/FoodSelectedBlock.tsx"
  "components/SearchResults.tsx"
  "components/SelectedFoodForm.tsx"
  "components/SearchInput.tsx"

  "components/search/FoodSearchResultsBlock.tsx"
  "components/search/FoodSelectedBlock.tsx"
  "components/search/SearchResults.tsx"
  "components/search/SelectedFoodForm.tsx"
  "components/search/SearchInput.tsx"

  "components/dashboard/DashboardHeader.tsx"

  "components/new/actions.ts"
  "components/foods/new/actions.ts"

  "components/foods/create/CaloriesFields.tsx"
  "components/foods/create/MetaFields.tsx"
  "components/foods/create/FieldErrorText.tsx"
  "components/foods/create/ServingFields.tsx"
  "components/foods/create/CaloriesBlock.tsx"

  "components/create/CaloriesFields.tsx"
  "components/create/MetaFields.tsx"
  "components/create/FieldErrorText.tsx"
  "components/create/ServingFields.tsx"
  "components/create/CaloriesBlock.tsx"
  "components/create/MacroField.tsx"
  "components/create/MacroGroup.tsx"
  "components/create/MacrosBlock.tsx"
  "components/create/FoodIdentityFields.tsx"

  "lib/computeCalories.ts"
)

in_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

delete_path() {
  local p="$1"
  if [[ -e "$p" ]]; then
    if in_git_repo; then
      git rm -f "$p"
    else
      rm -f "$p"
      echo "rm -f $p"
    fi
  else
    echo "Skip (not found): $p"
  fi
}

echo "==> Removing orphan duplicates…"
for p in "${paths[@]}"; do
  delete_path "$p"
done

# Nettoyer les dossiers devenus vides (best effort)
prunable_dirs=(
  "components/search"
  "components/create"
  "components/foods/create"
  "components/new"
  "components/foods/new"
  "components/dashboard"
  "lib"
)
for d in "${prunable_dirs[@]}"; do
  if [[ -d "$d" ]]; then
    find "$d" -type d -empty -print -delete || true
  fi
done

echo "==> Done."
echo "Conseil: relance un typecheck pour vérifier que rien d'utile n’a sauté."
echo "Ex: pnpm run typecheck || yarn typecheck || npm run typecheck"
