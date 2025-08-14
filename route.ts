import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import { customAlphabet } from 'nanoid'

const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 12)

const AddressSchema = z.object({
  name: z.string().optional(),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postal: z.string().min(2),
  country: z.string().default('US'),
  phone: z.string().optional()
})

const CreateSchema = z.object({
  reference: z.string().optional(),
  weightOz: z.number().int().positive(),
  serviceLevel: z.enum(['GROUND','EXPRESS']).default('GROUND'),
  editableForMinutes: z.number().int().positive().max(24*60).optional(),
  from: AddressSchema,
  to: AddressSchema
})

export async function POST(req: NextRequest){
  try {
    const body = await req.json()
    const parsed = CreateSchema.parse(body)
    const from = await prisma.address.create({ data: parsed.from })
    const to = await prisma.address.create({ data: parsed.to })
    const tn = "FS-" + nano()
    const editableUntil = parsed.editableForMinutes ? dayjs().add(parsed.editableForMinutes, 'minute').toDate() : null
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: tn,
        reference: parsed.reference,
        serviceLevel: parsed.serviceLevel,
        weightOz: parsed.weightOz,
        editableUntil,
        fromAddressId: from.id,
        toAddressId: to.id
      }
    })
    await prisma.trackingEvent.create({ data: { shipmentId: shipment.id, code: 'LABEL_CREATED', description: 'Label created' } })
    return NextResponse.json({ ok:true, trackingNumber: tn, shipmentId: shipment.id })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 400 })
  }
}

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const tn = searchParams.get('trackingNumber')
  if (!tn) return NextResponse.json({ ok:false, error:'trackingNumber required' }, { status: 400 })
  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber: tn },
    include: { fromAddress: true, toAddress: true, events: { orderBy: { createdAt: 'asc' } } }
  })
  if (!shipment) return NextResponse.json({ ok:false, error:'not found' }, { status: 404 })
  return NextResponse.json({ ok:true, shipment })
}
