---
title: 'Report a bug'
description: 'Explains where to report a problem, in the app repository or in dhis2-form-utils, and what to include.'
sidebar_position: 2
---

# Report a bug

## Goal

Report a problem so it reaches the people who can fix it, with enough detail to reproduce it.

## Before you start

- Check [Troubleshooting and FAQ](./troubleshooting-and-faq.md). Many problems are about access or organisation units, and some are known limitations.
- You need a GitHub account to open an issue.
- Do not include passwords, usernames, or personal or patient data, in the text or in screenshots.

## Steps

1. Decide where the problem belongs, using the list under [App or rule engine](#app-or-rule-engine-how-to-tell-which). If you are not sure, use the app repository.
2. For the app, open [a new issue in the program-rules-playground repository](https://github.com/nnkogift/program-rules-playground/issues/new). You can also get there from the app: on the program list, select **About** at the bottom of the page, then **Report a bug**.
3. Choose a form:
   - **Report a problem**, when something in the app does not work the way you expected.
   - **Suggest an improvement**, for an idea that would make the app easier or more useful.
4. For the rule engine or the rules panel, open [an issue in the dhis2-form-utils repository](https://github.com/nnkogift/dhis2-form-utils/issues) instead.
5. Fill in the details listed under [What to include](#what-to-include), and submit the issue.

### App or rule engine: how to tell which

Report it in **program-rules-playground** when the problem is in:

- The program list, searching for a program, or opening one.
- The context bar: the organisation unit picker, the date, or **Reset playground**.
- The page layout: the enrollment rail, adding events, the form buttons, the **About** page.
- **Validate form**, **Verify with server** or **Preview on-complete effects**, including what is sent to the server and how its results are shown on the form.

Report it in **dhis2-form-utils** when the problem is in:

- The result of a rule: it fires when it should not, does not fire, or assigns the wrong value, compared with the same values in a DHIS2 data entry app.
- The rules panel: the **Rules**, **Trace** or **Graph** tab.
- The **Server effects** dialog or the program rule details dialog.
- How a field renders or validates its value, for example a date, an option set or a coordinate field.

The app's issue chooser also links to the dhis2-form-utils issues, under "Report a rule engine or form library bug (developers)", and to the DHIS2 community for general questions about DHIS2 or program rules.

### What to include

- **DHIS2 version**, for example 2.43.2. `TODO(verify)`: where users find the DHIS2 version on 2.40 to 2.43.
- **App version**. On the program list, select **About** at the bottom of the page and copy the **Version**.
- **Program**: its name, and its ID if you can share it. The program list shows the ID under each program name.
- **Steps**: what you did, in order, and the values you entered. "Open the program, enter 150 in Number input, select **Verify with server**" is enough.
- **What you expected and what happened**, with the exact text of any message.
- **Screenshots**, especially of the **Trace** tab with the relevant evaluation expanded, so the changed fields and the rules that fired are visible. For a rule result, a screenshot of the **Rules** tab or of the program rule details helps too.
- **Browser** and its version.

## What you'll see

GitHub creates the issue with a `[Problem]:` or `[Suggestion]:` title prefix. Maintainers may ask you for more details in the issue, so keep an eye on your GitHub notifications.

## Related pages

- [Troubleshooting and FAQ](./troubleshooting-and-faq.md)
- [Find out why a rule did or didn't fire](../using-the-app/find-out-why-a-rule-did-or-didnt-fire.md)
- [Release notes](./release-notes.md)
