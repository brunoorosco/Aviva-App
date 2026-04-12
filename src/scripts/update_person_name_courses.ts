import * as dotenv from 'dotenv';
import { MongoHelper } from '../infra/db/mongoHelper';
import stringSimilarity from 'string-similarity';
import { ObjectId } from 'mongodb';

dotenv.config();

const SIMILARITY_THRESHOLD = 0.8;

interface UpdateTarget {
  collection: string;
  fields: string[]; // Fields that contain the name or an array of objects with the name
  isNestedArray?: boolean; // If the field is an array of objects
  nameProperty?: string; // Property name inside the object (default: 'name')
}

const targets: UpdateTarget[] = [
  { collection: 'users', fields: ['name'], isNestedArray: false },
  { collection: 'course', fields: ['alunos'], isNestedArray: true, nameProperty: 'name' },
  { collection: 'encontros', fields: ['encontristas', 'equipe'], isNestedArray: true, nameProperty: 'name' },
  { collection: 'reencontros', fields: ['reencontristas'], isNestedArray: true, nameProperty: 'name' },
  { collection: 'seja_livre', fields: ['encontristas', 'reencontristas'], isNestedArray: true, nameProperty: 'name' },
  { collection: 'batismos', fields: ['batizandos'], isNestedArray: true, nameProperty: 'nome' },
  // Special case: churchs.consagracao[].users.<role>[].name
  // We will handle churchs separately due to its double nested structure
];

const normalize = (s: string) => 
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

async function updateName(oldName: string, newName: string, dryRun: boolean = true) {
  const normalizedOldName = normalize(oldName);
  console.log(`\n🚀 Starting name update: "${oldName}" -> "${newName}" ${dryRun ? '(DRY RUN)' : '(REAL UPDATE)'}`);
  
  await MongoHelper.connect(process.env.MONGODB_URI || '');
  console.log('✅ Connected to MongoDB');

  for (const target of targets) {
    const { collection: collectionName, fields, isNestedArray, nameProperty = 'name' } = target;
    const collection = await MongoHelper.getCollection(collectionName);
    const documents = await collection.find({}).toArray();

    console.log(`\n📁 Checking collection: ${collectionName} (${documents.length} documents)`);

    for (const doc of documents) {
      let docModified = false;
      const updateObj: any = {};

      for (const field of fields) {
        const value = doc[field];

        if (!value) continue;

        if (isNestedArray && Array.isArray(value)) {
          // Handle array of objects (e.g. alunos: [{ name: '...', ... }])
          let arrayModified = false;
          const updatedArray = value.map((item: any) => {
            if (item && item[nameProperty]) {
              const currentName = item[nameProperty];
              const similarity = stringSimilarity.compareTwoStrings(normalize(currentName), normalizedOldName);
              if (similarity >= SIMILARITY_THRESHOLD) {
                console.log(`   ✨ Match found in ${collectionName}[${doc._id}].${field}: "${currentName}" (sim: ${similarity.toFixed(2)})`);
                arrayModified = true;
                docModified = true;
                return { ...item, [nameProperty]: newName };
              }
            }
            return item;
          });

          if (arrayModified) {
            updateObj[field] = updatedArray;
          }
        } else if (!isNestedArray && typeof value === 'string') {
          // Handle simple string field (e.g. users.name)
          const similarity = stringSimilarity.compareTwoStrings(normalize(value), normalizedOldName);
          if (similarity >= SIMILARITY_THRESHOLD) {
            console.log(`   ✨ Match found in ${collectionName}[${doc._id}].${field}: "${value}" (sim: ${similarity.toFixed(2)})`);
            updateObj[field] = newName;
            docModified = true;
          }
        }
      }

      if (docModified && !dryRun) {
        await collection.updateOne({ _id: doc._id }, { $set: updateObj });
        console.log(`   ✅ Document ${doc._id} updated.`);
      }
    }
  }

  // Handle churchs.consagracao[].users.<role>[].name separately
  console.log('\n📁 Checking collection: churchs (Special Case: Consagração)');
  const churchsCollection = await MongoHelper.getCollection('churchs');
  const churchs = await churchsCollection.find({}).toArray();

  for (const church of churchs) {
    if (!church.consagracao || !Array.isArray(church.consagracao)) continue;

    let churchModified = false;
    const updatedConsagracao = church.consagracao.map((cons: any) => {
      let consModified = false;
      if (!cons.users || typeof cons.users !== 'object') return cons;

      const updatedUsers: any = {};
      for (const role in cons.users) {
        const userList = cons.users[role];
        if (!Array.isArray(userList)) {
          updatedUsers[role] = userList;
          continue;
        }

        let roleModified = false;
        const updatedUserList = userList.map((u: any) => {
          if (u && u.name) {
            const similarity = stringSimilarity.compareTwoStrings(normalize(u.name), normalizedOldName);
            if (similarity >= SIMILARITY_THRESHOLD) {
              console.log(`   ✨ Match found in churchs[${church._id}].consagracao[${cons._id}].users.${role}: "${u.name}" (sim: ${similarity.toFixed(2)})`);
              roleModified = true;
              consModified = true;
              churchModified = true;
              return { ...u, name: newName };
            }
          }
          return u;
        });

        updatedUsers[role] = updatedUserList;
      }

      return consModified ? { ...cons, users: updatedUsers } : cons;
    });

    if (churchModified && !dryRun) {
      await churchsCollection.updateOne({ _id: church._id }, { $set: { consagracao: updatedConsagracao } });
      console.log(`   ✅ Church ${church._id} updated.`);
    }
  }

  await MongoHelper.disconnect();
  console.log('\n🏁 Finished.');
}

// CLI Execution
const args = process.argv.slice(2);
const oldNameArg = args[0];
const newNameArg = args[1];
const dryRunArg = args.includes('--real') ? false : true;

if (!oldNameArg || !newNameArg) {
  console.log('Usage: npx tsx src/scripts/update_person_name_courses.ts "Old Name" "New Name" [--real]');
  console.log('Experimental: Adding --real will perform actual updates, otherwise defaults to dry run.');
  process.exit(1);
}

updateName(oldNameArg, newNameArg, dryRunArg).catch(console.error);
