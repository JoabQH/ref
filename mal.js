<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets"
        xmlns:tizen="http://tizen.org/ns/widgets"
        id="com.joab.timesync"
        version="1.0.0"
        viewmodes="fullscreen">

  <tizen:application id="com.joab.timesync"
                     package="timesync"
                     required_version="2.4"
                     auto-relaunch="true"/>

  <tizen:profile name="tv"/>
  <tizen:application id="com.joab.timesync" package="com.joab.timesync" required_version="2.4"/>
  <content src="index.html"/>
  <name>SSSP Time Fixer</name>
  <description>Corrige la hora automáticamente en pantallas Tizen</description>
  <icon src="icon.png"/>

  <tizen:setting screen-orientation="portrait"
                 context-menu="disable"
                 background-support="enable"
                 encryption="disable"
                 install-location="internal-only"
                 hwkey-event="enable"/>

  <access origin="*" subdomains="true"/>

  <tizen:privilege name="http://tizen.org/privilege/internet"/>
  <tizen:privilege name="http://tizen.org/privilege/time.set"/>
  <tizen:privilege name="http://tizen.org/privilege/application.launch"/>

  <tizen:feature name="http://tizen.org/feature/screen.size.all"/>

</widget>
