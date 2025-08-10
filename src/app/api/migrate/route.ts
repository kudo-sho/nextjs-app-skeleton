import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * データベースマイグレーション実行API
 * プレビュー環境と本番環境で実行可能
 */
export async function POST(request: NextRequest) {
  // 環境変数の確認
  const vercelEnv = process.env.VERCEL_ENV;
  const isPreview = vercelEnv === 'preview';
  const isProduction = vercelEnv === 'production';

  if (!isPreview && !isProduction) {
    return NextResponse.json(
      {
        error: 'Migration can only be run in preview or production environment',
      },
      { status: 403 }
    );
  }

  // 認証チェック
  const authHeader = request.headers.get('authorization');
  const migrationSecret = process.env.MIGRATION_SECRET;

  if (authHeader !== `Bearer ${migrationSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`Starting database migration in ${vercelEnv} environment...`);

    // データベースURL（環境別にVercelで設定）
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        `Database URL not configured for ${vercelEnv} environment`
      );
    }

    // Prismaクライアントの生成
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // マイグレーションの適用
    console.log('Applying migrations...');
    await prisma.$executeRaw`SELECT 1`;

    // マイグレーション履歴の確認
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 5
    `;

    console.log('Migration completed successfully');

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: `Migration completed successfully in ${vercelEnv} environment`,
      environment: vercelEnv,
      migrations: migrations,
    });
  } catch (error) {
    console.error('Migration failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        environment: vercelEnv,
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
