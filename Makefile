HOMEDIR = $(shell pwd)
GITDIR = /var/repos/tupac-advisory.git

test:
	node tests/advise-tests.js

start: start-tupac-advisory
	psy start -n tupac-advisory -- node tupac-advisory.js

stop:
	psy stop tupac-advisory || echo "Non-zero return code is OK."
	
sync-worktree-to-git:
	git --work-tree=$(HOMEDIR) --git-dir=$(GITDIR) checkout -f

npm-install:
	cd $(HOMEDIR)
	npm install
	npm prune

post-receive: sync-worktree-to-git npm-install stop start

build-rime-db:
	cd node_modules/rime && \
	make build-word-phoneme-map