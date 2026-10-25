---
title: 'What is Program Rules Playground'
description: 'Program Rules Playground is a DHIS2 app for testing and debugging program rules against real metadata, without saving any data.'
slug: /
sidebar_position: 1
---

# What is Program Rules Playground

Program Rules Playground is an open-source DHIS2 app for testing and debugging program rules.

You pick a program, fill in its forms against your real metadata, and watch the program rules run live. Fields hide, show, become mandatory or receive values as you type, and the **Feedback** and **Indicators** cards list the messages your rules produce.

A rules panel with **Rules**, **Trace** and **Graph** tabs shows why each rule fired. You can see which rules apply to the form you have open, follow each evaluation step by step, and map which rules depend on which fields.

The app supports DHIS2 2.40 to 2.43.

:::info Nothing is saved

The app never stores data on your server. The only write call it makes is a tracker dry run with `importMode=VALIDATE`, which checks your input and discards it. Read [Is it safe to use on production?](./is-it-safe-on-production.md) for the details.

:::

## Where to go next

- [Install the app](../getting-started/install.md)
- [Debug your first event program rule](../getting-started/tutorial-debug-your-first-event-program-rule.md)
- [Look up a term in the glossary](../reference/glossary.md)
