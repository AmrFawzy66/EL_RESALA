import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// تقديم واجهة المستخدم الثابتة
app.use(express.static(path.join(__dirname, '../public')));

// مسار الفاتورة الحرارية للتجربة
app.get('/api/print/receipt/sample', (req: Request, res: Response) => {
  const receipt = `
================================================
                   EL-RESALA
           خدمات المحمول والمبيعات والصيانة
       العنوان: شبرا الخيمة - هاتف: 01070900711
================================================
رقم الفاتورة: #INV-2026-1092
التاريخ: ${new Date().toLocaleString('ar-EG')}
الكاشير: مسؤول النظام (admin)
العميل: عميل نقدي
------------------------------------------------
الصنف             الكمية      السعر      الإجمالي
------------------------------------------------
شاشة a12 أصلية      1         850.00      850.00
------------------------------------------------
الصافي المستحق:                        850.00 ج.م
المدفوع (كاش سائل):                    850.00 ج.م
المتبقي:                                 0.00 ج.م
================================================
* البضاعة المباعة ترد وتستبدل خلال 14 يوماً *
           شكراً لتعاملكم مع EL-RESALA
  `;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(receipt);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 نظام EL-RESALA يعمل الآن بالواجهة الكاملة:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
