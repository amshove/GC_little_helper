#!/bin/bash

cd Chrome
rm gc_little_helper.zip gc_little_helper.js 2> /dev/null
cp ../gc_little_helper.user.js gc_little_helper.js

VERSION=`grep @version gc_little_helper.js | tr -s ' ' ' ' | cut -d ' ' -f 3`
echo "Version: $VERSION"
sed -i s/\"version\"\:\ \"\[0-9.\]*\"/\"version\"\:\ \"$VERSION\"/ manifest.json

zip gc_little_helper.zip * > /dev/null
