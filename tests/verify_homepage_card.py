from pathlib import Path


HTML = Path("index.html").read_text(encoding="utf-8")


def assert_contains(snippet: str) -> None:
    assert snippet in HTML, f"missing expected snippet: {snippet}"


def assert_not_contains(snippet: str) -> None:
    assert snippet not in HTML, f"unexpected legacy snippet: {snippet}"


assert_contains('<body class="home-page">')
assert_contains('class="topbar"')
assert_contains('class="card-home"')
assert_contains('class="intro-shell reveal"')
assert_contains('class="meta-grid reveal"')
assert_contains('class="entry-list reveal"')
assert_contains('class="avatar-photo"')
assert_contains('src="public/icon.jpg"')
assert_contains("小红书")
assert HTML.count('class="entry-card"') >= 2, "expected at least 2 entry cards"

assert_not_contains("最新文章")
assert_not_contains("filter-btn")
assert_not_contains(">QY<")
