#!/usr/bin/env tsx

/**
 * Seed script: popula los cursos del mock en Firestore
 *
 * Uso:
 *   npm run seed:courses
 */

import { Firestore } from '@google-cloud/firestore';

const COURSES = [
  {
    id: 'planche-001',
    title: 'EL CAMINO A LA PLANCHE',
    description: 'Desde lean hollow body hasta Full Planche. Protocolos de fuerza y acondicionamiento de muñecas.',
    price: 45000,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
    level: 'Pro',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoKey: null,
  },
  {
    id: 'front-002',
    title: 'FRONT LEVER EXPLOSIVO',
    description: 'Domina el tirón y la estática. Progresiones reales sin bandas elásticas.',
    price: 35000,
    thumbnail: 'https://images.unsplash.com/photo-1590239926044-245806f19f96?q=80&w=800',
    level: 'Intermedio',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoKey: null,
  },
  {
    id: 'basics-003',
    title: 'FUNDAMENTOS BARSAYANS',
    description: 'La base de todo atleta. Dominadas perfectas, fondos profundos y control escapular.',
    price: 25000,
    thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800',
    level: 'Básico',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoKey: null,
  },
];

async function seed() {
  const config: ConstructorParameters<typeof Firestore>[0] = {
    projectId: process.env.GCP_PROJECT_ID,
  };

  if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
    config.keyFilename = process.env.GCP_SERVICE_ACCOUNT_KEY;
  } else if (process.env.GCP_CREDENTIALS) {
    config.credentials = JSON.parse(process.env.GCP_CREDENTIALS);
  }
  // Si ninguno está seteado, usa GOOGLE_APPLICATION_CREDENTIALS (ADC)

  const firestore = new Firestore(config);
  const collection = process.env.FIRESTORE_COURSES_COLLECTION || 'courses';
  const now = new Date().toISOString();

  console.log(`\nSeeding ${COURSES.length} cursos en Firestore...`);
  console.log(`Proyecto: ${process.env.GCP_PROJECT_ID}`);
  console.log(`Colección: ${collection}\n`);

  for (const course of COURSES) {
    await firestore.collection(collection).doc(course.id).set({
      ...course,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  OK  ${course.id}  "${course.title}"`);
  }

  console.log('\nSeed completado.');
}

seed().catch((err) => {
  console.error('\nError durante el seed:', err);
  process.exit(1);
});
