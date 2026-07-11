import re
from pathlib import Path


def filename_to_collection(filename: str) -> str:
    """
    ChromaDB tiene restricciones en los nombres de colección:
    solo letras, números, guiones y guiones bajos, 3-63 caracteres.
    Esta función convierte cualquier filename a un nombre válido.
    """
    name = Path(filename).stem.lower()
    name = re.sub(r"[^a-z0-9_-]", "_", name)
    name = re.sub(r"_+", "_", name).strip("_")
    return name[:63] if len(name) >= 3 else f"pdf_{name}"
