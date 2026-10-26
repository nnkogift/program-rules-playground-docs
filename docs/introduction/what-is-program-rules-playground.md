---
title: 'What is Program Rules Playground'
description: 'Program Rules Playground is a DHIS2 app for testing and debugging program rules against your real metadata, without saving any data.'
slug: /
sidebar_position: 1
---

# What is Program Rules Playground

Program Rules Playground is an open-source DHIS2 app for testing and debugging program rules.

You pick a program, fill in its forms against your real metadata, and watch the program rules run as you type. Fields hide, show, become mandatory or receive values, and the **Feedback** and **Indicators** cards list the messages your rules produce. A rules panel next to the form shows which rules fired, in what order, and which fields they read and changed.

The app supports DHIS2 2.40 to 2.43. From version 0.1.0-alpha.10 it saves nothing to your server. See [Is it safe to use on production?](./is-it-safe-on-production.md) for the details.

## Who it is for

### Program configurators and implementers

You are the main users. Use the app when you need to answer questions like these:

- "Why didn't my rule fire?" Fill in the form, then check the rule's status on the **Rules** tab and the evaluations on the **Trace** tab.
- "Does this rule do what I expect before we roll it out?" Try the values you care about, check the effects on each field, and compare the result with the server using **Verify with server**.

### DHIS2 administrators

You install the app, decide who can use it, and want to know that it is safe to point at a production server. Start with [Install](../getting-started/install.md), [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md) and [Is it safe to use on production?](./is-it-safe-on-production.md).

### Trainers

You can teach program rules with a live view. Change a value and the class sees the badge appear on the field, the rule move to the top of the **Rules** tab, and a new entry on the **Trace** tab. The [tutorials](../getting-started/tutorial-debug-your-first-event-program-rule.md) make a good lesson plan.

### Developers

The rule engine, form hooks and rules panel come from the open-source [dhis2-form-utils](https://github.com/nnkogift/dhis2-form-utils) libraries. Their documentation lives in that repository. This site only covers the app.

## What the app looks like

![An event form in Program Rules Playground. A hidden-field placeholder reads "Hidden by PRT-E01 HIDEFIELD when toggle is on", Number input shows a Warning badge, Assigned value (number x 2) shows an Assigned badge and Mandatory target shows a Required by rule badge. The Feedback and Indicators cards and the rules panel are on the right.](../using-the-app/img/event-form-badges.png)

What you see in the screenshot:

1. **Context bar** at the top: the program name, the **Organisation unit** and **Event date** fields, and **Reset playground**.
2. **Effect badges** next to the field labels, such as **Hidden**, **Warning**, **Assigned** and **Required by rule**. Each badge shows the last effect a rule had on that field.
3. **Hidden-field placeholders**, dashed boxes that read "Hidden by" followed by the rule name. Turn them on or off with **Show hidden fields**.
4. **Feedback** and **Indicators** cards, which list the text and values your rules display.
5. **Form actions** under the fields: **Validate form**, **Verify with server**, **Preview server effects** and **Preview on-complete effects**.
6. **Rules panel** on the right, with the **Rules**, **Trace** and **Graph** tabs.

## What you can do

- [Find and open a program](../using-the-app/find-and-open-a-program.md)
- [Set the organisation unit and date](../using-the-app/set-the-org-unit-and-date.md)
- [Read field badges and hidden-field placeholders](../using-the-app/read-field-badges-and-hidden-field-placeholders.md)
- [Read the Feedback and Indicators sidebar](../using-the-app/read-the-feedback-and-indicators-sidebar.md)
- [Find out why a rule did or didn't fire](../using-the-app/find-out-why-a-rule-did-or-didnt-fire.md)
- [Map rule dependencies](../using-the-app/map-rule-dependencies.md)
- [Open and edit a rule](../using-the-app/open-and-edit-a-rule.md)
- [Validate a form](../using-the-app/validate-a-form.md)
- [Check rules against the server](../using-the-app/check-rules-against-the-server.md)
- [Preview server effects](../using-the-app/preview-server-effects.md)
- [Test on-complete rules](../using-the-app/test-on-complete-rules.md)
- [Work with repeatable stages](../using-the-app/work-with-repeatable-stages.md)
- [Start over](../using-the-app/start-over.md)

## Where to go next

- [Install the app](../getting-started/install.md)
- [Tutorial: debug your first event program rule](../getting-started/tutorial-debug-your-first-event-program-rule.md)
- [Tutorial: tracker rules across enrollment and events](../getting-started/tutorial-tracker-rules-across-enrollment-and-events.md)
- [Check which DHIS2 versions are supported](./dhis2-version-compatibility.md)
- [Look up a term in the glossary](../reference/glossary.md)
