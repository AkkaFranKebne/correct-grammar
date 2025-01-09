
/*
Automates the generation of Prisma client code based on the Prisma schema. 
*/

const { exec } = require('child_process');
const path = require('path');

const prismaSchema = path.join(__dirname, 'prisma', 'schema.prisma');

exec(`prisma generate --schema="${prismaSchema}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

