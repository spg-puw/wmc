import "colors";
import inquirer from 'inquirer'

inquirer
  .prompt([
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
  ])
  .then((answers) => {
    // console.log(answers);
    if (answers.age < 16 && ['Bier', 'Wein'].includes(answers.drink)) {
      console.log(`Du darfst leider noch nicht ${answers.drink} trinken.`);
    }
    else if (answers.age < 18 && ['Schnaps'].includes(answers.drink)) {
      console.log(`Du darfst leider noch nicht ${answers.drink} trinken.`);
    }
    else {
      console.log(`Du darfst ${answers.drink} trinken.`);
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });