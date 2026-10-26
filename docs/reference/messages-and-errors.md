---
title: 'Messages and errors'
description: 'Lists the errors, warnings, empty states and key notices the app shows, grouped by screen, with what each means and what to do.'
sidebar_position: 5
---

# Messages and errors

This page lists the messages the app shows, grouped by screen. Each entry gives the text exactly as the app shows it, where it appears, what it means and what to do. "Kind" is **Error**, **Warning**, **Empty** (nothing to show yet) or **Info**.

Messages that contain a value the app fills in are shown in code formatting, where `{rule}`, `{stage}`, `{n}` and similar stand for that value. For problems with access and setup, also see [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

Some messages say "save". The playground saves no form data: **Verify with server** is a dry run. The wording comes from the app.

## Program list

### "No programs found. Try adjusting your search or filter."

- **Kind:** Empty
- **Where you see it:** in the program table.
- **What it means:** no program you can read matches the search term and the **All** / **Tracker** / **Event** switch.
- **What to do:** clear the search or choose **All**. If a program you expect is still missing, you may not have metadata read access to it. See [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

### "Error" / "Error loading programs"

- **Kind:** Error
- **Where you see it:** a notice above the program table.
- **What it means:** the request for the program list failed.
- **What to do:** reload the page and check that you are still logged in to DHIS2.

## Opening a program

### "Program not found"

- **Kind:** Error
- **Where you see it:** a notice titled "Error", with a **Back to programs** link, instead of the playground.
- **What it means:** the program doesn't exist, or you don't have metadata read access to it.
- **What to do:** select **Back to programs** and open the program from the list. See [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

### "Could not load this program. Try again later."

- **Kind:** Error
- **Where you see it:** a notice titled "Error", instead of the playground.
- **What it means:** the program metadata request failed for another reason, such as a network or server error.
- **What to do:** reload the page. If it keeps happening, [report a bug](../help/report-a-bug.md).

### "No organisation units available"

- **Kind:** Info
- **Where you see it:** under the context bar. The forms are not shown. The body reads "This program has no organisation units assigned, or none are accessible to the current user."
- **What it means:** the program has no organisation units assigned.
- **What to do:** assign at least one organisation unit to the program, then reload. See [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

### "Could not load organisation units"

- **Kind:** Error
- **Where you see it:** under the context bar. The forms are not shown. The body reads "The organisation units for this program could not be loaded for data entry."
- **What it means:** the app could not read your organisation units or the program's organisation units.
- **What to do:** reload the page. See [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

## Context bar and organisation unit dialog

### "Required to verify or save"

- **Kind:** Error
- **Where you see it:** under **Organisation unit** in the context bar.
- **What it means:** you selected **Validate form**, **Verify with server**, **Preview server effects** or **Preview on-complete effects** with no organisation unit. It is a reminder. Only **Verify with server** needs the organisation unit; the others still run.
- **What to do:** select an organisation unit before you use **Verify with server**. See [Set the organisation unit and date](../using-the-app/set-the-org-unit-and-date.md).

### "Only organisation units assigned to this program can be selected."

- **Kind:** Info
- **Where you see it:** in the **Select organisation unit** dialog.
- **What it means:** the tree shows your organisation units, but you can only pick the ones assigned to the program.
- **What to do:** pick an organisation unit that isn't greyed out. If the tree is empty apart from this text, see the known issue in [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

### "Not assigned to this program"

- **Kind:** Info
- **Where you see it:** the tooltip on a greyed-out organisation unit in the tree.
- **What it means:** the organisation unit is shown so you can reach the ones under it, but it isn't assigned to the program. Selecting it does nothing.
- **What to do:** open it and pick an assigned organisation unit below it.

### "No matching organisation units"

- **Kind:** Empty
- **Where you see it:** in the **Select organisation unit** dialog, in place of the tree.
- **What it means:** no organisation unit assigned to the program has a name that contains your search term.
- **What to do:** shorten or change the search term.

## Forms

### "Could not load enrollment form"

- **Kind:** Error
- **Where you see it:** in place of the Enrollment form of a tracker program. The body reads "The tracker program metadata could not be loaded."
- **What it means:** the request for the program's attributes and sections failed.
- **What to do:** reload the page. If it keeps happening, [report a bug](../help/report-a-bug.md).

### "No attributes configured"

- **Kind:** Empty
- **Where you see it:** in place of the Enrollment form. The body reads "This tracker program does not expose any tracked entity attributes to capture."
- **What it means:** the program has no tracked entity attributes.
- **What to do:** add attributes to the program if you want to test enrollment rules.

### "This program stage does not have a form to render."

- **Kind:** Empty
- **Where you see it:** in the form area of a stage.
- **What it means:** the app could not find the stage's metadata.
- **What to do:** check that the stage exists and that you can read it. A stage you have no metadata read access to is left out of the program metadata, so it also causes this message.

### "No events yet"

- **Kind:** Empty
- **Where you see it:** under a repeatable stage in the **Enrollment** rail.
- **What it means:** you haven't added an event to this stage. Selecting the stage row does nothing yet.
- **What to do:** select **Add event**. See [Work with repeatable stages](../using-the-app/work-with-repeatable-stages.md).

### `Hidden by {rule}` and `Section hidden by {rule}`

- **Kind:** Info
- **Where you see it:** a dashed placeholder where a rule hid a field or a section, while **Show hidden fields** is on. If the app can't name the rule, it says "a rule".
- **What it means:** the named rule hid the field or section.
- **What to do:** nothing. Turn off **Show hidden fields** to leave hidden fields out. See [Read field badges and hidden-field placeholders](../using-the-app/read-field-badges-and-hidden-field-placeholders.md).

### `On complete: {message}`

- **Kind:** Info
- **Where you see it:** a dashed note under a field while the form is in completed status.
- **What it means:** an on-complete rule has a message for this field.
- **What to do:** see [Test on-complete rules](../using-the-app/test-on-complete-rules.md).

### "Warning" and "Error" under a field

- **Kind:** Warning, Error
- **Where you see it:** under a field.
- **What it means:** a **SHOWWARNING** or **SHOWERROR** rule fired but its action has no text, so the app shows the plain word. When the action has text, the app shows that text instead, without the evaluated data part.
- **What to do:** add text to the rule action if you want a clearer message.

### "This field is required"

- **Kind:** Error
- **Where you see it:** under the incident date at the top of the Enrollment form, when the program shows one and it is empty. It also appears in the completion banner, see below.
- **What it means:** the field is required and empty.
- **What to do:** fill it in.

### File and image fields

Choosing a file in a file or image field uploads it to the server straight away, as an unassigned file resource. This is the one request besides the dry run that stores something on the server. The upload messages come from the field widget, not from the app. When an upload fails, the field shows the error message from the upload, or "Upload failed" when there is none.

## Feedback and Indicators sidebar

### "No feedback rules are firing in this form." and "No indicator rules are firing in this form."

- **Kind:** Empty
- **Where you see it:** in the **Feedback** and **Indicators** cards.
- **What it means:** no **DISPLAYTEXT** or **DISPLAYKEYVALUEPAIR** rule for that card is firing with the current values.
- **What to do:** change values so the rule's condition is true, or check the rule in the **Rules** tab. See [Read the Feedback and Indicators sidebar](../using-the-app/read-the-feedback-and-indicators-sidebar.md).

## Validate form

These notices appear above the form buttons. See [Validate a form](../using-the-app/validate-a-form.md).

### "Form is valid"

- **Kind:** Info
- **Where you see it:** with the body "No validation issues were found."
- **What it means:** every field passed its checks.
- **What to do:** nothing.

### "Form has issues"

- **Kind:** Error
- **Where you see it:** with a list of field names, each a link to the field.
- **What it means:** one or more fields failed a metadata check: value type, compulsory, options or bounds. Fields that a rule hid are checked too. Rule errors and empty fields that a rule made mandatory are not counted.
- **What to do:** select each field name, fix the value and select **Validate form** again.

### "Could not validate the form"

- **Kind:** Error
- **Where you see it:** with the error message as the body.
- **What it means:** the check itself failed.
- **What to do:** try again. If it keeps happening, [report a bug](../help/report-a-bug.md) with the message.

## Verify with server

These notices appear above the form buttons. See [Check rules against the server](../using-the-app/check-rules-against-the-server.md).

### "Server check passed"

- **Kind:** Info
- **Where you see it:** with the body "Server found no rule errors or warnings."
- **What it means:** the dry run found no rule errors, rule warnings or other import errors.
- **What to do:** nothing.

### "Server check found issues"

- **Kind:** Error
- **Where you see it:** with either "The affected fields are highlighted in the form." or a list of "field: message" lines and **Other import errors**.
- **What it means:** the server's rules or validation rejected something. Rule errors on visible fields are shown on those fields. Warnings and results without a visible field are listed in the notice.
- **What to do:** compare with what the playground shows. See [Why client and server results differ](../concepts/why-client-and-server-results-differ.md).

### `Other import errors ({n})`

- **Kind:** Error
- **Where you see it:** a section inside **Server check found issues**, with one line and a DHIS2 error code per error.
- **What it means:** the server rejected the payload for a reason that is not a program rule, often your access.
- **What to do:** look up the code below.

The codes you are most likely to see are about access and setup. [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) explains each one and how to fix it:

| Code | In short | See |
| --- | --- | --- |
| `E1000` | No capture access to the selected organisation unit. | [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) |
| `E1091`, `E1095`, `E1001` | No data write access to the program, the program stage or the tracked entity type. | [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) |
| `E1096`, `E1104` | No data read access. | [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) |
| `E1099` | No write access to the category option. | [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) |
| `E1029`, `E1041` | The selected organisation unit is not assigned to the program. | [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md) |

A stage form in a tracker program sends its event without the tracked entity or enrollment, so the server may report other import errors that are not about your rules. `TODO(verify)`: the codes for that case.

### "Could not verify with server"

- **Kind:** Error
- **Where you see it:** with one of these bodies:
  - "Select an organisation unit before saving or verifying": you have no organisation unit selected. Select one in the context bar.
  - "The form values could not be validated before saving": the app could not build the dry run from the form values. This happens when a field holds a value the dry run can't carry, such as a list of values or a file from a multi-select or file field, or coordinates, or when the event date or enrollment date is missing.
  - "An unexpected error occurred": the request failed without a message.
  - Any other text is the message from DHIS2, for example after your session expired.
- **What it means:** the dry run did not complete, so there is no new result.
- **What to do:** fix the cause and select **Verify with server** again. See [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md).

## Completion banner

The banner appears above the form buttons after **Preview on-complete effects**. See [Test on-complete rules](../using-the-app/test-on-complete-rules.md).

### "Cannot complete this event yet"

- **Kind:** Error
- **Where you see it:** with a list of "Error:" and "Required:" lines, and **Back to editing**.
- **What it means:** an **ERRORONCOMPLETE** rule fired, or a required field is empty. A data entry app would not let you complete the event.
- **What to do:** select each field name and fix the value. The banner updates as you go and disappears when nothing is left.

### "Review before completing"

- **Kind:** Warning
- **Where you see it:** with a list of "Warning:" lines, **Back to editing** and **Complete anyway**.
- **What it means:** only **WARNINGONCOMPLETE** rules fired. A data entry app would let you complete the event after the warning.
- **What to do:** select **Complete anyway** to see the server effects for a completed event, or **Back to editing**.

### `Required: {field} – This field is required`

- **Kind:** Error
- **Where you see it:** a line in the completion banner.
- **What it means:** a visible field that is required, by metadata or by a rule, is empty.
- **What to do:** fill in the field.

## Server effects dialog

See [Preview server effects](../using-the-app/preview-server-effects.md) and [Provenance tags](./provenance-tags.md).

### "Loading server-side actions…"

- **Kind:** Info
- **Where you see it:** while the dialog opens.
- **What it means:** the app is reading the program's server-side rule actions and notification templates.
- **What to do:** wait.

### "Could not load server-side actions"

- **Kind:** Error
- **Where you see it:** in the dialog.
- **What it means:** the request for the rule actions or notification templates failed.
- **What to do:** close the dialog and open it again. If it keeps happening, [report a bug](../help/report-a-bug.md).

### "No server-side rule effects fired."

- **Kind:** Empty
- **Where you see it:** in the dialog.
- **What it means:** no notification or event rule fired in the latest evaluation, and the last dry run reported no rule results.
- **What to do:** change values so the rule you want to test fires.

### "Notification template not found for this action."

- **Kind:** Warning
- **Where you see it:** in a notification row.
- **What it means:** the rule action has no notification template, or the template could not be found.
- **What to do:** check the template on the rule action.

### "Invalid date, server will skip"

- **Kind:** Warning
- **Where you see it:** next to **Scheduled for** in a **SCHEDULEMESSAGE** row.
- **What it means:** the rule's date expression did not give a valid `yyyy-MM-dd` date, so the server would not schedule the message.
- **What to do:** fix the date expression in the rule action.

### `Not executed by this server` and `Not executed by this server (requires 2.{n})`

- **Kind:** Warning
- **Where you see it:** on a dashed, dimmed row.
- **What it means:** the server you are connected to does not run this action type.
- **What to do:** treat the row as reference only. See [Provenance tags](./provenance-tags.md).

### "Use Verify with server on the form to compare against the server."

- **Kind:** Info
- **Where you see it:** in the dialog footer, before any dry run.
- **What it means:** every row is **Simulated**, because there is no server result yet.
- **What to do:** close the dialog and select **Verify with server**.

### "The dry run doesn't report notifications, so notification rows stay Simulated."

- **Kind:** Info
- **Where you see it:** in the dialog footer, after a dry run.
- **What it means:** notification rows can't be confirmed by the server.
- **What to do:** nothing.

## Rules panel

### "No program rules match this view."

- **Kind:** Empty
- **Where you see it:** in the **Rules** tab.
- **What it means:** no rule matches the current view, for example no rule is in scope for this form.
- **What to do:** select **All** to see every rule of the program. In an event program every rule is always shown.

### "No rules observed yet"

- **Kind:** Empty
- **Where you see it:** in the **Trace** tab. The body reads "Interact with the form to record rule evaluations. Only rules that have fired at least once appear here."
- **What it means:** the app hasn't recorded any rule evaluation for this form.
- **What to do:** enter a value in the form. See [Find out why a rule did or didn't fire](../using-the-app/find-out-why-a-rule-did-or-didnt-fire.md).

### "No rules fired"

- **Kind:** Empty
- **Where you see it:** inside an expanded **Trace** entry.
- **What it means:** no rule produced an effect in that evaluation.
- **What to do:** nothing, unless you expected a rule to fire. Then check its condition.

### "No rule relationships yet"

- **Kind:** Empty
- **Where you see it:** in the **Graph** tab, with the body "Interact with the form to build the dependency graph. Only rules active in the latest evaluation are shown. Select a trace entry to inspect a past evaluation. Connections flow Field → Rule → Target (read / effect)."
- **What it means:** the latest evaluation, or the one you selected, has no firing rules.
- **What to do:** enter values so a rule fires. See [Map rule dependencies](../using-the-app/map-rule-dependencies.md).

### `Applies to enrollment` and `Applies to {stage}`

- **Kind:** Info
- **Where you see it:** on an **Out of scope** rule card.
- **What it means:** the rule belongs to the Enrollment form or to the named stage, not to the form you have open. In a stage form, rules with no stage show here even when they fire.
- **What to do:** open that form to see the rule in scope.

## Program rule details dialog

See [Open and edit a rule](../using-the-app/open-and-edit-a-rule.md).

### `Could not load this rule: {message}`

- **Kind:** Error
- **Where you see it:** in the dialog body.
- **What it means:** the request for the rule's details failed.
- **What to do:** close the dialog and try again.

### "Generating a plain-language description…"

- **Kind:** Info
- **Where you see it:** under the rule condition.
- **What it means:** the server is writing a plain-language reading of the condition. This request saves nothing.
- **What to do:** wait. The result appears in a box titled "Description".

### `Could not describe this expression: {message}`

- **Kind:** Warning
- **Where you see it:** under the rule condition.
- **What it means:** the server returned an error for the condition. The message says why.
- **What to do:** check the condition in the rule editor.

### "Could not load a plain-language description for this condition. The raw expression is shown above."

- **Kind:** Warning
- **Where you see it:** under the rule condition.
- **What it means:** the description request failed, for example because of a network problem.
- **What to do:** read the raw condition shown above it.

### "Read-only view."

- **Kind:** Info
- **Where you see it:** in the dialog footer, next to the **Edit in Metadata Management app** (DHIS2 2.43) or **Edit in Maintenance app** (2.40 to 2.42) link.
- **What it means:** you can't change the rule here.
- **What to do:** use the link to edit the rule in DHIS2.

## Related pages

- [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md)
- [Screens and controls](./screens-and-controls.md)
- [Glossary](./glossary.md)
