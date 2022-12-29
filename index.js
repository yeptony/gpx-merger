import fs from 'fs/promises'
import { readdirSync } from 'fs'

const gpx_array = []

const start = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StravaGPX Android" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
 <trk>
  <name>Merged track</name>
  <trkseg>
  `

const end = `  </trkseg>
  </trk>
</gpx>`

const files = readdirSync('./files').map((file) => `./files/${file}`)

const readGPX = async (file) => {
  try {
    const data = await fs.readFile(file, { encoding: 'utf8' })
    return data
  } catch (err) {
    console.log(err)
  }
}

const readAllGPX = async () => {
  let i = 0
  for (const file of files) {
    const data = await readGPX(file)
    gpx_array.push(
      data.slice(data.search('<trkseg>') + 9, data.search('</trkseg>'))
    )
    i++
    console.log(`Processed ${i} file${i > 1 ? 's' : ''}`)
  }
  fs.writeFile(
    './out/merged.gpx',
    `${start} ${gpx_array.join('')} ${end}`,
    (err) => {
      if (err) {
        console.error(err)
      }
    }
  )
}

readAllGPX()
