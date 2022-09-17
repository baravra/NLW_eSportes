import express, { response } from "express"
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

import convertHourStringToMinute from "./utils/convert-hour-string-to-minutes"
import convertMinutesToHourString from "./utils/convert-minutes-to-hour-string"

const app = express()

app.use(express.json() ) //para o express entender os json
app.use(cors())

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games' , async (request, response) => {
    const games = await prisma.game.findMany({
        include: { // join
            _count:{
                select:{
                    ads: true
                }
            }
        }
    })
    
    return response.json(games)
})

app.post('/games/:id/ads' , async (request, response) => {
    const gameId = request.params.id
    const body = request.body // express nao entende que to enviando body em json

    const ad = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinute(body.hourStart),
            hourEnd: convertHourStringToMinute(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json([ad]) // significa que algo foi criado
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id
    const ads = await prisma.ad.findMany({
        select:{ //pegar os campos que preciso
            id:true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where:{
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return response.send(ads.map(ad => { //formatando os dias
        return{
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
        }   
    }))

})

app.get('/ads/:id/discord', async(request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({ //tenta encontrar, se nao achar vai dar erro
        select:{
            discord: true
        },
        where: {
           id: adId, 
        }
    })
    return response.json({
        discord: ad.discord,
    })
})

app.listen(3333)