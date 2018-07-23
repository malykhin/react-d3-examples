import faker from 'faker'

const DATA_LENGTH = 10
const names = Array(DATA_LENGTH).fill().map(() => faker.address.city())

export const getData = () => {
  return names.map(name => ({
    name,
    value: faker.random.number({min: 1, max: 100})
  }))
}

export const hexToRgbA = (hex) => {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)'
  }
  throw new Error('Bad Hex')
}
