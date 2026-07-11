import re
from dataclasses import dataclass


@dataclass
class FilterResult:
    is_relevant: bool
    reason: str | None = None


# Palabras que casi siempre aparecen en páginas
_NOISE_KEYWORDS = [
    "all rights reserved",
    "isbn",
    "library of congress",
    "no part of this publication",
    "this page intentionally left blank",
    "printed in the united states",
    "morgan kaufmann",
    "elsevier inc",
]

# Una línea de índice típica: texto seguido de puntos suspensivos o
# espacios y un número al final. Ej: "Chapter 3 Data Preprocessing 83"
_INDEX_LINE_PATTERN = re.compile(r"\.{3,}|\s\d{1,4}$", re.MULTILINE)

MIN_WORD_COUNT = 30  # páginas con menos palabras que esto son sospechosas
INDEX_LINE_RATIO_THRESHOLD = 0.35  # si 35%+ de las líneas parecen de índice


def is_relevant_page(text: str) -> FilterResult:
    """
    Decide si una página vale la pena indexar, usnado 3 heurísticas independientes, cualquiera que falle descarta la página
    """
    word_count = len(text.split())

    # heuristica 1, páginas casi vacías
    if word_count < MIN_WORD_COUNT:
        return FilterResult(is_relevant=False, reason=f"muy poco texto({word_count})")

    # heuristica 2, palabras claves de copyright
    text_lower = text.lower()
    for keyword in _NOISE_KEYWORDS:
        if keyword in text_lower:
            return FilterResult(is_relevant=False, reason=f"contiene keywork de ruido({word_count})")

    # heurística 3: table de contenidos
    # Si una proporción alta de "líneas" (separadas por puntos suspensivos
    # o terminando en número) parece índice, descartamos la página entera.
    lines = text.split(". ")  # proxy
    if lines:
        index_like = sum(1 for line in lines if _INDEX_LINE_PATTERN.search(line))
        ratio = index_like / len(lines)
        if ratio >= INDEX_LINE_RATIO_THRESHOLD:
            return FilterResult(is_relevant=False, reason=f"contiene keywork de ruido({word_count})")

    return FilterResult(is_relevant=True)
