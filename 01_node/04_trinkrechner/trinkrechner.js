require("colors");
const inquirer = require('inquirer');

(async () => {
  let answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'age',
      message: 'Wie alt bist du?',
    },
    {
      type: 'rawlist',
      name: 'drink',
      message: 'Welches Gertänk würdest du gerne trinken?',
      choices: ['Eistee', 'Minearlwasser', 'Orangensaft', 'Bier', 'Wein', 'Schnaps'],
    },
  ]);

  if (answers.age < 16 && ['Bier', 'Wein'].includes(answers.drink)) {
    console.log(`Du darfst leider noch nicht ${answers.drink} trinken.`);
  }
  else if (answers.age < 18 && ['Schnaps'].includes(answers.drink)) {
    console.log(`Du darfst leider noch nicht ${answers.drink} trinken.`);
  }
  else {
    console.log(`Du darfst ${answers.drink} trinken.`);
  }

})();

