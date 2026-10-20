#!/usr/bin/env python3
"""Copie uniquement les fichiers web de 4D Line Concept dans les fichiers Pages."""
import argparse
from pathlib import Path
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Racine du projet 4D Line Concept')
args = parser.parse_args()
source = args.source.resolve()
root = Path(__file__).resolve().parents[1]
destination = root / 'public/4dlinestudio'
assert source != destination and (source / 'index.html').is_file()
destination.mkdir(parents=True, exist_ok=True)
shutil.copyfile(source / 'index.html', destination / 'index.html')
for folder in ['src', 'public']:
    shutil.copytree(source / folder, destination / folder, dirs_exist_ok=True)
print('Site statique synchronisé dans public/4dlinestudio (sans .git, logs, outils ni documents locaux).')
