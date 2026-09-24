---
name: GitHub push authentication
description: GitHub CLI access can remain valid while Git HTTPS push credentials are not configured.
---

GitHub CLI authentication and Git's HTTPS credential helper are independent in this workspace. A valid CLI session does not guarantee that Git pushes authenticate.

**Why:** After merged task work, the CLI could reach GitHub while a Git push failed with an invalid credential because Git no longer had a credential helper configured. Reconnecting the helper allowed a normal fast-forward push.

**How to apply:** Before troubleshooting repository permissions or attempting an alternate transfer, check CLI access and Git's credential-helper configuration separately. If CLI access is healthy but Git's helper is absent, configure Git to use the authenticated CLI, then retry the push and verify the remote ref.