---
title: 'Glossary'
description: 'Definitions of the terms used in Program Rules Playground and in this documentation.'
sidebar_position: 6
---

# Glossary

Terms are listed in the order you meet them. Entries marked `TODO(verify)` still need to be confirmed against the app.

:::info Draft

Definitions are short on purpose. Fuller explanations will move to the Concepts and Reference pages.

:::

## Program rules

### program rule

A DHIS2 metadata rule that checks a condition against the values in a form and runs one or more rule actions when the condition is true. The app evaluates program rules live as you fill in a form.

### rule action

What a program rule does when it runs, for example hiding or showing a field or section, assigning a value, making a field mandatory, or showing a warning, an error, a feedback message or an indicator message.

### firing

A rule that is firing has a condition that evaluates to true for the form you have open, so its actions take effect. The **Rules** tab marks such rules as **Firing** and the others as **Idle**. `TODO(verify)`: exact condition for "firing" when a rule has several actions.

### in scope

A rule that applies to the form you have open. The **Rules** tab can filter to **In scope** rules. `TODO(verify)`: how scope is determined for tracker programs (enrollment form versus stage forms).

### out of scope

A rule that does not apply to the form you have open. The **Rules** tab shows it with an **Out of scope** label. `TODO(verify)`: how scope is determined for tracker programs.

## What you see on a form

### effect badge

A badge on a field that shows what a rule is doing to it, for example **Hidden**, **Shown**, **Assigned**, **Required by rule**, **Warning**, **Error** or an **On complete** effect.

### hidden-field placeholders

Dashed placeholders that mark where a rule hid a field or section. Use **Show hidden fields** to turn them on, and each placeholder names the rule that hid it ("Hidden by" followed by the rule name).

### Feedback

A card in the sidebar that lists the feedback messages produced by rules that are firing in the form. Each item links to the rule that produced it.

### Indicators

A card in the sidebar that lists the indicator values produced by rules that are firing in the form. Each item links to the rule that produced it.

### enrollment

In a tracker program, the enrollment of a tracked entity in the program. The app shows it as the **Enrollment** rail that holds the enrollment form and the stage forms, and uses the enrollment date as the date that rules evaluate against.

### Enrollment form

The rail row that opens the form for the enrollment itself, where you enter tracked entity attributes. Stage forms are listed below it.

## The rules panel

### Rules tab

The rules panel tab that lists the rule catalogue for the program, with a filter for **In scope** or all rules and a status for each rule.

### Trace tab

The rules panel tab that logs each rule evaluation, so you can see which fields changed and which rules fired.

### Graph tab

The rules panel tab that shows a dependency graph of the rules, and can open full screen.

## Checking against the server

### Validate form

A form action that checks the form and reports **Form is valid** or **Form has issues**. `TODO(verify)`: what exactly it validates and whether it calls the server.

### Verify with server

A form action that sends your input to the server as a dry run and reports whether the server found rule errors or warnings. Nothing is stored.

### dry run

A tracker import with `importMode=VALIDATE`. The server checks the payload and discards it, so no data is saved. It is the only write call the app makes.

### Preview server effects

A form action that opens a read-only summary of what the server would do for your input, such as notifications and scheduled events. It does not post anything.

### Preview on-complete effects

The same read-only summary, for the effects of rules that run when you complete the form.

### completion pass

The check the app runs when you complete a form. It shows either **Cannot complete this event yet** or **Review before completing**, with **Back to editing** and **Complete anyway** as choices in the review case. `TODO(verify)`: which rules run in a completion pass and when each dialog appears.

## Provenance tags

### Simulated

A tag on a server effect row that the app worked out itself, rather than one reported by the server. For example, the dry run does not report notifications, so notification rows stay **Simulated**.

### Server only

A tag on a server effect row that the server reported. `TODO(verify)`: whether this means the app's own evaluation did not produce it.

### Not executed by this server

A message on an effect row for an action that the server you are connected to does not run. Some rows add the DHIS2 version that is required, for example "requires 2.43".
