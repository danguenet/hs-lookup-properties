# HS Lookup Properties

This repository will host all projects related to lookup cards for each Object. A separate project will be required for displaying the card on different objects or for looking up different record types.

![lookup.gif](https://github.com/danguenet/hs-lookup-properties/blob/main/Lookup.gif)

## How?

The design of these projects is simple. First, create a property group called `Lookup` on the object that will have the card. Then, create properties with a type of `Single-line text`. This setup will pull the relevant lookup properties into the card.

I recommend keeping these fields hidden on the record, as interaction with them should only occur within the card. These fields are meant to either be empty or contain a record ID that correlates with the lookup object.

The record ID is what makes all the magic happen. If you need to run reports on these fields, you'll likely need to export them and perform a VLOOKUP on the record IDs.

## Project Naming Convention

Each project will be named with the first object representing the card's location and the second object representing the lookup object. For example, `company-contact-lookup` means the card will be on the company record and will look up contact records.

## Using in Production

If any of these projects interest you, feel free to use them under the MIT license. Just keep in mind that you'll need either a Sales or Service Enterprise account with HubSpot, or a developer test account if you're just exploring. Please note that it is against my wishes for anyone to use this code to create a public app and charge for it.

## How to get started with each project

Instructions for getting started with each project can be found in that project's `README.md`. Navigate into the specific project folder to locate it.

## Tools

If you clone the entire repository, feel free to use ESLint and Prettier.

```bash
npm run eslint
```

```bash
npm run prettier
```
