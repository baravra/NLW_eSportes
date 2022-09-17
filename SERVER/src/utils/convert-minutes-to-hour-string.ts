// 1080 -> 18:20

export default function convertMinutesToHourString(minutesAmount: number){
    const hours = Math.floor(minutesAmount / 60) // arredondar pra baixo pra pegar a horas
    const minutes = minutesAmount % 60;

    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}` //adicionar 0 caso nao tenha 2 caracteres
  }