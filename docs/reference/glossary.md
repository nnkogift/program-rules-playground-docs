---
title: 'Glossary'
description: 'Definitions of the terms used in Program Rules Playground and in this documentation.'
sidebar_position: 6
---

# Glossary

Terms are listed in the order you meet them. Definitions are short on purpose. Follow the links for the full explanation.

## Program rules

### program rule

A DHIS2 metadata rule that checks a condition against the values in a form and runs one or more rule actions when the condition is true. The app evaluates program rules live as you fill in a form.

### rule action

What a program rule does when it runs, for example hiding or showing a field or section, assigning a value, making a field mandatory, or showing a warning, an error, a feedback message or an indicator message. See [Rule action types](./rule-action-types.md).

### firing

A rule is firing when it produced at least one effect in the latest evaluation of the form you have open. The **Rules** tab marks such rules as **Firing** and the others as **Idle** or **Out of scope**, and sorts firing rules to the top.

### in scope

A rule that belongs to the form you have open. On the Enrollment form, the rules with no program stage are in scope. On a stage form, the rules of that stage are in scope. In an event program every rule is in scope. In a tracker program, the **Rules** tab has an **In scope** / **All** switch.

### out of scope

A rule that belongs to another form. The **Rules** tab shows it with an **Out of scope** label and a caption such as "Applies to enrollment". Rules with no program stage also run in stage forms, so they can fire there while still labelled **Out of scope**.

## What you see on a form

### context bar

The bar at the top of the playground, with the **Programs** back link, the program name, **Organisation unit**, the **Event date** or **Enrollment date**, and **Reset playground**. See [Set the organisation unit and date](../using-the-app/set-the-org-unit-and-date.md).

### effect badge

A badge next to a field label that shows what a rule is doing to the field: **Hidden**, **Shown**, **Assigned**, **Required by rule**, **Warning**, **Error**, **On complete: warning** or **On complete: error**. A field shows one badge, for the last effect on it. See the [Effect badges legend](./effect-badges-legend.md).

### hidden-field placeholder

A dashed placeholder that marks where a rule hid a field ("Hidden by" followed by the rule name) or a section ("Section hidden by" followed by the rule name). The **Show hidden fields** button turns placeholders on and off. It is on when you open a form. When it is off, hidden fields and sections are left out of the form.

### Show hidden fields

The button above the fields that turns hidden-field placeholders on and off. Its label doesn't change: it is teal when on and grey when off.

### Feedback

A card in the sidebar that lists the feedback messages produced by firing **DISPLAYTEXT** and **DISPLAYKEYVALUEPAIR** rules. Each item names the action type and the rule that produced it. The items are not links.

### Indicators

A card in the sidebar that lists the values produced by firing **DISPLAYTEXT** and **DISPLAYKEYVALUEPAIR** rules whose location is the indicators widget. Each item names the action type and the rule that produced it. The items are not links.

### enrollment

In a tracker program, the enrollment of a tracked entity in the program. The app shows it as the **Enrollment** rail, which holds the Enrollment form and the stage forms. The **Enrollment date** in the context bar is the enrollment date the rules use. Events in stage forms always use today's date.

### Enrollment form

The first row of the **Enrollment** rail. It opens the form for the enrollment itself, where you enter tracked entity attributes. The stage forms are listed below it.

## The rules panel

### Rules tab

The rules panel tab that lists the program's rules, each with its status (**Firing**, **Idle** or **Out of scope**). In a tracker program, the **In scope** / **All** switch in the panel header chooses which rules it lists.

### Trace tab

The rules panel tab that logs each rule evaluation, newest first, with the fields that changed and the rules that fired.

### Graph tab

The rules panel tab that shows a dependency graph of the latest evaluation, from fields to rules to the things the rules change. It can open full screen.

## Checking against the server

### Validate form

A form action that checks the values of every field, including fields a rule hid, against the field's metadata (value type, compulsory, options and bounds) in your browser, and reports **Form is valid** or **Form has issues**. It doesn't count rule errors or fields a rule made mandatory, and it doesn't contact the server. See [Validate a form](../using-the-app/validate-a-form.md).

### Verify with server

A form action that sends the form to the server as a dry run and reports whether the server found rule errors, rule warnings or other import errors. Nothing is stored. It is the only form action that needs an organisation unit. See [Check rules against the server](../using-the-app/check-rules-against-the-server.md).

### dry run

A tracker import with `importMode=VALIDATE`, sent by **Verify with server**. The server runs its rules and checks the payload, then discards it, so no form data is saved. (Choosing a file in a file or image field is different: it uploads the file to the server straight away.)

### Preview server effects

A form action that opens the **Server effects** dialog for the form as it is. It doesn't send anything. See [Preview server effects](../using-the-app/preview-server-effects.md).

### Preview on-complete effects

A form action on event forms that runs the completion pass, then opens the **Server effects** dialog for a completed event. See [Test on-complete rules](../using-the-app/test-on-complete-rules.md).

### Server effects dialog

The read-only dialog, titled **Server effects**, that lists the notifications and events the server would create from your rules, and the rule results of the last dry run. Each row has a provenance tag. It has no save button.

### completion pass

The check that **Preview on-complete effects** runs. It sets the form to completed, lets the rules run again, and collects **ERRORONCOMPLETE** errors, empty required fields and **WARNINGONCOMPLETE** warnings. If it finds errors or empty required fields, the banner reads **Cannot complete this event yet** and offers **Back to editing**. If it finds only warnings, it reads **Review before completing** and also offers **Complete anyway**. If it finds nothing, the **Server effects** dialog opens straight away.

## Provenance tags

### provenance tag

The tag on a row of the **Server effects** dialog that says where the row comes from: your browser, the server's dry run, or both. See [Provenance tags](./provenance-tags.md).

### Simulated

The row comes from the rules the app ran in your browser, and there is no server result to compare it with. The dry run doesn't report notifications, so notification rows stay **Simulated**.

### Server-verified

Both your browser and the server's dry run produced the row.

### Server only

The server's dry run reported the row, but the app didn't produce it in your browser.

### Not executed by this server

A note on a dashed, dimmed row for an action that the server you are connected to doesn't run. Some rows add the version that is required, "Not executed by this server (requires 2.43)".
