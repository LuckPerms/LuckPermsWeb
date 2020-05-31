#!/bin/bash

git submodule update --remote
git add src/wiki
git commit -m "Update wiki"
git push
