#!/bin/bash

export LANG=en_US.UTF-8 

# Chec for uncommitted changes
git status | grep "nothing to commit, working directory clean" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "There are uncommited changes - commit first!"
  exit 1
fi

# Get old and new Version
OLD_VERS=`git tag | sort -nr | head -1`
NEW_VERS=`echo "$OLD_VERS + 0.1" | bc -q`

# Update CHANGELOG
CHANGELOG=`Tools/show_new_changelog.sh`
echo "Updating Changelog ..."
mv CHANGELOG.md CHANGELOG.bak
echo "#### v$NEW_VERS" > CHANGELOG.md
echo -e "$CHANGELOG" >> CHANGELOG.md
echo "" >> CHANGELOG.md
echo "--" >> CHANGELOG.md
cat CHANGELOG.bak >> CHANGELOG.md
rm CHANGELOG.bak

# Update version number
echo "Updating version number ..."
sed -i s/@version\ \ \ \ \ \ \ \ [0-9.]*/@version\ \ \ \ \ \ \ \ $NEW_VERS/ gc_little_helper.user.js
sed -i s/var\ scriptVersion\ =\ \"[0-9.]*\"/var\ scriptVersion\ =\ \"$NEW_VERS\"/ gc_little_helper.user.js

# Create Chrome Package
echo "Creating Chrome package ..."
Tools/create_chrome_package.sh

# Manual check
echo "Now check if everything is fine:"
echo "#############################################################################"
git diff
echo "#############################################################################"
read -p "Everything fine? Press return! Otherwise press Crtl+C! "

# Checkin Version and create Tag
git add CHANGELOG.md gc_little_helper.user.js Chrome/manifest.json
git commit -m "Release $NEW_VERS"
git tag $NEW_VERS

# Push
git push
git push --tags

# Upload to AutoUpdate-Server
if [ ! -e Tools/updateserver ]; then
  echo "# Tools/updateserver doesn't exist!"
  echo "If you want to upload the new Version to the AutoUpdate-Server you have to create it."
  echo "Content: "
  echo "  user@server"
  echo "  /path/to/script"
  read -p "Create it or ignore this and press return!"
fi

if [ -e Tools/updateserver ]; then
  SERVER=`head -1 Tools/updateserver`
  PFAD=`tail -1 Tools/updateserver`
  if [ "$SERVER" == "" ] || [ "$PFAD" == "" ]; then
    echo "# Tools/updateserver has wrong content ..."
    echo "Content: "
    echo "  user@server"
    echo "  /path/to/script"
  else
    CHANGELOG_=`echo -e "$CHANGELOG" | sed s/\'/\\\\\\\\\'/g`
    scp gc_little_helper.user.js $SERVER:$PFAD/js/
    ssh $SERVER "cp $PFAD/js/gc_little_helper.user.js $PFAD/js/gc_little_helper_$NEW_VERS.user.js"
    ssh $SERVER "echo -e \"\\\$gclh_changelogs['$NEW_VERS'] = 'v$NEW_VERS\n$CHANGELOG_';\n\n\" >> $PFAD/changes.txt"
    ssh $SERVER "echo -e \"<?php\n\" > $PFAD/changes.php; cat $PFAD/changes.txt >> $PFAD/changes.php; echo -e \"\n?>\" >> $PFAD/changes.php"
    ssh $SERVER "sed -i s/\\\$gclh_ver\ =\ \\\"[0-9.]*\\\"/\\\$gclh_ver\ =\ \\\"$NEW_VERS\\\"/ $PFAD/updates.php"
  fi
fi

# Open all Websites ...
firefox 'https://chrome.google.com/webstore/developer/dashboard'
firefox 'https://userscripts.org/scripts/upload/81052'
firefox 'http://forum.geoclub.de/posting.php?mode=reply&f=117&t=46168'
firefox 'http://www.amshove.net/greasemonkey/updates.php'
echo "Changelog:"
echo "v$NEW_VERS"
echo -e "$CHANGELOG"
