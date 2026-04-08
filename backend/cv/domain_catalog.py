from .constants import ROLE_SKILL_CATALOG


def get_role_catalog():
    return ROLE_SKILL_CATALOG


def get_role_names():
    return list(ROLE_SKILL_CATALOG.keys())
