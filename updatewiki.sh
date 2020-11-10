#!/bin/bash

git checkout master
git submodule update --remote
git add src/wiki
git commit -m "Update wiki"
git push
