#!/usr/bin/env python3
"""
convert_to_webp.py

Renomme les références .png / .jpg / .jpeg en .webp dans :
    - src/Appv4.jsx  (uniquement)

USAGE
-----
    # 1) Aperçu uniquement (ne modifie rien, juste un rapport) :
    python convert_to_webp.py --dry-run

    # 2) Modifier le code :
    python convert_to_webp.py

Le script NE touche PAS :
    - aux URLs externes (http://, https://, ex: images.unsplash.com)
    - aux fichiers .svg
    - aux chemins déjà en .webp
"""

import argparse
import re
from pathlib import Path

# Extensions qu'on convertit en .webp dans le code
TARGET_EXTENSIONS = ("png", "jpg", "jpeg")

# Regex : capture un chemin de fichier image local se terminant par une des
# extensions ciblées, à l'intérieur de quotes (simples, doubles, ou backticks),
# en ignorant les URLs http(s)://
PATH_PATTERN = re.compile(
    r"""(?P<quote>['"`])                # quote ouvrante
        (?P<path>(?!https?://)          # exclut les URLs externes
            [^'"`]*?\.(?:png|jpg|jpeg)  # chemin se terminant par l'extension cible
        )
        (?P<close>['"`])                # quote fermante
    """,
    re.IGNORECASE | re.VERBOSE,
)


def convert_code_references(text: str):
    """
    Remplace toutes les extensions .png/.jpg/.jpeg trouvées dans des chemins
    de fichiers (entre quotes) par .webp. Retourne (nouveau_texte, liste_changements).
    """
    changements = []

    def repl(match):
        quote = match.group("quote")
        path = match.group("path")
        close = match.group("close")

        new_path = re.sub(r"\.(png|jpg|jpeg)$", ".webp", path, flags=re.IGNORECASE)

        if new_path != path:
            changements.append((path, new_path))

        return f"{quote}{new_path}{close}"

    new_text = PATH_PATTERN.sub(repl, text)
    return new_text, changements


def process_jsx_file(filepath: Path, dry_run: bool):
    if not filepath.exists():
        print(f"  [IGNORÉ] Fichier introuvable : {filepath}")
        return []

    original = filepath.read_text(encoding="utf-8")
    updated, changements = convert_code_references(original)

    if not changements:
        print(f"  [OK] Aucun changement nécessaire dans {filepath.name}")
        return []

    print(f"\n  --- {filepath.name} ({len(changements)} référence(s) trouvée(s)) ---")
    for old, new in changements:
        print(f"    {old}  ->  {new}")

    if not dry_run:
        filepath.write_text(updated, encoding="utf-8")
        print(f"  [ÉCRIT] {filepath} mis à jour.")
    else:
        print(f"  [DRY-RUN] {filepath} non modifié (aperçu seulement).")

    return changements


def main():
    parser = argparse.ArgumentParser(
        description="Convertit les références .png/.jpg/.jpeg en .webp dans Appv4.jsx"
    )
    parser.add_argument(
        "--appv4",
        default="src/Appv4.jsx",
        help="Chemin vers Appv4.jsx (défaut: src/Appv4.jsx)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="N'écrit rien, affiche seulement un aperçu des changements",
    )
    args = parser.parse_args()

    appv4_path = Path(args.appv4)

    print("=== Conversion des références .png/.jpg/.jpeg -> .webp dans Appv4.jsx ===")
    if args.dry_run:
        print("(Mode DRY-RUN : aucun fichier ne sera modifié)\n")

    process_jsx_file(appv4_path, args.dry_run)

    print("\nTerminé.")


if __name__ == "__main__":
    main()