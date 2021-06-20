# MJML Setup

Up to date setup for mjml development

### Install

With yarn: `yarn install`
With npm: `npm install`

###  Script

1. Run `yarn build` to build all templates compiled HTML files
2. Run `yarn start` to watch for changes on MJML files for development. A browser window should open with a dev server and auto reload.
3. Run `yarn dist` to build final emails in the dist folder

### Json files

**placeholder.json** Test template contents replace all components

**content.json** For each generated file replace content
### MJML

The [mjml](https://mjml.io/documentation/) sources code should always be in the src folder. You can as well modify the gulpfile to specify differents targets.

### Sending emails

To send a template, you will need a [Mailjet account](https://app.mailjet.com), API keys pair, and sender. You can then set the following as environmental variables on your machine:
You can create a `.env` file in the root of the project for ease of configuration across platforms:

```
# Store your environment variables here
MJ_PROJECT=Sample
MJ_APIKEY_PUBLIC=xxxxxxxxxxxxxxx
MJ_APIKEY_PRIVATE=xxxxxxxxxxxxx
MJ_SENDER=your@mail.com
MJ_RECIPIENT=your@mail.com

```

- **MJ_PROJECT**: Mailjet Current Project Name
- **MJ_APIKEY_PUBLIC**: Mailjet Public Key
- **MJ_APIKEY_PRIVATE**: Mailjet Private Key
- **MJ_SENDER**: Mailjet Sender (this must be set in the [sender section](https://app.mailjet.com/account/sender) of your Mailjet dashboard)
- **MJ_RECIPIENT**: The email address which will receive the email. You can send the email to different email addresses by separating them with comma

### Send a specific template / email

You can choose a template to test by specifying them as _optional_ terminal arguments:

`yarn send --template="path"`

**`IMPORTANT: keep in mind your email quota limits per day before running this command`**
