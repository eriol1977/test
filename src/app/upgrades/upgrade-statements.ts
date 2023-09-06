export const personnelVersionUpgrades = [
  {
    toVersion: 1,
    statements: [
      `CREATE TABLE personnel(
        PERSONID varchar PRIMARY KEY NOT NULL,
        PERSONCDUNIT varchar,
        PERSONNAME varchar NOT NULL,
        PERSONDTSTART varchar,
        PERSONDTSTOP varchar,
        pTop varchar,
        CANCELLED varchar,
        UPDATEDATETIME varchar,
        UPDATEOFFSET varchar,
        RECORDCOUNTER varchar
        );`,
    ],
  },
];
