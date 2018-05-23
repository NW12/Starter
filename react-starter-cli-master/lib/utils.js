const { exec } = require('shelljs');

exports.getGitUser = () => {
	let name, email;
	
	try {
		name = exec('git config --get user.name', { silent: true }).stdout;
		email = exec('git config --get user.email', { silent: true }).stdout;
	} catch(e) {}

	name = name && JSON.stringify(String(name).trim()).slice(1, -1);
	email = email && `<${String(email).trim()}>`;
	return { name, email };
}