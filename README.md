# MJML Setup

Up to date setup for mjml development

## Versioning

Please refer to the general versioning guidelines for the project.

## Environment Configuration

### Install

With yarn: `yarn install`
With npm: `npm install`

### Compile and watch

1. Run `npm run build` to build all compiled HTML files
2. Run `npm run start` to watch for changes on MJML files. A browser window should open with a dev server and auto reload.

## Coding guidelines

The emails templates are based on MJML 4, so please refer to [their documentation](https://mjml.io/documentation/) to follow the correct specifications.

Please code in a modular way, by creating components for every section in order to reuse them.

Always check the **kitchen sink** before creating a new component, to make sure it does not already exist. Then add them to the **"kitchen sink"** email template for a complete view of the available modules.

Please **install ESLint and EditorConfig** on your editor of choice, and make sure that no error are displayed when committing your changes. In addition you're able to check the code sanity by compiling the project with `yarn build` or `npm build`.

## Usage

By using the build function you can generate a template from mjml sources.

### Sources

The [mjml](https://mjml.io/documentation/) sources code should always be in the src folder. You can as well modify the gulpfile to specify differents targets.

### Text content

With to {{mustache}} anotation in your code you can set the content target with concordance with the json file locals.json

## Quality assurance / Testing

To quickly test your changes, you can preview the exported HTML files by serving the `build` folder with a [static server](https://www.npmjs.com/package/serve).

### Create a local server

To quickly see your changes in the source folder and in the locals json file you can use the command `yarn start` or `npm start`. It will open a web page in your favorite browser allowing you to see your modifications in direct live. The server pages archietcture will respect the architecture in the build folder (currently ./build/en that is the default one)

### Sending emails

To send a template, you will need a [Mailjet account](https://app.mailjet.com), API keys pair, and sender. You can then set the following as environmental variables on your machine:
You can create a `.env` file in the root of the project for ease of configuration across platforms:

```
# Store your environment variables here

MJ_APIKEY_PUBLIC=xxxxxxxxxxxxxxx
MJ_APIKEY_PRIVATE=xxxxxxxxxxxxx
MJ_SENDER=youraccount@alpenite.com
MJ_RECIPIENT=youraccount@alpenite.com

```

- **MJ_APIKEY_PUBLIC**: Mailjet Public Key
- **MJ_APIKEY_PRIVATE**: Mailjet Private Key
- **MJ_SENDER**: Mailjet Sender (this must be set in the [sender section](https://app.mailjet.com/account/sender) of your Mailjet dashboard)
- **MJ_RECIPIENT**: The email address which will receive the email. You can send the email to different email addresses by separating them with comma (e.g. `mario@rossi.it,rossi@mario.com`)

### Send a specific template

You can choose a template to test by specifying them as _optional_ terminal arguments:

`node send.js --template="order-confirmation"`

If none are specified, the "kitchen sink" template will be used as default.

**`IMPORTANT: keep in mind your email quota limits per day before running this command`**

### Clients / Browsers

A [Litmus](//litmus.com) account is available for automatically preview the emails on several browsers and email clients for quality assurance. Please note that each individual client/browser preview counts toward the 1000/month limit of the paid plan. **Do not** test every single change against 10+ clients, as this would quickly deplete the quota (*10 clients × 10 emails × 10 days = 1000 previews in 2 weeks*).

The 2-factor code required for authentication is currently sent to @rzaffalon. Please ask for credentials via Microsoft Teams once you have read and understood the above limitations.

### Bugs

Found a bug? Open a new issue with the `type | bug` label, provide a screenshot and the client / browser information, and assign it.
