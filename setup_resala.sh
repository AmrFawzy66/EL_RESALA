#!/bin/bash
set -e

echo "🚀 جاري تثبيت الحزم وإعداد نظام EL-RESALA..."

# 1. تثبيت الحزم الأساسية
npm init -y
npm install express cors dotenv @prisma/client zod
npm install -D typescript ts-node @types/node @types/express @types/cors prisma nodemon

# 2. إنشاء ملف tsconfig.json
cat << 'CONFIG' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
CONFIG

# 3. إعداد Prisma Schema
mkdir -p prisma src

cat << 'SCHEMA' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./el_resala.db"
}

model User {
  id           String      @id @default(uuid())
  name         String
  username     String      @unique
  role         String      @default("CASHIER") // OWNER, MANAGER, CASHIER, TECHNICIAN
  repairs      RepairJob[]
  sales        Sale[]
  createdAt    DateTime    @default(now())
}

model Product {
  id             String          @id @default(uuid())
  name           String
  sku            String          @unique
  barcode        String?         @unique
  type           String          // DEVICE, ACCESSORY, SPARE_PART
  stockQuantity  Int             @default(0)
  minStockAlert  Int             @default(3)
  purchasePrice  Float           @default(0.0)
  retailPrice    Float
  wholesalePrice Float?
  location       String?
  imeis          DeviceImei[]
  saleItems      SaleItem[]
  repairParts    RepairItem[]
  stockMovements StockMovement[]
  createdAt      DateTime        @default(now())
}

model DeviceImei {
  id              String    @id @default(uuid())
  imei1           String    @unique
  imei2           String?   @unique
  serialNumber    String?
  productId       String
  product         Product   @relation(fields: [productId], references: [id])
  condition       String    @default("NEW") // NEW, USED
  status          String    @default("IN_STOCK") // IN_STOCK, SOLD, IN_REPAIR
  purchasePrice   Float
  soldPrice       Float?
  warrantyMonths  Int       @default(12)
  warrantyEndDate DateTime?
  saleItemId      String?   @unique
  saleItem        SaleItem? @relation(fields: [saleItemId], references: [id])
  createdAt       DateTime  @default(now())
}

model FinancialAccount {
  id            String               @id @default(uuid())
  name          String               // خزنة المحل، فودافون كاش، انستاباي، البنك
  type          String               // CASH, WALLET, BANK
  balance       Float                @default(0.0)
  transfersFrom FinancialTransfer[]  @relation("SourceAcc")
  transfersTo   FinancialTransfer[]  @relation("DestAcc")
  payments      PaymentTransaction[]
  expenses      Expense[]
  createdAt     DateTime             @default(now())
}

model FinancialTransfer {
  id          String           @id @default(uuid())
  sourceAccId String
  destAccId   String
  sourceAcc   FinancialAccount @relation("SourceAcc", fields: [sourceAccId], references: [id])
  destAcc     FinancialAccount @relation("DestAcc", fields: [destAccId], references: [id])
  amount      Float
  notes       String?
  createdAt   DateTime         @default(now())
}

model Sale {
  id             String               @id @default(uuid())
  invoiceNumber  String               @unique
  customerName   String?
  customerPhone  String?
  cashierId      String
  cashier        User                 @relation(fields: [cashierId], references: [id])
  totalAmount    Float
  discountAmount Float                @default(0.0)
  netAmount      Float
  paidAmount     Float
  remaining      Float                @default(0.0)
  items          SaleItem[]
  payments       PaymentTransaction[]
  createdAt      DateTime             @default(now())
}

model SaleItem {
  id         String      @id @default(uuid())
  saleId     String
  sale       Sale        @relation(fields: [saleId], references: [id], onDelete: Cascade)
  productId  String
  product    Product     @relation(fields: [productId], references: [id])
  quantity   Int         @default(1)
  unitPrice  Float
  totalPrice Float
  costPrice  Float
  deviceImei DeviceImei?
}

model PaymentTransaction {
  id          String           @id @default(uuid())
  accountId   String
  account     FinancialAccount @relation(fields: [accountId], references: [id])
  amount      Float
  type        String           // IN, OUT
  saleId      String?
  sale        Sale?            @relation(fields: [saleId], references: [id])
  repairJobId String?
  repairJob   RepairJob?       @relation(fields: [repairJobId], references: [id])
  createdAt   DateTime         @default(now())
}

model RepairJob {
  id             String               @id @default(uuid())
  jobCardNumber  String               @unique
  customerName   String
  customerPhone  String
  deviceModel    String
  imeiOrSerial   String?
  reportedFaults String
  status         String               @default("RECEIVED") 
  // RECEIVED, IN_REPAIR, READY, DELIVERED, CANCELLED
  technicianId   String?
  technician     User?                @relation(fields: [technicianId], references: [id])
  diagnosticFee  Float                @default(0.0)
  laborFee       Float                @default(0.0)
  partsTotal     Float                @default(0.0)
  totalAmount    Float                @default(0.0)
  paidAmount     Float                @default(0.0)
  commissionRate Float                @default(0.0)
  techPayout     Float                @default(0.0)
  partsUsed      RepairItem[]
  payments       PaymentTransaction[]
  deliveredAt    DateTime?
  createdAt      DateTime             @default(now())
}

model RepairItem {
  id          String    @id @default(uuid())
  repairJobId String
  repairJob   RepairJob @relation(fields: [repairJobId], references: [id], onDelete: Cascade)
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  quantity    Int       @default(1)
  unitPrice   Float
  costPrice   Float
}

model Expense {
  id        String           @id @default(uuid())
  title     String
  amount    Float
  category  String
  accountId String
  account   FinancialAccount @relation(fields: [accountId], references: [id])
  createdAt DateTime         @default(now())
}

model StockMovement {
  id        String   @id @default(uuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  changeQty Int
  reason    String
  createdAt DateTime @default(now())
}
SCHEMA

# 4. بناء ملف الخادم الرئيسي الكامل
cat << 'SERVER' > src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ================= 1. لوحة المؤشرات (DASHBOARD STATS) =================
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySales, accounts, lowStock, activeRepairs] = await Promise.all([
      prisma.sale.findMany({ where: { createdAt: { gte: today } } }),
      prisma.financialAccount.findMany(),
      prisma.product.findMany({ where: { stockQuantity: { lte: 3 } } }),
      prisma.repairJob.count({ where: { status: { in: ['RECEIVED', 'IN_REPAIR', 'READY'] } } })
    ]);

    const totalSalesAmount = todaySales.reduce((sum, s) => sum + s.netAmount, 0);

    res.json({
      success: true,
      data: {
        todaySalesCount: todaySales.length,
        todaySalesAmount,
        activeRepairsCount: activeRepairs,
        lowStockItems: lowStock,
        accounts
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= 2. المبيعات ونقطة البيع والدفع المقسم (POS) =================
app.post('/api/pos/checkout', async (req: Request, res: Response) => {
  const { cashierId, customerName, customerPhone, items, discountAmount = 0, payments } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const saleItemsData: any[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`المنتج غير متوفر: ${item.productId}`);

        if (product.type === 'DEVICE') {
          if (!item.imei1) throw new Error(`الجهاز ${product.name} يتطلب إدخال الـ IMEI.`);
          const imeiRecord = await tx.deviceImei.findUnique({ where: { imei1: item.imei1 } });

          if (!imeiRecord || imeiRecord.status !== 'IN_STOCK') {
            throw new Error(`الـ IMEI ${item.imei1} غير متوفر للبيع.`);
          }

          await tx.deviceImei.update({
            where: { imei1: item.imei1 },
            data: {
              status: 'SOLD',
              soldPrice: item.unitPrice,
              warrantyEndDate: new Date(Date.now() + imeiRecord.warrantyMonths * 30 * 24 * 60 * 60 * 1000)
            }
          });
        } else {
          if (product.stockQuantity < item.quantity) {
            throw new Error(`الرصيد غير كافٍ للمنتج: ${product.name}`);
          }
          await tx.product.update({
            where: { id: product.id },
            data: { stockQuantity: { decrement: item.quantity } }
          });
        }

        await tx.stockMovement.create({
          data: { productId: product.id, changeQty: -item.quantity, reason: 'POS_SALE' }
        });

        const lineTotal = item.unitPrice * item.quantity;
        subtotal += lineTotal;

        saleItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: lineTotal,
          costPrice: product.purchasePrice
        });
      }

      const netAmount = subtotal - discountAmount;
      const totalPaid = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      const remaining = netAmount - totalPaid;

      const sale = await tx.sale.create({
        data: {
          invoiceNumber: `INV-${Date.now().toString().slice(-7)}`,
          customerName,
          customerPhone,
          cashierId,
          totalAmount: subtotal,
          discountAmount,
          netAmount,
          paidAmount: totalPaid,
          remaining: remaining > 0 ? remaining : 0,
          items: { create: saleItemsData }
        }
      });

      for (const p of payments) {
        if (Number(p.amount) <= 0) continue;
        await tx.financialAccount.update({
          where: { id: p.accountId },
          data: { balance: { increment: Number(p.amount) } }
        });
        await tx.paymentTransaction.create({
          data: { accountId: p.accountId, amount: Number(p.amount), type: 'IN', saleId: sale.id }
        });
      }

      return sale;
    });

    res.json({ success: true, sale: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ================= 3. إدارة كروت الصيانة وحساب الفنيين (REPAIRS) =================
app.post('/api/repairs', async (req: Request, res: Response) => {
  const { customerName, customerPhone, deviceModel, imeiOrSerial, reportedFaults, diagnosticFee = 0, technicianId, commissionRate = 0 } = req.body;
  try {
    const job = await prisma.repairJob.create({
      data: {
        jobCardNumber: `REP-${Date.now().toString().slice(-6)}`,
        customerName,
        customerPhone,
        deviceModel,
        imeiOrSerial,
        reportedFaults,
        diagnosticFee,
        technicianId,
        commissionRate,
        totalAmount: diagnosticFee
      }
    });
    res.json({ success: true, job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// إضافة قطع غيار لأمر الصيانة
app.post('/api/repairs/:id/parts', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity = 1, unitPrice } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || product.stockQuantity < quantity) {
        throw new Error('القطعة غير متوفرة بالكمية المطلوبة');
      }

      const partTotal = unitPrice * quantity;
      const repairItem = await tx.repairItem.create({
        data: {
          repairJobId: id,
          productId,
          quantity,
          unitPrice,
          costPrice: product.purchasePrice
        }
      });

      await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: quantity } }
      });

      await tx.repairJob.update({
        where: { id },
        data: {
          partsTotal: { increment: partTotal },
          totalAmount: { increment: partTotal }
        }
      });

      return repairItem;
    });
    res.json({ success: true, item: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// تسليم الجهاز وحساب مصنعية الفني والتحصيل
app.post('/api/repairs/:id/deliver', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { laborFee, accountId } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.repairJob.findUnique({ where: { id } });
      if (!job) throw new Error('أمر الصيانة غير موجود');

      const finalTotal = job.diagnosticFee + job.partsTotal + Number(laborFee);
      const techPayout = (Number(laborFee) * job.commissionRate) / 100;

      await tx.financialAccount.update({
        where: { id: accountId },
        data: { balance: { increment: finalTotal } }
      });

      await tx.paymentTransaction.create({
        data: { accountId, amount: finalTotal, type: 'IN', repairJobId: job.id }
      });

      return await tx.repairJob.update({
        where: { id },
        data: {
          status: 'DELIVERED',
          laborFee: Number(laborFee),
          totalAmount: finalTotal,
          paidAmount: finalTotal,
          techPayout,
          deliveredAt: new Date()
        }
      });
    });
    res.json({ success: true, job: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ================= 4. تتبع الـ IMEI والأجهزة =================
app.get('/api/devices/imei/:imei', async (req: Request, res: Response) => {
  try {
    const device = await prisma.deviceImei.findUnique({
      where: { imei1: req.params.imei },
      include: {
        product: true,
        saleItem: { include: { sale: true } }
      }
    });
    if (!device) return res.status(404).json({ success: false, message: 'الجهاز غير مسجل بالسيستم' });
    res.json({ success: true, device });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= 5. التحويلات المالية بين الخزائن والمحافظ =================
app.post('/api/finance/transfer', async (req: Request, res: Response) => {
  const { sourceAccId, destAccId, amount, notes } = req.body;
  try {
    const transfer = await prisma.$transaction(async (tx) => {
      const source = await tx.financialAccount.findUnique({ where: { id: sourceAccId } });
      if (!source || source.balance < amount) throw new Error('رصيد الحساب المصدر غير كافٍ');

      await tx.financialAccount.update({ where: { id: sourceAccId }, data: { balance: { decrement: amount } } });
      await tx.financialAccount.update({ where: { id: destAccId }, data: { balance: { increment: amount } } });

      return await tx.financialTransfer.create({
        data: { sourceAccId, destAccId, amount, notes }
      });
    });
    res.json({ success: true, transfer });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ================= 6. طباعة الإيصال الحراري (ESC/POS Raw Text) =================
app.get('/api/print/receipt/:saleId', async (req: Request, res: Response) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.saleId },
      include: { items: { include: { product: true } } }
    });

    if (!sale) return res.status(404).send('الفاتورة غير موجودة');

    let receipt = `================================================\n`;
    receipt += `                   EL-RESALA\n`;
    receipt += `         الهواتف المحمولة والإكسسوارات والصيانة\n`;
    receipt += `================================================\n`;
    receipt += `رقم الفاتورة: ${sale.invoiceNumber}\n`;
    receipt += `التاريخ: ${sale.createdAt.toLocaleString('ar-EG')}\n`;
    receipt += `العميل: ${sale.customerName || 'عميل نقدي'}\n`;
    receipt += `------------------------------------------------\n`;
    receipt += `الصنف                  الكمية    السعر     الإجمالي\n`;
    receipt += `------------------------------------------------\n`;

    sale.items.forEach((item) => {
      receipt += `${item.product.name.padEnd(20)} ${item.quantity.toString().padEnd(6)} ${item.unitPrice.toFixed(2).padEnd(9)} ${item.totalPrice.toFixed(2)}\n`;
    });

    receipt += `------------------------------------------------\n`;
    receipt += `الإجمالي: ${sale.totalAmount.toFixed(2)} ج.م\n`;
    receipt += `الخصم:    ${sale.discountAmount.toFixed(2)} ج.م\n`;
    receipt += `الصافي:   ${sale.netAmount.toFixed(2)} ج.م\n`;
    receipt += `المدفوع:  ${sale.paidAmount.toFixed(2)} ج.م\n`;
    receipt += `المتبقي:  ${sale.remaining.toFixed(2)} ج.م\n`;
    receipt += `================================================\n`;
    receipt += `  * البضاعة المباعة ترد وتستبدل خلال 14 يوماً *\n`;
    receipt += `           شكراً لتعاملكم مع EL-RESALA\n\n\n\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(receipt);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ سيرفر EL-RESALA يعمل بنجاح على المنفذ: http://localhost:${PORT}`);
});
SERVER

# 5. بناء قاعدة البيانات وتشغيل الـ Seed
echo "⚡ جاري إعداد جداول قاعدة البيانات والبيانات الافتراضية..."
npx prisma db push

cat << 'SEED' > prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // حسابات الخزينة والمحافظ
  await prisma.financialAccount.createMany({
    data: [
      { name: 'خزينة المحل الرئيسية', type: 'CASH', balance: 0.0 },
      { name: 'محفظة Vodafone Cash', type: 'WALLET', balance: 0.0 },
      { name: 'محفظة InstaPay', type: 'BANK', balance: 0.0 },
      { name: 'الحساب البنكي', type: 'BANK', balance: 0.0 }
    ]
  });

  // مستخدم كاشير افتراضي
  await prisma.user.create({
    data: {
      name: 'مسؤول المحل',
      username: 'admin',
      role: 'OWNER'
    }
  });

  console.log("🌱 تم إدخال الخزائن والمحافظ وحساب المسؤول بنجاح.");
}

main().finally(() => prisma.$disconnect());
SEED

npx ts-node prisma/seed.ts

echo "✨ اكتمل الإعداد بنجاح! يمكنك الآن تشغيل السيستم بالأمر:"
echo "npx ts-node src/server.ts"
