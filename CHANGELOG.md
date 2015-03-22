#### v11.4
- Fix: Versionierung

--
#### v11.3
- Fix: Works now with Firefox 36
- New: Download Button for Lab Cache Gpx Files. Fixes #120 
- Fix: GClh doesn't work on new settings pages (fixes #118)
- Mod: updated sync_setConfigData for the new chrome storage concept
- mod: new initialisation concept (just a try to remove the nesting and make it more structured)
- Fix: settings storage is broken for the map page
- Add: sync settings with chrome sync
- Fix: warnings on the map page while checking for updates
- Fix: geochecker link causes security error (fixes #130)
- New: Added Fancybox on the picture list in the description. (closes #124)
- Fix: Update alert without function? (fixes #111)
- Fix: Link from google maps to gc.com is missing (fixes #125)

--
#### v11.2
- Fix: VIP-Icons in Logs is out of function (solved #108)

--
#### v11.1
-Fix: homezone broken with FF32 (fixes #106)
-Fix: homezone color is ignored (fixes #105)
-Fix: VIP-icon not visible in Logs for FF
-Fix: Logs and VIP-List broken with GM > 2
-Fix: GMap Satellite Layer not working

--
#### v11.0
- Fix: after saving all line breaks disappear in cache notes
- Fix: import settings from clipboard fails 
- Fix: could not change map layers
- Fix: Chrome no config buttons

--
#### v10.9
- Add: More than one Neares List / HomeCoord
- Add: Insert sum of items in the list title on public profile list pages [Second try] (closes #69)
- Add: Load the dropbox config automatically (check intervall=10h) (closes #48)
- Add: Insert sum of items in the list title on public profile list pages...
- Fix: Findcounter at friendlist is lost (fixes #83)
- Fix: State of sidebar widgets (show/hide) gets lost (Profile page) (fixes #73)
- Fix: Not all TB-visits are hidden on the profile page (fixes #77)
- Fix: The insertion method of the GClh banners breaks the map under chrome (fixes #80)
- Fix: https sites cant reach the http config of GCLH under chrome (now the config is copied during the settings save on the options site) (fixes #78)

--
#### v10.8
-Fix: homeCoordinatesSet does return wrong results (closes #67)

--
#### v10.7
-Add: "Save&Upload" button in settings (#48)
-Mod: Linklist on map color is now white
-Mod: Treat safari like chrome
-Fix: no images in logs if thumbs are enabled 
-Fix: no thumbs displayed on images 
-Fix: no popup/sideshow on click 
-Mod: use large thum img instead of the original image (could be very large) (closes #45)
- New: Highlight own logs and owner's logs in trackable page
-Fix: Sync code is loaded on every page 
-Fix: no reload after sync import (not applied) 
-Mod: Removed unused code
-Fix: signature is inserted on confirm again (closes #61)
-Add: option to add "&visitcount=1" to geochekcer.com-links (we must hide the referrer: non-chrome whith anonym.to) (closes #28)
-Mod: Protect getValue againt defaultValue === undefinded (cause a setValue on each call)
-mod: removed gclhConfigKeys (use CONFIG now)
-Fix: The wrong gclhConfigKeys was loaded (broke the learing of new variable names)
-add: prototype of default log owner (need more info)
- Fix: Hide Header in gc.com maps was not working correctly
- Fix: support also https-urls from geocaching.com
- Fix: Firefox got very slow in some setups - changed the way the settings are saved (closes #39)
- Fix: Link to geocaching maps from Google maps missing (new google maps design) (closes #51)
- Fix: Links of linklist in profile are not visible (fixes #47)

--
#### v10.6
- New: Highlight column of the actual day on PQ-Page (closes #34)
- New: Add refresh-button to PQ-Page (closes #33)
- New: Option to change opacity of homezone circle (closes #26)
- New: Icon to indicate, if you've already given a Fav-Point (Code from nah&fern - closes #29)
- Fix: "Run this query once then delete it" was selected by default, if you created a PQ from a bookmark list
-Fix: saving coords does not work

--
#### v10.5
- New: Added option to disable the new feature "Show fixed header in PQ-List"
- Fix: VIP-Function was broken with some VIP-Names

--
#### v10.4
- Fix: crash on parsing old FF settings
- Fix: Save button does not work

--
#### v10.3
- Fix: FireFox bug with the pocketquery map
- Fix: LogInline button for PMO-Caches was not displayed
- Deactivated BookmarkIt-Function - this function needs an information, gc.com removed from nearest list :-/
- Add: make the header of the PQ table fixed to increase the readability (closes #13)
- Add: a map of the coordinates entered on the createPocketQuery-Page (closes #24)
- Fix: Sometimes logs were displayed twice (fix #22)
- Import/Export Settings by hand or by dropbox

--
#### v10.2
- Fix: Config was broken in v10.1

--
#### v10.1
- Fix: Linklist DropDown was broken [gc.com update]
-Mod: add the "show on geocaching map" button to new google maps (can't decode zoom level yet)
-Fix: some page elements are above the image tooltip -Fix: images tooltips may be not completely visible (closes Issue #2)
-Mod: changed the message of the unsavedLogWaring
-Fix: closes #23 ("log your visit (inline)" not at the right place in the new design)
-Fix: duplicate logs (just a try ;))
-Mod: use cache url, date and logtype for duplication check
-Fix: some bugs -Mod: enable souvenirHiding on other profile pages
-Mod: Beautified hideSouvenirs (Issue #17) with chosen (http://harvesthq.github.io/chosen/)
- Fix: Added some statements to prevent misleading error messages
- Fix: Start page was not displayed correctly with a custome page width
- Fix: Saving of home coordinates doesn't work
- Fix: Removed Header in inline log

--
#### v10.0
- Fix: Users with trailing space couldn't be selected as vip
- Fix: languageSelector broken with chrome
- Fix: chrome-hover-fix selector selects too many elements
- Mod: if linklist is empty use default entries
- Fix: remove of gc menu elements fails
- Fix: hide green top button is not working
- Fix: duplicate logging with chrome
- Fix: LinkList menu item is in a second line in some browsers
- Fix: Since the last groundspeak update the LinkList is broken
- Fix: Not all log pages were loaded (throws a exception)

--
#### v9.9
- Fix: Duplicate logs
- Fix: Missing vip- and mail-icons for some logs

--
#### v9.8
- New: parallelisation of the log loading requests
- Fix: chrome "log order" wrong (endlessscroll of the page was not disabled)
- Fix: Google Maps alert displayed every time
- Fix: Hide TBs/Coins in profile

--
#### v9.7
- Fix: Some new issues with new listing
- Fix: GClh doesn't work on event listings

--
#### v9.6
- Fix: auto hint decode does not work in chrome
- Fix: auto home coord grabbing is broken
- New: More space between Smilies on Log-Page
- Fix: Links in Log doesn't work with new Listing-Design
- Fix: HomeZone not displayed under Chrome
- Fix: Chrome doesn't load logs correctly

--
#### v9.5
- Fix: Issue #276 - log-signature is ignored if there is a comment in fieldnotes
- New: GClh now overwrites the layercontrol of GC Map Enhancements (can be disabled in settings)
- Fix: Issue #278 - hide hint behind link doesn't work in new layout
- Fix: Issue #275 - Count of Characters and "not saved"-Note doesn't work on log-page
- Fix: Issue #277 - F2 to log doesn't work

--
#### v9.4
- New: Issue #251 - Show VIPs who haven't found the cache (new option)
- New: Issue #224 - Warn user when navigating off the page while editing the log
- Fix: Issue #129 - Mail-Icon beside username on trackables 
- Fix: Issue #11 - Mail-Icon beside username on log-page
- Fix: Issue #237 - Show PQ in Map doesn't work with direct link
- Fix: Issue #274 - [gc.com update] Apply GClh to new listing design and urls (Not fully tested by now, but the most will work)
- New: Removed "Route to this Location"-Link - gc.com has added it natively ("Driving Directions")
- New: Issue #207 - Make HillShadow-Overlay "live"-choosable 
- New: List of Map-Layers can be selected in settings to reduce the long gc.com list of layers
- Fix: Issue #266 - [gc.com update] Map selection problem and additinal map layers, Hillshadow, ..
- New: Issue #271 - Remove footer from print-page of listings
- Fix: Issue #269 - Special Charecters in owner name are destroyed 
- New: Issue #268 - Don't add signature when logging via fieldnotes (new option)

--
#### v9.3
- New: Issue #264 - Enhance google-calendar link for events
- New: Issue #258 - Hide TBs in Log-Summary on Profile Page 
- Fix: Issue #260 - Facebook-Button is displayed again
- New: Issue #241 - Hide header on map with button in menu 
- Fix: [gc.com update] Linklist in Map was broken
- Temporary removed additional map layers - we need more time - in the meantime try "Geocaching Map Enhancements (http://userscripts.org/scripts/show/109145)
- New: Replace owner pseudonym by real owner name (Settings)
- New: Show real owner name as tooltip
- Fix: Show Day of Week in events was broken
- Fix: Issue #267 - VIP Button on Pseudonym-Owners doesn't work
- Fix: Removed Frog-Icons (gc.com removed them)
- New: Issue #257 - Option to remove green gc.com "To Top"-Button in Listings 

--
#### v9.2
- New: Issue #245 - Replace Log by Last-Log-Template <- configurable
- New: Issue #247 - Spoiler-Filter for Thumbnails now configurable
- Fix: Issue #250 - Jumping to log-entry doesn't work, if it is not displayed
- Fix: Issue #248 - Remove "gallery link"-function - it's duplicated 
- Fix: Issue #249 - Map control is on top of the hovered log in VIP-List 
- Fix: Issue #252 - GClh removes "Top" Button in Listings 
- Fix: Issue #254 - [gc.com update] VIP-List broken
- Fix: LinkList and LinksListOptions get broken if an emty list is saved in the options
- Fix: map is broken under chrome if "Add additinal Layers to Map" is active
- Fix: Workaround for the chrome save-notes-bug (still no breaks will be added after saving under chrome)
- Fix: Hide Linebreaks Bug (Chrome)
- Fix: Cache Notes: hide_on_load() crashes if the load event fires after the user switched to edit mode (Chrome)
- Fix: Fix: BB-Code-Editor partially broken under chrome

--
#### v9.1
- Fix: [gc.com update] FieldNotes-Statistics was broken
- New: Issue #223 - Better statistic of Coins/TBs (As fix for broken statistics after gc.com update)
- New: Issue #235 - Show "Last Log"-LogTemplate also when logging a cache 
- New: New Log-Variable: #owner# will be replaced by the name of the owner

--
#### v9.0
- New: Default-Log-Type for Events
- New: Hide Header in Map
- New: Issue #236 - Add Gallery-Link to the top menu 
- New: Issue #238 - Replace PQ-Name, if PQ is created from bookmarks

--
#### v8.9
- New: Issue #27 - Save Cache-Log-Text for TB/Coin-Log
- New: Added #me#-Variable to Mail-Signature
- New: Issue #233 - Add Username to Mail
- Fix: Issue #230 - Default map issues when running both GClh and Geocaching Map Enhancement scripts (Disable new option 'Add additinal Layers to Map' and set default-Layer to '-- no default --')
- Fix: Issue #234 - Log Cache inline-Link gets displayed in the wrong place 

--
#### v8.8
- Fix: Mailto-Link wasn't working on every profile-URL
- Fix: [GC-Update] Number of Finds was wrong (#found#)

--
#### v8.7
- new: Issue #229 - Add Mailto-Link to Mail-Adresses in Profilpage   
- Fix: Issue #228 - [GC-Update] Log-Formating does not work anymore  
- Fix: Issue #227 - [GC-Update] Link from GoogleMaps does not work correct 
- Fix: Issue #226 - Challenges not present any more 
- Fix: Issue #225 - Icons broken with GC.com 2012-12-11 update 
- Fix: One image was hidden in Gallery, in the two-cols-layout if the number of images is odd

--
#### v8.6
- New: Issue #209 - Counter for given favorite points 
- Fix: Searchbox fixed
- New: Issue #193 - Default actions for hiding cache types in map 
- New: Issue #201 - F2 to submit Pocket Query Settings and Bookmarks
- New: Issue #119 - Show breaks in cache notes 
- New: Issue #222 - VIP-List: Show date of log in pop-up
- New: Issue #216 - Use an generic URL for google maps to use it in other countries
- New: Issue #130 - Place the caption to the top of the picture on hover with a link to the 
- New: Issue #215 - Set a border for Thumbnails in Listing
- Fix: Issue #218 - Hide Facebook-Button on Login Page

--
#### v8.5
- Fix: Settings were not displayed

--
#### v8.4
- Fix: Bug #220 - Disabled redirection to map on found list of a user
- Fix: Settings couldn't be opened because of an undefined order[i] (FireFox)
- New: Linklist settings with Drag&Drop
- Fix: After the settings dialog is closed, the page reloads but stays scrolled down
- Fix: No additional layers in Chrome
- Fix: Chrome: Linklistsearch does not work - html does not allow a form in a form -> chrome ignores it -> Deleted the form, use a keyDownEvent now
- Fix: Chrome is detected as firefox
- Fix: gclh destroys menu hover (i could not find out how -> just repair the hover events)
- Fix: Opera helperscripts do net return a responseHeader (not used in gchl yet)
- Add: option page for Opera with a link to the gclh options
- Add: auto opten options if "#GClhShowConfig" is in the url

--
#### v8.3
- New: Issue #214 - Add @grant to metadata 
- Fix: Issue #213 - Challange-Page gets destroyed if page-width is changed 
- Fix: Issue #212 - Friends with an "&" in username can be added twice to VIP-List 
- New: Issue #203 - Add a Hint to user Leaflet instead of google maps 
- Fix: Issue #208 - Log gets pushed away

--
#### v8.2
- New: Issue #206 - [Update] Remove SocialShare
- New: Issue #176 - Make Hill-Shadow choosable for each Map
- Fix: Issue #204 - [gc.com update] Update list of default maps in settings (My Topo vanished)

--
#### v8.1
- New: Issue #194 - Show bigger images in gallery without thumbnail-function enabled
- Fix: Bug #198 - [gc.com update] Log helper don't work (Smilies, BBCode, ..) 
- Fix: Bug #200 - [GC update] Caches on Map are not clickable - Hill-Shadow
- Fix: Bug #199 - [GC update] Caches on Map are not clickable
- New: Issue #192 - Remove "Login with Facebook"

--
#### v8.0
- Fix: Bug #190 - [gc.com update] Smilies, BBCode & Log-Signature destroyed - some rework

--
#### v7.9
- Fix: Bug #189 - [gc.com update] Remove gc.com-Links - new and removed Links
- Fix: Bug #190 - [gc.com update] Smilies, BBCode & Log-Signature destroyed

--
#### v7.8
- New: Issue #62 - prevent problems with gc.com-updates by encapsulating single features
- New: Issue #183 - Add directlink to fildnote page
- New: Issue #181 - Use the same design for "select all" in Filednotes like in Bookmarks
- New: Issue #177 - Add User-Name Variable to Log-Template (New Varaible: #me#)
- New: Issue #150 - BBCode for creating a Listing 
- Fix: Bug #188 - [gc.com update] Remove "Load Dynamic Map" - it is now obsolete 
- New: Issue #51 - Hide decryption key, if hint is decrypted automatically
- Fix: Bug #187 - Log-Character-Count failure
- Fix: Bug #186  -  Hide Map-Sidebar malfunction 

--
#### v7.7
- Fix: Bug #178 - Default-Map Selection does not work properly 

--
#### v7.6
- New: Issue #175 - Display Hill-Shadows 
- New: Issue #172 - Fix to use on Android Smartphone  
- New: Issue #173 - Add Hike & Bike map
- Fix: Bug #168 - [BB-Code] Link-Function on Log-Page 
- Fix: Bug #169 - #found# Variable has a wrong value if there are completed challanges
- Fix: Bug #166 - Gallery with one image gets displayed empty 
- New: Issue #164 - [Map] Add GM Terrain
- New: Issue #163 - [Map] New layer: OSM ÖPNV-Karte 

--
#### v7.5
- Fix: Bug #160 - Display of logs is shifted to the right, if more than 1000 images in image gallery
- New: Issue #145 - Change BBCode-Icons 
- New: Issue #87 - Show sum of different LogTypes in Fieldnotes 
- New: Issue #149 - CheckAll-Button at FieldNote-Page 
- New: Issue #159 - Smaller size of hovered images 
- New: Issue #162 - Option to hide sidebar on map by default
- New: Issue #147 - Configure default layer for map 
- New: Issue #156 - [GC Update] GC-Map = Google Map, possible see desc. 
- Fix: Bug #154 - [GC Update] GC-Map Show found / own Caches 
- Fix: Bug #152 - [GC Update] GC-Map Linklist 
- Fix: Bug #151 - [GC Update] GC-Map Homezone 
- Fix: Bug #155 - [GC Update] GC-Map redirect 
- Fix: Bug #158 - [GC Update] "Hide recently viewed caches" is now deprecated 
- Fix: Bug #161 - "Find Player" does not work from linklist on profile page 
- Fix: Bug #157 - [GC Update] Bookmark to Nearest-List doesn't work 
- [GC Update] Removed "Set old map as default"-Option

--
#### v7.4
- Fix: Bug #144 - VIP-List Owner needs urldecode 
- Fix: Bug #148 - "Hide recently viewed caches"-Settings is ignored
- Fix: Bug #146 - Eventday is wrong after 29.02. with specific date-format
- Fix: Bug #137 - Usernames with & are not encoded correct

--
#### v7.3
- New: Issue #56 - BBCode: Select different fonts
- New: Issue #38 - Better BBCode layout 
- New: Issue #127 - BBCode: Add quote-Tags
- New: Issue #128 - BBCode: Add more colors 
- New: Issue #140 - Add ability to hide Last Visited List 
- Fix: Bug #143 - Link to user-profile on found/hidden-list does not work on list with specific 
- Fix: Bug #142 - VIP-List: Display Owner has error 
- Fix: Bug report #141  -  VIP-List: & not encoded
- New: Enhancement #139 - Improove Friendslist
- Fix: Bug report #137  -  Usernames with & are not encoded correct

--
#### v7.2
- Some lines for better support with opera (not complete now)
- Fix: Bug #131 - Day of week is wrong, if datetformat is changed (Added GClh Option for format)
- Fix: Bug #123 - Script has error at specific cache
- FIX: Bug report #135  -  VIP-List not displayed after GC-Update 
- New: Feature request #132  -  Profile-Link on created by / found by page 
- New: Issue #122 - [gc.com update] Images in listing got displayed with the small source

--
#### v7.1
- Fix: Bug #121 - [gc.com update] other coordinate formats vanished
- Fix: Bug #115 - Homezone radius says miles when English is specified but is actually kilometers.
- New: Issue #120 - [gc.com update] Hide new links "Learn" and "Partnering" from menu
- New: Issue #105 - Disable the display of owner logs in VIP list
- New: Issue #114 - Highlight coords if modified
- New: Issue #116 - Add coord.info-Link in Mails 

--
#### v7.0
- Fix: Bug #107 - TB-Series displayed incorrect, if there is a "-" in the name 
- Fix: Bug #109 - No Logs, when not logged-in 
- Fix: Bug #110 - Inline-Log doesn't work 
- Fix: Bug #111 - [gc.com update] google maps link vanished 
- Fix: Bug #112 - [gc.com update] Some features, displayed next to the coords, vanished 
- Fix: Bug #113 - [gc.com update] "Hide Feedback" can be removed 
- New: Issue #46 - Date picker im Log dialog 

--
#### v6.9
- Added option to disable loading Logs with GClh (Workaround for Greasemonkey-Bug #1448 - https://github.com/greasemonkey/greasemonkey/issues/1448)
- Fix: Bug #103 - Usernames in URL not encoded 
- Fix: Bug #102 - Feedback button malformed on old map
- Fix: Bug #106 - One log disappeared (the log on the threshold) 
- New: Issue #101 - Show day of week on Event-Dates 
- Fix: Bug #104 - TB-AutoVisit beim Editieren 
- Added help to configuration page (thanks to Robert alias pl1lkm)

--
#### v6.8
- Fix: Bug #99 - [gc.com update] Mail-Link does not transfer GC-ID 
- Fix: Bug #98 - [gc.com update] "Show area in google maps"-link disappeared
- Fix: Bug #97 - Dynamic Map doesn't work anymore 

--
#### v6.7
- Fix: Bug #96 - [gc.com update] Hide Avatar function of gc.com does not work (Added an advice to youse GClh option) 
- Fix: Bug #95 - [gc.com update] Logs are shown twice

--
#### v6.6
- Fix: Bug #92 - Owner disappeared in short VIP-List
- New: Issue #22 - Icon für "log inline" 
- Fix: Bug #91 - Inline-Log doesn't work - the links disappeared 
- Fix: Bug #89 - Prevent newlines if there is no cache-titel in mail
- Fix: Bug #88 - gclh config: Homezone radius labelled km instead of miles 
- New: Issue #90 - Search also in Usernames and not only in LogText 
- Small Fix for Chrome/Opera?! (See http://www.geoclub.de/viewtopic.php?f=117&t=58855)

--
#### v6.5
- New: Issue #86 - Search in LogText 
- Fix: Bug #68 - [gc.com update] Log-Filter doesn't work
- New: Issue #82 - Show thumbnails in logs side by side
- New: Issue #81 - Show Log-Text on mouse over in VIP-List
- New: Issue #14 - Show one entry per log at VIP-List 
- New: Issue #80 - Show "loading"-Image in VIP-List 
- New: Issue #78 - VIP-Icon at public profile 
- New: Issue #58 - Add a "Show routing information"-Link to Listing
- Small Fix: enable Link on google maps also for https
- New: Issue #73 - option to disable automatic reset for difference-counter at friendlist 
- New: Issue #54 - Divide coin & tb sum at public profile
- New: Issue #57 - Bigger images at gallery 
- Small Bugfix: Image-Hover in Gallery doesn't work
- New: Issue #55 - Change title-color of archived caches red 
- Small Bugfix: An error at thumbnail-function was not caught

--
#### v6.4
- Small Bugfix of v6.3 - Script breaks, if there is no Gallery in Listing

--
#### v6.3
- New: Issue #77 - Hide Avatars
- New: Issue #76 - Add a "Load all logs"-Link
- Fix: Bug #59 - [gc.com update] load all logs no longer working 
- Fix: Bug #72 - html in cachename on mail icon at disabled caches 
- Fix: Bug #74 - [gc.com update] Difference-counter at friendlist doesn't work
- Fix: Bug #71 - [gc.com update] VIP-Icons are not displayed in logs
- Fix: Bug #63 - [gc.com update] VIP-List doesn't work
- Fix: Bug #65 - [gc.com update] Mail-Icon and top-link are not displayed in logs

--
#### v6.2
- Fix: Bug #66 - [gc.com update] Thumbnails in Logs doesn't work
- Fix: Bug #67 - [gc.com update] Mouseover on images doesn't work
- Disabled: Log-Filter (Bug #68)
- Fix: Bug #64 & #60 - [gc.com update] "Hide spoiler warning" doesn't work  - [gc.com update] View Logbook link not visible 

--
#### v6.1
- New: Issue #30 - Show bigger Image on mouseover in gallery 
- Change: Issue #53 - Increase number of log-templates 
- Change: Issue #52 - Don't show thumbnail of spoilers 
- Change: Issue #42 - Count TBs and Coins separately
- New: Issue #48 - Filter for Logs
- New: Reset difference-counter at friendlist automatically if day changes
- Change: Issue #6 - Reset difference-counter at friendlist with a button
- Fix: Bug #45 - [gc.com update] Difference-counter at friendlist doesn't work if there are more than 1000 finds 

--
#### v6.0
- Fix: Bug #43 - JS-Links doesn't work in linklist on profile page
- Fix: Bug #41 - Trackable name is not read correctly from Mail-Icon
- Fix: Bug #34 - [gc.com update] VIP-Log-Icons disappeared 

--
#### v5.9
- Fix: Bug #32 - [gc.com update] Hide social buttons in linklist 
- Fix: Bug #33 - [gc.com update] Redundant Mail an VIP-Icons at logs 

--
#### v5.8
- New: Issue #9 - Thumbnails of images in listing an logs
- New: Issue #5 - Highlight "Related Website"
- New: Issue #13 - Show gallery-link at own caches in profile
- Fix: Bug #25 - AutoVisit - TB is visited
- Fix: Bug #29 - Mail Icon in Trackable Logs is missing 
- Fix: Bug #28 - Coin Series Info is sometimes missing

--
#### v5.7
- New: Issue #1 - Highlight myself in VIP-List
- Fix: VIP-Icon-Status at bookmark-tables
- Fix: Bug #26 - Owner not correctly determined in VIP-List
- New: ColorPicker for Homezone

--
#### v5.6
- Fix: eMail-Link on disabled / archived caches
- New: Loglenght counter (max 4000)
- New: Homezone color editable via menu

--
#### v5.5
- New: Bookmark it-Icon at nearest list
- Fix: if one VIP-Icon changes, all others change too
- Fix: VIP-Icon beside owner in list no shows the correct color
- Change: disable AutoVisit on logedit-page
- Fix: AutoVisit select by value, enable for Webcam caches
- New: TB-ID inserted in mail
- New: [URL]-Tag for bbcode
- New: Show version in configuration

--
#### v5.4
- New: Show Map-It button at Listing
- New: VIP-Icon at friendlist
- New: "All my VIPs"-List at profile-page
- Change: improved "show area on google maps"-link at listing
- Fix: Autovisit state wasn't saved
- Fix: Many things were broken by "to top"-feature -> fixed

--
#### v5.3
- New: "Top"-Link at Logs
- New: Show owner at VIP-List
- New: Show one icon per log at the VIP-List
- Change: My Statistics-Bookmark updated to other URL
- Fix: Default-Log-Type was selected on yes/no-question at NM-Logs
- New: Autovisit now selects "visited" only if you select LogType "found" or "attended"
- Fix: Autovisit now doesn't distrub "All visited"
- change: enable matrix statistics also on profile page
- change: use GC logo for link on google maps
- fix: google maps link can't be used directly after searching

--
#### v5.2
- New: VIP-List

--
#### v5.1
- New: new update advice
- New: show percentage of favourite points in listing
- Fix: redirect to map on search by keyword
- New: AutoVisit for TBs/Coins

--
#### v5.0
- Fix: hint-decryption
- Fix: show Coin-Series
- Fix: show BBCode while editing logs of trackables
- Fix: exclude script on "send to gps" page to prevent destroying the design

--
#### v4.9
- change: insert a dot where the line breaks are removed
- Fix: exception when setting focus
- New: strikeout title of archived/disabled caches
- New: beta map: hide found/hidden caches by default
- Fix: adapt to changes of 2011-06-28 (feedback button)
- New: show "n/81" in cache matrix (statistics page)
- Fix: don't automatically decrypt unencrypted hints

--
#### v4.8
- Fix: a bug in "remove advertise" function

--
#### v4.7
- Fix: workaround to not make &amp; of & in templates
- Fix: illegal character in signature/template for leading newlines (configuration has to be saved again to fix it!)
- New: hide hint behind a link
- New: remove spoiler warning
- New: remove link to advertisement instructions
- New: remove unneeded line breaks
- Fix: scroll to top when opening config dialog
- Some improvements to autoupdate

--
#### v4.6
- Fix: Click on grey background to close configuration
- Fix: newlines as first character of signatures and templates
- New Variable: #found_no# = founds (without +1)
- Added #found# Variable to Templates an TB-Signature
- Set cursor to first character in Log-fields
- Allow GCVote in inline logs
- Fix: do not redirect to map from links of friend list
- Append GCcode to Cache-Name on mail links
- Hide Config-Link in beta map, because it doesn't work fine
- BugFix: First box in sidebar was hidden
- Changed some default-settings

--
#### v4.5
- Show other Coordinate-Formats in Listing and on print-page
- Show amount of different Coins found in public profile
- Now the HomeCoords are also parsed from http://www.geocaching.com/account/default.aspx
- Fix: Insert template doesn't replace text now
- Fix: Redirect to Map
- Fix: Inline-Log does work on Pages without Gallery now

--
#### v4.4
- Added Log-Templates
- Fix: Default Log-Type should not override Field-Note-Log-Type
- Added some Code to support Google Chrome (not tested and not supported yet) - thanks to Bart
- Added Signal-Smilies
- Decrypt Hint on print-page
- Fix: Now it also works if there is a ?pf= in Listing-Link (Decrypted Log)
- Show TB-List in inline-Logs
- Removed: Insert Home-Coords in Searchfield - gc.com fixed it
- Save Home-Coords in Configuration
- Default-Value for Searchfield in Navigation
- Added Config-Link to Profile-Page
- Hide Linklist-Settings in Configuration (let it show with a link)
- New Design for Config and Find Player

--
#### v4.3
- Transfer TB-Tracking Number to Log-Field
- Repair gc.com-Bug: Linebreaks in decrypted hints
- Change background of found-caches to green (instead of grey)
- Log your visit (inline) Link in top menu
- styl-changes to search field (thanks to shen)
- Custom width for global page
- Hide Disclaimer on print-page
- Show Coin-Series-Name in TB-Listing
- Fix: Set Focus to textbox after clicking a Smiley or BBcode
- Fix: Log-Signature and Field Notes

--
#### v4.2
- Added: Smilies & BBCode on Log-Page
- Fix: overwrite of Log-Type on edit-Log
- Improve searchfield in linklist: Search direct by GC-ID, TB-ID or Tracking-Number
- Highlighted "founds since last load" on Friendlist
- Fix: Save target option of custom Bookmarks

--
#### v4.1
- Friendlist: Show amount of caches found since last load of the Friendlist
- Fix: Default-Log-Type doesn't override &LogType=
- Post log from Listing (inline)
- Fix: Hide Navigation on SignIn overlay
- Fix: Remove gc.com Links if logged out
- Fix: On auto-decrypt hint the decrypt link now changes to "encrypt"
- Choose wich Links are shown in Beta Map
- Fix: Show Log-Signature also on log.aspx?wp=xxx
- Removed leading line breaks from Log Signature

--
#### v4.0
- Update links to use beta-Map (disable via "default old map" in settings)
- Fix: Signature removes Log on edit

--
#### v3.9
- Edit button to own caches on profile page
- Set old map as Default
- Log-Signature-Variable: #found# (will be replaced with finds+1)
- Log & TB Signature
- Fix: get Cachetitle for Mail form log-page
- Searchfield in Linklist
- Linklist in beta map

--
#### v3.8
- Enable dynamic map
- Show Linklist as flat Navigation
- Remove links from Navigation

--
#### v3.7
- Insert Home-Coords into search-field
- Custom Map-width
- Fix: Homezone on Beta Map
- New Links: Profile Souvenirs & Statistics

--
#### v3.6
- Fix: Bookmark-List on Top -> now in Navigation
- Fix: Feedback-Link
- Rename: Bookmarks -> Linklist
- Fix: Bookmarks in Profile
- Fix: Google-Maps & KML-Link in Bookmark-Lists
- Fix: Hide Cache Notes
- Fix: Hide Disclaimer
- Removed: Hide L&F-Banner

--
#### v3.5
- BugFix: Saving Home-Coords (thanks to Birnbaum2001)
- Fill Homezone on Map (and remove "clickable")

--
#### v3.4
- Show Homezone on Map

--
#### v3.3
- Show Mail-Icon on log-Page
- Bugfix: Some JS not working on page "Your Profile"

--
#### v3.2
- Added "Log It" Icon to Nearest List

--
#### v3.1
- Bugfix: Mail-Icon was not displayed on pages with URL?id=..

--
#### v3.0
- Added www.google.de/maps

--
#### v2.9
- gc.com-update-fix: Link on found-counter at friendlist

--
#### v2.8
- Bugfix: Style problems in "Your Account Details"-Page

--
#### v2.7
- Bugfix: Problem with "Hide Cache Notes if empty"-Option for not-PM

--
#### v2.6
- Added feature to hide Cache Notes if there are no notes (Hide/Show Link appears)
- Added feature to hide Cache Notes completely
- Added feature to hide the L&F-Banner on top of the Logs (Listing)
- Fix: Added F2 to Submit-Feature also to Trackable-Page

--
#### v2.5
- Added feature to prevent "show all logs" if there are to many logs
- Added an signature for mails
- Fix: Shanged Feedback-Bookmark to new URL
- Fix: new Feedback-button can be hidden again

--
#### v2.4
- Bugfix: Disabled redirect also with bookmark "Nearest List (w/o Founds)"

--
#### v2.3
- Disabled redirect to map, if link "Neares List" is used
- Bugfix: Wrong cachename in mail-text if there are more than one open tab

--
#### v2.2
- Added feature to hide the boxes on the "My Profile"-Sidebar

--
#### v2.1
- Added feature to add custom bookmarks
- Added "Show in google maps"-Link to Bookmark-Overview-Page

--
#### v2.0
- Added links to bookmark-lists: "Download as kml" and "Show in google maps"
- Bugfix: Wrong coordinates from google maps

--
#### v1.9
- Added a Link to Google Maps on Cache-Page a Link on Google Maps to geocaching.com
- Replaced the Mail-Link with an Icon
- Removed: "Hide Facebook Button" - gc.com removed it
- "Show all Logs" now replaces the links, to prevent the redirect
- Bugfix: Gallery-Link on Friend-List

--
#### v1.8
- Add Links to Friendlist: Gallery, Hidden Caches
- Add Link to Found-List on Found-Counter at Friend-List
- Compatible to GCTidy Link (Thanks to tenrapid)

--
#### v1.7
- Bugfix: Mail-Link, hide disclaimer, decrypt hint (fixed the URL matching)
- Added My Trackabels-Bookmark

--
#### v1.6
- Bookmark hinzugefuegt: Neares-List ohne Funde
- TB-Log-Typ erweitert um "retrieved .."
- Konfigurierbar: Bookmarks links oder rechts
- Konfigurierbar: Bookmarks farbe und groesse
- Direkter E-Mail Link (+ einfuegen des Namens) in Cache-Listing und TB-Listing aufgenommen
- Merkt sich den Status der Checkboxen vom Mail-Formular
- Moeglichkeit, den Disclaimer im Listing auszublenden
- Moeglichkeit, den Hint automatisch zu entschluesseln

--
#### v1.5
- Bugfix: Home-Koordinaten berechnung gefixt
- Kleine vorlaufiger Fix: GCTidy-Link

--
#### v1.4
- Bugfix: Breite der "Du bist angemeldet als .." Zeile an deutsche Uebersetzung angepasst

--
#### v1.3
- Bugfix: Zeichensatzproblem bei Grad-Zeichen in RegEx

--
#### v1.2
- Bookmarks in einer Zeile
- Weitere Bookmarks hinzugefuegt (Tabs im oeffentlichen Profil, My Profile, Nearest List, Map)
- "Configuration" umbenannt in "little helper config"
- Default-Log-Type fuer Trackables
- Bookmarks umbenennen / Kuerzel geben

--
#### v1.1
- Konfigurations-Menue hinzugefuegt
- Bookmarks konfigurierbar und sortierbar gemacht
- Bookmark-Links erweitert
- Find Player-Menue
- Hide Facebook-Button
- Hide Feedback-Button
- Default Log Type

--
#### v1.0
- Bookmark-Liste fuer Profilseite und Header
- F2-Shortcut fuer den Log-Button
- Automatische Weiterleitung zur Kartenansicht
- Alle Logs Anzeigen
