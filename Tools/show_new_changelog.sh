#!/bin/bash

OLD_VERS=`git tag | head -1`
git log $OLD_VERS... --pretty=format:'%s' | grep ^-
