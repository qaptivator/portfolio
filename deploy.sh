#!/usr/bin/env bash
git push origin main
git checkout prod
git merge main
git push origin prod
git checkout main
