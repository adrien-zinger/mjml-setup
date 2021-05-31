require('dotenv').config();
const chalk = require('chalk');
const argv = require('yargs').argv;
const fs = require('fs');

if (!process.env.MJ_APIKEY_PUBLIC ||
    !process.env.MJ_APIKEY_PRIVATE ||
    !process.env.MJ_SENDER ||
    !process.env.MJ_RECIPIENT ||
    !process.env.MJ_PROJECT) {
    console.log(chalk.red(`Missing ${chalk.bold('environmental variable')} values!`));
    return null;
}

const mailjet = require('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

const template = {};

template.file = argv.template || 'index';
template.lang = argv.lang || 'it';

template.HTML = fs.readFileSync(`./build/${template.lang}/${template.file}.html`, 'utf8');

if (!template.HTML) {
    return null;
}

const head = {
    title_prefix: `${process.env.MJ_PROJECT} / `,
    title: `Kitchen Sink Template [${template.lang}]`
};

if (template.file !== 'kitchen-sink') {
    let locales = JSON.parse(fs.readFileSync('./locales.json'));
    head.title_prefix = locales[template.lang]['head-title-prefix'];
    head.title = locales[template.lang]['head-title'][template.file];
}


let recipients = process.env.MJ_RECIPIENT.split(',');
recipients.forEach(
    (r, i) => {
        r = r.trim(r);
        let email   = r;
        let name    =  `${email.split('@')[0]} - ${process.env.MJ_PROJECT} Email'`;
        recipients[i] = {
            'Email' :   email,
            'Name'  :   name
        };
    }
);

const request = mailjet
    .post('send', {'version': 'v3.1'})
    .request({
        'Messages':[{
            'From': {
                'Email': process.env.MJ_SENDER,
                'Name': process.env.MJ_SENDER
            },
            'To': recipients,
            'Subject': `${process.env.MJ_PROJECT} Email - ${template.file} - ${template.lang}`,
            'TextPart': `${process.env.MJ_PROJECT} Email - ${template.file} - ${template.lang}`,
            'HTMLPart': template.HTML
        }]
    });

request
    .then(() => {
        console.log(chalk.green(`Email ${chalk.bold(template.file)}/${chalk.bold(template.file)} successfully sent to ${chalk.bold(process.env.MJ_RECIPIENT)}`));
    })
    .catch((err) => {
        console.log(err);
    });
