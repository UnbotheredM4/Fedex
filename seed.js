import { PrismaClient } from '@prisma/client'
import { customAlphabet } from 'nanoid'
const prisma = new PrismaClient()
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 12)

async function main() {
  const from = await prisma.address.create({ data: {
    name: "FastShip Warehouse", line1: "100 Logistics Way", city: "Memphis", state: "TN", postal: "38118", phone: "901-555-0100"
  } })
  const to = await prisma.address.create({ data: {
    name: "ACME Corp.", line1: "1 Market St", city: "San Francisco", state: "CA", postal: "94105", phone: "415-555-0111"
  } })
  const tn = "FS-" + nano()
  const s = await prisma.shipment.create({
    data: {
      trackingNumber: tn,
      reference: "ORDER-9001",
      serviceLevel: "EXPRESS",
      weightOz: 48,
      editableUntil: new Date(Date.now() + 60 * 60 * 1000),
      fromAddressId: from.id,
      toAddressId: to.id
    }
  })
  await prisma.trackingEvent.createMany({
    data: [
      { shipmentId: s.id, code: "LABEL_CREATED", description: "Label created" },
      { shipmentId: s.id, code: "PICKED_UP", description: "Shipment picked up", location: "Memphis, TN" }
    ]
  })
  console.log("Seeded tracking:", tn)
}
main().finally(async()=>{ await prisma.$disconnect() })
