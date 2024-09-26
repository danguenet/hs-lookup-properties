# Company Contact Lookup

This project allows you to add a card to your Company object, enabling the creation of lookup fields that reference Contact records.

![Screenshot 2024-09-25 at 10 39 03 PM](https://github.com/user-attachments/assets/91ff0878-80b8-45ed-9cb8-2760cb7b41c7)

## How?

Refer to the README in the root of this repository for an explanation, as all the projects will work in the same way.

## Quick Start

### Step 1: Update your CLI and & authenticate your account

1. Update to latest CLI version by running `npm install -g @hubspot/cli@latest`.
2. Use the [quick start guide](https://developers.hubspot.com/docs/platform/ui-extensions-quickstart) to learn how to setup your account and local environment to work with HubSpot developer projects.

You will need a `hubspot.config.yml` file for the hs project create command, so don't forget to `hs init` like the guide says.

### Step 2: Create the project

Enter into the folder where you want this sample project. In place of `hs project create`, you can optionally use this handy command to directly create a project based on this sample project using `hs project create --templateSource="danguenet/hs-lookup-properties" --location="company-contact-lookup" --name="company-contact-lookup" --template="company-contact-lookup"`.

### Step 3: Install dependencies

Now in the CLI, enter into this newly created folder by `cd company-contact-lookup`. You will need to run `npm install` in both the `/src/app/extensions` and `/src/app/app.functions` directories to install the dependencies for this project.

### Step 4: Upload project

Run `hs project upload` in the root of `company-contact-lookup`. If you’d like to build on this project, run `hs project dev` to kickoff the dev process and see changes reflected locally as you build. If you use `hs project dev`, make sure to create a `.env` file based on the `.env.example` file.

### Step 5: View the cards

In the main menu select `CRM` > `Companies` to view company records. Click on any of the company records and navigate to the custom tab to access the sample card which is called `Contact Lookups`. If you haven't customized the tabs before follow step #4 from [this guide](https://developers.hubspot.com/docs/platform/ui-extensions-quickstart).

## Changing Fields to Display

Simply go to `lookupCard.jsx` and search for `CrmPropertyList`. Ensure that you use the API names of the properties.

```javascript
// /src/app/extensions/lookupCard.jsx
<CrmPropertyList
  properties={['firstname', 'lastname', 'jobtitle', 'company', 'email']}
  objectId={propertyID}
  objectTypeId="0-1"
/>
```
