---
title: 'Is it safe to use on production?'
description: 'Explains why the app can be used against a production server: no data or metadata is saved, the only data check is a tracker dry run, and files chosen in file fields are uploaded as unused file resources.'
sidebar_position: 2
---

# Is it safe to use on production?

Yes. Program Rules Playground never saves tracker data, events, enrollments or metadata on your DHIS2 server, and it never sends notifications. You can open any program, type any values and press any button without creating, changing or deleting records.

The one exception is a file you choose in a file or image field. See [File and image fields](#file-and-image-fields).

This page explains why, and lists every request the app sends.

## The short version

- The forms in the app have no save button. Your values live only in your browser tab and are gone when you reload, leave the page or select **Reset playground**.
- **Verify with server** asks the server to check your values as a dry run. The server validates them and throws them away. Nothing is stored and no notifications are sent.
- **Preview server effects** and **Preview on-complete effects** open the **Server effects** dialog. It is read-only and only reads metadata.
- When you open a rule's details, the app asks the server for a plain-language reading of the rule condition. This saves nothing.
- If you choose a file in a file or image field, the app uploads that file to the server as an unused file resource.

## What each action sends

| What you do | What the app asks the server | Does it change anything? |
| --- | --- | --- |
| Open the app and the program list | Reads the list of programs you can see. | No |
| Open a program | Reads the program, its stages, data elements, tracked entity attributes, option sets, program rules, program rule variables and constants. Also reads your user's organisation units, user groups and user roles, which the rules can use. | No |
| Open a program whose rules hide or show option groups | Reads those option groups. | No |
| Select an organisation unit | Reads the organisation units assigned to the program and the organisation unit tree. | No |
| Type values, switch forms, add events in a repeatable stage | Nothing. Rules run in your browser. | No |
| **Validate form** | Nothing. The check runs in your browser. | No |
| **Verify with server** | Sends your values as a tracker import in validate-only mode: `POST /api/tracker?importMode=VALIDATE&async=false`. | No, see below |
| **Preview server effects** or **Preview on-complete effects** | Reads the server-side rule actions of the program and the notification templates they use. | No |
| Open a rule's details | Reads that program rule. | No |
| The plain-language condition in the rule details | Sends the condition text to `POST /api/programRules/condition/description`. The server returns a readable description. | No |
| Choose a file in a file or image field | Uploads the file straight away: `POST /api/fileResources`. | Yes, the server stores the file as a file resource that no record uses |
| **Edit in Maintenance app** or **Edit in Metadata Management app** | Nothing. It opens the rule in that app in a new tab. | Only if you save there, in the other app |

The DHIS2 app platform also makes its usual start-up reads, such as the system information and your user settings.

## Why Verify with server saves nothing

**Verify with server** sends the same values a real save would send, but with `importMode=VALIDATE`. In this mode the DHIS2 tracker importer runs its checks, including the server-side program rules, reports what it found and discards the payload. No event, enrollment or tracked entity is created, and nothing is committed to the database. Because nothing is committed, no program notifications are sent.

The app sends the request with `async=false`, so the server answers straight away and no import job is left running on the server.

## Why the Server effects dialog saves nothing

The **Server effects** dialog lists what the server would do for your values, such as messages it would send or schedule. The app works this out in your browser from the rules that fired, the rule and template metadata it reads and, once you have run **Verify with server**, the dry-run report. It has no confirm or save button. Rows tagged **Simulated** were worked out by the app, not by the server. See [Provenance tags](../reference/provenance-tags.md).

## File and image fields

When you choose a file in a file or image field, the field uploads it to the server straight away, before you select any button. DHIS2 stores it as a file resource that is not attached to any event, enrollment or tracked entity, because the app never saves one. A scheduled DHIS2 job, **File resource clean up**, removes unused file resources. By default it runs every night at 02:00 server time; your administrator can check it in the **Scheduler** app.

:::note Use test files on production

Don't choose real or sensitive files in the app on a production server. Use a test file, or leave file and image fields empty.

:::

## Who can do what

The app adds no authorities of its own and cannot do more than the user who runs it. For example, if you can't capture data in the selected organisation unit, the server rejects the **Verify with server** dry run with the same kind of error a real import would get. See [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md).

## Related pages

- [Check rules against the server](../using-the-app/check-rules-against-the-server.md)
- [Preview server effects](../using-the-app/preview-server-effects.md)
- [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md)
- [Why client and server results differ](../concepts/why-client-and-server-results-differ.md)
