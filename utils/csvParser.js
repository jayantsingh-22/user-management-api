const csvParser = require('csv-parser');
const fs = require('fs');

async function parseCsv(filePath, list) {
    const usersToAdd = [];
    const failedUsers = [];
    const emailsSet = new Set(list.users.map(user => user.email));

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const { name, email, ...customProps } = row;
                if (!name || !email) {
                    failedUsers.push({ ...row, error: 'Missing required fields' });
                    return;
                }

                if (emailsSet.has(email)) {
                    failedUsers.push({ ...row, error: 'Duplicate email' });
                    return;
                }

                const userProps = {};
                for (const prop of list.customProperties) {
                    userProps[prop.title] = customProps[prop.title] || prop.fallbackValue;
                }

                usersToAdd.push({
                    name,
                    email,
                    customProperties: userProps
                });

                emailsSet.add(email);
            })
            .on('end', () => {
                resolve({ usersToAdd, failedUsers });
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = parseCsv;
