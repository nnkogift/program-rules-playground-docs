---
title: 'Requirements and user authorities'
description: 'Lists what your DHIS2 server and user accounts need to use the app: the app authority, sharing on programs, and capture organisation units.'
sidebar_position: 2
---

# Requirements and user authorities

This page lists what your DHIS2 server and your users need before they can use the app.

:::note Checked on DHIS2 2.43.2 only

The results on this page were checked on DHIS2 2.43.2. They have not been checked on 2.40, 2.41 or 2.42 yet.

:::

## Summary

- **Server:** DHIS2 2.40 to 2.43, with the app installed. See [Install](./install.md).
- **Authorities:** the app needs no authorities of its own inside the app. A user only needs the authority to open the installed app.
- **Everything else depends on sharing and organisation units:** which programs the user can read, which programs and stages they can capture data in, and which organisation units they can capture data for.

## Minimal user role

Create a role with one authority:

| Authority | Why |
| --- | --- |
| `M_programrulesplayground` | Opens the installed app. In the user role, it is listed under the apps. |

`M_programrulesplayground` is to be confirmed after installing the app. Check the name in the user role's app list on your server. Users with the "ALL" authority don't need it.

Then make sure each user also has:

- **Metadata read** sharing on the programs they should test, and on their program stages.
- For **Verify with server**: **data write** sharing on the program and its program stages, and for tracker programs also on the tracked entity type.
- For rules that hide or show option groups: **metadata read** sharing on those option groups.
- For **Verify with server**: a **data capture** organisation unit that is assigned to the program, or that is above one in the hierarchy.

Optional, for the rule editor link in the rule details:

- On 2.43, the authority to open the **Metadata Management** app (`M_dhis-web-metadata-management`).
- On 2.40 to 2.42, the authority to open the **Maintenance** app (`M_dhis-web-maintenance`).
- To edit and save rules there, the program rule authorities (`F_PROGRAM_RULE_ADD`, and `F_PROGRAM_RULE_DELETE` to delete rules) and metadata write sharing on the program.

## What each feature needs

| Feature | What the user needs | What they see if it's missing |
| --- | --- | --- |
| Open the app | `M_programrulesplayground` (to be confirmed), or "ALL" | DHIS2 shows "Something went wrong", "Unable to find an app for this URL." and **Return to home page**. The app is not in the apps menu. |
| See a program in the **Programs** list | Metadata read on the program | The program is missing from the list, with no message. |
| Open a program | Metadata read on the program and its stages | "Program not found", or "Could not load this program. Try again later." |
| Rules that hide or show option groups | Metadata read on the option groups | `TODO(verify)`: expected to fail silently, so the options are not hidden or shown. |
| Pick an organisation unit | Organisation units assigned to the program | "No organisation units available" when the program has none. Users whose organisation units are below national level see an empty tree, see the known issues in [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md). |
| **Validate form**, **Preview server effects**, **Preview on-complete effects**, the rules panel and rule details | Nothing beyond opening the program | These work for anyone who can open the program. |
| **Verify with server** | A capture organisation unit assigned to the program, data write on the program and its stages, and for tracker programs data write on the tracked entity type | "Server check found issues" with the server's message under **Other import errors**. For example, `E1000` when the organisation unit is outside the user's capture organisation units. |
| **Edit in Metadata Management app** (2.43) or **Edit in Maintenance app** (2.40 to 2.42) | The authority to open that app, and the program rule authorities to save changes there | The new tab shows "Unable to find an app for this URL." |

Program rules, program rule variables and notification templates are not shared separately on DHIS2 2.43. A user who can open a program can see all its rules.

### Which errors to expect from Verify with server

When sharing or organisation units are missing, the server reports it in the **Verify with server** result. The codes come from DHIS2 2.43.2. `E1000`, `E1029` and `E1041` were observed. The others are the messages DHIS2 2.43 defines for these cases and were not reproduced.

| Code | Cause |
| --- | --- |
| `E1000` | The selected organisation unit is outside your capture organisation units. |
| `E1029`, `E1041` | The selected organisation unit is not assigned to the program. |
| `E1091` | No data write access to the program. |
| `E1095` | No data write access to the program stage. |
| `E1001` | No data write access to the tracked entity type. |
| `E1096`, `E1104` | No data read access. |
| `E1099` | No write access to the category option. |

`TODO(verify)`: the authorities to edit expired periods (`F_EDIT_EXPIRED`) and to uncomplete events (`F_UNCOMPLETE_EVENT`) may affect **Verify with server** for some dates and statuses.

## Related pages

- [Install](./install.md)
- [Is it safe to use on production?](../introduction/is-it-safe-on-production.md)
- [Set the organisation unit and date](../using-the-app/set-the-org-unit-and-date.md)
- [Check rules against the server](../using-the-app/check-rules-against-the-server.md)
- [Troubleshooting and FAQ](../help/troubleshooting-and-faq.md)
