---
title: 'Troubleshooting and FAQ'
description: 'Fixes for common problems: organisation units, programs that do not open, Verify with server errors, missing authorities, and known limitations.'
sidebar_position: 1
---

# Troubleshooting and FAQ

Find the message or the symptom you see, then follow the fix. For the full list of messages the app shows, see [Messages and errors](../reference/messages-and-errors.md).

## Organisation units

### "No organisation units available"

The program has no organisation units assigned. The app checks only the program's own assignment, and it does not show the forms at all in this case.

To fix it, assign at least one organisation unit to the program in the Maintenance app (DHIS2 2.40 to 2.42) or in Metadata Management (DHIS2 2.43), then reload the app.

### "Could not load organisation units"

The full message is "The organisation units for this program could not be loaded for data entry." The app could not read your own organisation units or the program's organisation units from the server, and it does not show the forms.

Reload the page. If it keeps happening, check that you are still logged in to DHIS2 and that the server is reachable. If the problem continues, [report a bug](./report-a-bug.md).

### The organisation unit tree is empty

**Known issue.** If your user's organisation units are below national level, for example a district or a facility, the **Select organisation unit** dialog shows an empty tree, even when you search. Only the text "Only organisation units assigned to this program can be selected." is shown. Users with a national-level organisation unit are not affected.

Without an organisation unit you cannot use **Verify with server**. Everything else still works: you can fill in the forms, watch the rules, use **Validate form**, **Preview server effects** and **Preview on-complete effects**.

A fix is planned. Until it ships, use a DHIS2 user whose organisation unit is at national level (the top level of the hierarchy) when you need **Verify with server**. `TODO(verify)`: any other workaround, for example assigning the user's own organisation unit to the program.

### "Required to verify or save" under the organisation unit

You selected **Validate form**, **Verify with server**, **Preview server effects** or **Preview on-complete effects** before choosing an organisation unit. The message is a reminder, nothing is saved. Only **Verify with server** actually needs the organisation unit, and without one it fails with "Could not verify with server" and "Select an organisation unit before saving or verifying".

Use the **Select** button next to **Organisation unit** in the context bar and pick an organisation unit. See [Set the organisation unit and date](../using-the-app/set-the-org-unit-and-date.md).

## Programs

### A program is missing from the list

The program list shows only the programs you can read. If you do not have metadata read access to a program, it is left out without any message. Ask an administrator to share the program with you (metadata: can view).

### "Program not found"

The app could not find the program, or you do not have metadata read access to it. This also happens when you open a link to a program that was deleted or that is shared with other users only.

Select **Back to programs**, search for the program, and open it from the list. If it is not in the list, see the previous question.

### "Could not load this program. Try again later."

The program metadata request failed for another reason, for example a network problem or a server error. Reload the page. If it keeps happening, [report a bug](./report-a-bug.md) and include the time it happened.

## Verify with server

### "Could not verify with server"

The dry run did not return a validation report. The message under it says why:

- "Select an organisation unit before saving or verifying": select an organisation unit in the context bar and try again.
- A message from DHIS2: the server rejected the request. Check that you are still logged in.
- "An unexpected error occurred": the request failed without a message. Try again, and [report a bug](./report-a-bug.md) if it keeps happening.

Nothing is retried automatically. Select **Verify with server** again to rerun it.

### "Server check found issues" with an error code

Errors that are not produced by a program rule are listed under **Other import errors**, each with its DHIS2 error code. The common ones are about your access, not about the rules:

| Code | What it means | What to do |
| --- | --- | --- |
| `E1000` | The organisation unit you selected is not in your data capture organisation units. | Pick an organisation unit you can capture data for, or ask an administrator to add it to your user's data capture organisation units. |
| `E1091` | You cannot write data for this program. | Ask an administrator to give you data write access to the program (data: can capture). |
| `E1095` | You cannot write data for this program stage. | Ask for data write access to the program stage. |
| `E1001` | You cannot write data for the tracked entity type (tracker programs). | Ask for data write access to the tracked entity type. |
| `E1029`, `E1041` | The organisation unit you selected is not assigned to the program. | Pick an organisation unit that is assigned to the program. Unassigned parents in the tree are greyed out and cannot be selected. |
| `E1096`, `E1104` | You have no data read access that the import needs. | Ask an administrator for data read access to the program and, for tracker programs, to the tracked entity type. |
| `E1099` | You cannot write data for the category option. | Ask an administrator to give you data write access to the category option, usually the default one. |

Your user needs no special authority for **Verify with server**, only these sharing and organisation unit settings. See [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md).

:::note

These results were checked on DHIS2 2.43.2. `E1000`, `E1029` and `E1041` were observed. `E1091`, `E1095`, `E1001`, `E1096`, `E1104` and `E1099` are the messages DHIS2 2.43 defines for these cases and were not reproduced. `TODO(verify)`: the codes on DHIS2 2.40 to 2.42.

:::

## Access to the app

### The app is not in the apps menu, or you see "Unable to find an app for this URL"

Your user role does not include the app. DHIS2 shows "Something went wrong" with "Unable to find an app for this URL." and a **Return to home page** link.

Ask an administrator to add the Program Rules Playground app to one of your user roles, in the Users app under **Apps**. The authority is expected to be named `M_programrulesplayground`. `TODO(verify)`: the authority name after installing the app. Users with the `ALL` authority always see the app.

### "Edit in Metadata Management app" opens "Unable to find an app for this URL"

The rule details dialog links to the app where you edit program rules. On DHIS2 2.43 that is Metadata Management, on 2.40 to 2.42 the Maintenance app. If your role does not include that app, DHIS2 shows the same "Unable to find an app for this URL." page. Ask for access to the app, and for the program rule authorities if you also need to edit rules there. See [Open and edit a rule](../using-the-app/open-and-edit-a-rule.md).

## Known limitations

### A HIDEPROGRAMSTAGE rule has no visible effect

The app does not hide program stages. When a **HIDEPROGRAMSTAGE** rule fires, it appears in the **Rules**, **Trace** and **Graph** tabs, but the stage stays in the rail and you can still open it. Use the **Trace** tab to check that the rule fires.

### A warning or error does not show the value from the rule

For **SHOWWARNING**, **SHOWERROR**, **WARNINGONCOMPLETE** and **ERRORONCOMPLETE** on a field, the text under the field shows only the rule action's static text. The evaluated value from the action's data expression is not added. For example, a rule with the text "Number exceeds 100: " and the value of the field as data shows "Number exceeds 100:" without the number. On-complete messages that are not attached to a field do include the value in the completion banner.

## FAQ

### Does the app save anything?

Not from version 0.1.0-alpha.10. From that version, the only request that sends form data is **Verify with server**, which uses `importMode=VALIDATE`, a dry run, apart from files chosen in file or image fields, which upload at once. Versions 0.1.0-alpha.9 and earlier save real data when you select **Save event** or **Register tracked entity**, so upgrade if you still run one. See [Is it safe on production?](../introduction/is-it-safe-on-production.md).

### Why is a rule firing but labelled "Out of scope"?

In a tracker program, rules without a program stage belong to the enrollment, but they are also evaluated in stage forms. The stage form's **Rules** tab labels them **Out of scope** even when they fire. See [Why client and server results differ](../concepts/why-client-and-server-results-differ.md).

### Why does a notification stay "Simulated" after Verify with server?

The dry run does not report notifications, so the app cannot confirm them. See [Why client and server results differ](../concepts/why-client-and-server-results-differ.md).

## Related pages

- [Messages and errors](../reference/messages-and-errors.md)
- [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md)
- [Report a bug](./report-a-bug.md)
