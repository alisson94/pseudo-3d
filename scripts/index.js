const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 600

const mapa_tamanho = 10

const mapa = [
    [1,1,1,1,1,1,1,1,1,1,],
    [1,0,0,0,0,0,0,0,0,1,],
    [1,0,0,0,1,0,0,0,0,1,],
    [1,0,1,0,0,0,0,0,0,1,],
    [1,0,0,0,0,0,1,1,0,1,],
    [1,0,0,0,0,0,0,1,0,1,],
    [1,0,1,0,0,0,0,1,0,1,],
    [1,0,1,0,0,0,0,0,0,1,],
    [1,0,0,0,0,0,0,0,0,1,],
    [1,1,1,1,1,1,1,1,1,1,],

]

const tamanho = 25

const jogador = new Jogador({
    posicao:{
        x: 100,
        y: 100
    }
});

const raios = []

let quant_raios = 100

for (let i = 0; i < quant_raios; i++) {
    let partes = jogador.fov/quant_raios
    let angulo_inicial = 0 - jogador.fov/2
    let raio = new Raio({
        coordenadas:{
            x: jogador.posicao.x,
            y: jogador.posicao.y
        },
        angulo: angulo_inicial + partes*i,
    })
    
    raios.push(raio)
}

loop()
function loop(){
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0 , canvas.width, canvas.height)

    jogador.update()
    
    raios.forEach((raio, i) => {
        raio.update()

        const coordX = 0 + i*(canvas.width)/(quant_raios)
        let tamanho_parede = (10000 / raio.modulo) / Math.cos(raio.angulo)
        if(tamanho_parede>canvas.height){
            tamanho_parede = canvas.height
        }

        ctx.beginPath()
        ctx.fillStyle = raio.raio_usado == 'horizontal' ? 'white' : '#bbb' 
        ctx.fillRect(coordX, canvas.height/2-tamanho_parede/2, (canvas.width)/(quant_raios), tamanho_parede)
        ctx.closePath()
        
        
    });
    
    for (let i = 0; i < mapa.length; i++) {
        for (let j = 0; j < mapa[i].length; j++) {
            ctx.fillStyle ='white'
            mapa[i][j] != 0 ? ctx.fillRect(j*tamanho, i*tamanho, tamanho, tamanho) : ''
            
        }
        
    }

    window.requestAnimationFrame(loop)
}