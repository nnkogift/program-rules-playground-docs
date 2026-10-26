---
title: 'DHIS2 version compatibility'
description: 'Lists the supported DHIS2 versions (2.40 to 2.43), which rule actions the app runs in the browser and which only the server runs, and what changes between versions.'
sidebar_position: 3
---

# DHIS2 version compatibility

Program Rules Playground supports DHIS2 **2.40, 2.41, 2.42 and 2.43**. The **About** page in the app, linked from the bottom of the program list, shows the same range under **Supported DHIS2**.

The app reads the version of the server you are connected to and adjusts two things: which rule actions the server is expected to run, and which app the rule editor link opens.

## Where each rule action runs

Some rule actions change the form, and the app runs them in your browser as you type. Others only take effect on the server, for example sending a message. The app does not run those in the browser. It lists them in the **Server effects** dialog instead, marked **Simulated**.

| Rule action | In the app (browser) | Server on 2.40 to 2.42 | Server on 2.43 |
| --- | --- | --- | --- |
| HIDEFIELD, SHOWFIELD, HIDESECTION, HIDEOPTION, SHOWOPTION, HIDEOPTIONGROUP, SHOWOPTIONGROUP | Runs, changes the form | Not run | Not run |
| DISPLAYTEXT, DISPLAYKEYVALUEPAIR | Runs, shows in **Feedback** or **Indicators** | Not run | Not run |
| ASSIGN, SETMANDATORYFIELD | Runs, changes the field | Runs | Runs |
| UNSETMANDATORYFIELD | Runs, makes the field optional | Not run | Not run |
| SHOWWARNING, SHOWERROR | Runs, shows on the field | Runs | Runs |
| WARNINGONCOMPLETE, ERRORONCOMPLETE | Runs, shows on the field and in the completion check | Runs | Runs |
| SENDMESSAGE, SCHEDULEMESSAGE | Not run, simulated in **Server effects** | Runs | Runs |
| SCHEDULEEVENT | Not run, simulated in **Server effects** | Not run | Runs |
| CREATEEVENT | Not run, simulated in **Server effects** | Not run | Not run |
| HIDEPROGRAMSTAGE | Shows in the rules panel only, the stage stays visible | Not run | Not run |

"Runs" in a server column means the DHIS2 tracker importer runs the action when data is imported, and reports it when you use **Verify with server**.

:::note SCHEDULEEVENT and CREATEEVENT

The server runs SCHEDULEEVENT from DHIS2 2.43. On DHIS2 2.40 to 2.42, SCHEDULEEVENT and CREATEEVENT rows in **Server effects** are dimmed and read "Not executed by this server (requires 2.43)".

On 2.43, CREATEEVENT rows read "Not executed by this server", because the server declares the action but doesn't run it.

:::

For the full list of rule actions and what each one does in the app, see [Rule action types](../reference/rule-action-types.md).

## Which app the rule editor link opens

The rule details dialog has a link that opens the rule in the DHIS2 app where you edit rules.

:::note Rule editor link

- On DHIS2 2.40 to 2.42 the link reads **Edit in Maintenance app** and opens the Maintenance app.
- On DHIS2 2.43 the link reads **Edit in Metadata Management app** and opens the Metadata Management app.

:::

If the app can't tell the server version, it uses the Maintenance app link and treats the server as 2.40.

## What has been checked on which version

The user authorities and sharing in [Requirements and user authorities](../getting-started/requirements-and-user-authorities.md) were checked on DHIS2 2.43.2. They have not been checked on 2.40 to 2.42 yet, and neither has the **Edit in Maintenance app** link.

## Related pages

- [Rule action types](../reference/rule-action-types.md)
- [Preview server effects](../using-the-app/preview-server-effects.md)
- [Open and edit a rule](../using-the-app/open-and-edit-a-rule.md)
- [Why client and server results differ](../concepts/why-client-and-server-results-differ.md)
