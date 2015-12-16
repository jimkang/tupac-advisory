HOMEDIR = $(shell pwd)

stop-docker-machine:
	docker-machine stop dev

start-docker-machine:
	docker-machine start dev

create-docker-machine:
	docker-machine create --driver virtualbox dev

# eval "$(docker-machine env dev)"

build-docker-image:
	docker build -t jkang/tupac .

push-docker-image: build-docker-image
	docker push jkang/tupac

run-docker-image:
	docker run \
		-v $(HOMEDIR)/config:/usr/src/app/config \
		jkang/tupac make run

pushall: push-docker-image
	git push origin master

run:
	node post-tweet.js

test:
	docker run \
		jkang/tupac \
		node tests/advise-tests.js && node tests/build-sentence-tests.js

test-live:
	docker run jkang/tupac node tests/live/fill-phrase-head-tests.js

data/word-syllable.db:
	node setup/build-syllable-database.js

setup: data/word-syllable.db
