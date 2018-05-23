const downloagGitRepo = require('download-git-repo');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra')
const exists = require('fs').existsSync;
const path = require('path');
const ora = require('ora');
const shell = require('shelljs');

const { getGitUser } = require('./utils');

const originRepo = 'blackLearning/react-starter-kit';

/*
vue-cli questions:
? Project name asd
? Project description A Vue.js project
? Author chenxingyu <chenxingyu@wolongdata.com>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests Yes
? Pick a test runner jest
? Setup e2e tests with Nightwatch? Yes
? Should we run `npm install` for you after the project has been created? (recommended) npm
 */


module.exports = async (args, program) => {
  const [ projectName ] = args;
  const { name, email } = getGitUser();
  const questions = [{
    type: 'input',
    name: 'name',
    default: projectName || 'react-starter',
    message: 'Project name:'
  }, {
    type: 'input',
    name: 'description',
    message: 'Project description:'
  }, {
    type: 'input',
    name: 'author',
    default: name,
    message: 'Author:'
  }, {
    type: 'confirm',
    name: 'redux',
    default: true,
    message: 'need state management(only support redux)?'
  }, {
    type: 'confirm',
    name: 'ssr',
    default: false,
    message: 'need ssr(server side render)?'
  }, {
    type: 'confirm',
    name: 'ie8',
    default: true,
    message: 'need to be compatible with ie8?'
  }];
  // if (args.length < 1) return program.help();
  const answer = await inquirer.prompt(questions);
  const projectPath = path.join(process.cwd(), projectName);
  const clone = program.clone;
  const autoInstall = program.autoInstall;

  if (exists(projectPath)) {
    console.error(chalk.red('directory is alerady exists, please use a new directory'));
    process.exit(1);
  }

  const branch = answer.redux ? 'redux'
                : answer.ssr ? 'ssr'
                : answer.ie8 ? 'ie8'
                : 'master';

  const spinner = ora('downloading template...');
  spinner.start();

  downloagGitRepo(`${originRepo}#${branch}`, projectPath, { clone }, err => {
    if (err) {
      console.log(err)
      spinner.fail(`Failed to download templates`);
      process.exit(1);
    }

    if (autoInstall) {
      spinner.text = 'Installing dependencies...';
      shell.exec(`cd ${projectPath} && cnpm install`);
    } else {
      spinner.succeed(`Succeed to initilize!`);
    }

    spinner.succeed(`Succeed to initilize!`);
    console.log(`========================================`)
    
    console.log( chalk.green(`
      to start:
        $ npm start
      to build: 
        $ npm run bundle
    `))
    console.log(chalk.green(`see https://github.com/${originRepo} to visit more.`));
  })
};
