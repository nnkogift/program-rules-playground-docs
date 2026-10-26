---
title: 'Install'
description: 'Shows how to install the app by uploading the release zip in the App Management app, how to install it from the DHIS2 App Hub once it is listed, and how to give users access.'
sidebar_position: 1
---

# Install

## Goal

Install Program Rules Playground on your DHIS2 server and give users access to it.

## Before you start

- A DHIS2 server on version 2.40, 2.41, 2.42 or 2.43. See [DHIS2 version compatibility](../introduction/dhis2-version-compatibility.md).
- A user account that can install apps in the **App Management** app. On DHIS2 2.43, that needs the `M_dhis-web-app-management` authority, or "ALL". `TODO(verify)`: the authority needed on 2.40 to 2.42.

The app is on its way to the DHIS2 App Hub, but it is not listed there yet. Until it is, install it from the release zip.

<!-- When the App Hub listing is live, put the App Hub section first. -->

## Steps

### Upload the release zip

1. Open the [releases page](https://github.com/nnkogift/program-rules-playground/releases) of the app's GitHub repository.
2. Under **Assets** of the release you want, download the `.zip` file.
3. In DHIS2, open the **App Management** app.
4. Open the section for installing an app from a file and upload the `.zip` file. `TODO(verify)`: the exact labels on 2.40 and 2.43 (expected **Manual install**, then **Upload an app to install**).
5. Wait until App Management reports that the app is installed.

To update the app later, download the newer release zip and upload it the same way. `TODO(verify)`: whether App Management on 2.40 to 2.43 replaces the installed version in place.

### From the App Hub (coming soon)

When the app is listed on the DHIS2 App Hub:

1. In DHIS2, open the **App Management** app.
2. Open **App Hub**. `TODO(verify)`: the exact label on 2.40 and 2.43.
3. Search for "Program Rules Playground" and install it.

## What you'll see

The app appears in the DHIS2 apps menu as **Program Rules Playground**. When you open it, it shows the **Programs** list. The **About** link at the bottom of the list shows the installed **Version** and the **Supported DHIS2** range.

## Give users access

Users who don't have the "ALL" authority need the app's authority in one of their user roles before they can open the app. Everything else depends on sharing and organisation units, not on extra authorities. See [Requirements and user authorities](./requirements-and-user-authorities.md) for the minimal role and what each feature needs.

## Related pages

- [Requirements and user authorities](./requirements-and-user-authorities.md)
- [Is it safe to use on production?](../introduction/is-it-safe-on-production.md)
- [Tutorial: debug your first event program rule](./tutorial-debug-your-first-event-program-rule.md)
- [Release notes](../help/release-notes.md)
