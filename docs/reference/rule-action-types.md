---
title: 'Rule action types'
description: 'Lists the program rule action types, what the playground does with each, whether the server runs it, and the DHIS2 versions involved.'
sidebar_position: 2
---

# Rule action types

This page lists every program rule action type the app knows, in one table. For each type it shows what the playground does in your browser, whether the DHIS2 server also runs it when data is imported, and any version gate.

## How to read the table

- **In the playground** is what you see when a rule with this action fires in a form.
- **Server on 2.40 to 2.42** and **Server on 2.43** say whether the DHIS2 tracker importer runs the action when data is imported, and so whether [Verify with server](../using-the-app/check-rules-against-the-server.md) or the [Server effects](../using-the-app/preview-server-effects.md) dialog can show a server result for it. "Not run" means only data entry apps in the browser run it. This matches [DHIS2 version compatibility](../introduction/dhis2-version-compatibility.md).
- Every action that fires also shows in the **Rules**, **Trace** and **Graph** tabs.

## Action types

| Action type | In the playground | Server on 2.40 to 2.42 | Server on 2.43 |
| --- | --- | --- | --- |
| `HIDEFIELD` | Hides the field. Shows a **Hidden** badge and a hidden-field placeholder. | Not run | Not run |
| `SHOWFIELD` | Shows the field again. **Shown** badge. See note 1. | Not run | Not run |
| `HIDESECTION` | Hides the section. Shows a "Section hidden by" placeholder, no badge. | Not run | Not run |
| `HIDEPROGRAMSTAGE` | No effect on the form or the **Enrollment** rail. Visible in the rules panel only. | Not run | Not run |
| `HIDEOPTION` | Removes the option from the field's list. **Hidden** badge. | Not run | Not run |
| `SHOWOPTION` | Puts a hidden option back. **Shown** badge. See note 1. | Not run | Not run |
| `HIDEOPTIONGROUP` | Removes the options in the option group. **Hidden** badge. | Not run | Not run |
| `SHOWOPTIONGROUP` | Puts the options of the option group back. **Shown** badge. See note 1. | Not run | Not run |
| `ASSIGN` | Fills in the value and locks the field. **Assigned** badge. Can also assign to a variable with no field. | Runs | Runs |
| `SETMANDATORYFIELD` | Makes the field required. **Required by rule** badge and an asterisk. | Runs | Runs |
| `UNSETMANDATORYFIELD` | Makes the field optional. **Required by rule** badge. See note 1. | Not run | Not run |
| `SHOWWARNING` | Shows the warning under the field. **Warning** badge. | Runs | Runs |
| `SHOWERROR` | Shows the error under the field. **Error** badge. | Runs | Runs |
| `WARNINGONCOMPLETE` | **On complete: warning** badge. Listed in the completion banner. | Runs | Runs |
| `ERRORONCOMPLETE` | **On complete: error** badge. Blocks completion in the completion banner. | Runs | Runs |
| `DISPLAYTEXT` | Adds an item to the **Feedback** or **Indicators** card. | Not run | Not run |
| `DISPLAYKEYVALUEPAIR` | Adds an item to the **Feedback** or **Indicators** card. | Not run | Not run |
| `SENDMESSAGE` | Not run in the browser. Shown as a **Simulated** row in **Server effects**. | Runs | Runs |
| `SCHEDULEMESSAGE` | Not run in the browser. Shown as a **Simulated** row in **Server effects**, with the scheduled date. | Runs | Runs |
| `SCHEDULEEVENT` | Not run in the browser. Shown in the **Events** section of **Server effects**. | Not run, see note 2 | Runs |
| `CREATEEVENT` | Not run in the browser. Shown in the **Events** section of **Server effects**. | Not run, see note 2 | Not run, see note 2 |

## Notes

1. `SHOWFIELD`, `SHOWOPTION`, `SHOWOPTIONGROUP` and `UNSETMANDATORYFIELD` are not in the DHIS2 API type list that the app is built against. The playground handles them if a rule engine result contains them, but you can't configure them as a rule action in the Maintenance or Metadata Management app.
2. On DHIS2 2.40 to 2.42, `SCHEDULEEVENT` and `CREATEEVENT` rows in **Server effects** show "Not executed by this server (requires 2.43)". On 2.43, `CREATEEVENT` rows show "Not executed by this server", because the server declares the action but doesn't run it. See [Provenance tags](./provenance-tags.md).

:::note

The app reads the DHIS2 version from the instance. If it can't tell the version, it treats the server as 2.40.

:::

- An `ERRORONCOMPLETE` or `WARNINGONCOMPLETE` action with no field still counts in the completion banner, as a message without a field name. See [Test on-complete rules](../using-the-app/test-on-complete-rules.md).
- Warning and error texts under a field show the action's static text only. The evaluated data part is not added, unlike in the DHIS2 Capture app.
- `HIDEOPTIONGROUP` and `SHOWOPTIONGROUP` need read access to the option group. `TODO(verify)`: what you see when you don't have it.

## Related pages

- [Effect badges legend](./effect-badges-legend.md)
- [Provenance tags](./provenance-tags.md)
- [How program rules are evaluated](../concepts/how-program-rules-are-evaluated.md)
- [Why client and server results differ](../concepts/why-client-and-server-results-differ.md)
