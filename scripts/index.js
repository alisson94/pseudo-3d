const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 600

const mapa_tamanho = 10

const mapa = [
    [1,1,1,1,1,1,1,1,1,1,],
    [1,0,0,0,0,0,0,0,0,1,],
    [1,0,0,0,1,0,0,0,0,1,],
    [1,0,0,0,0,0,0,0,0,1,],
    [1,0,0,0,0,0,1,1,0,1,],
    [1,0,0,0,0,0,0,1,0,1,],
    [1,0,1,0,0,0,0,1,0,1,],
    [1,0,1,0,0,0,0,0,0,1,],
    [1,0,0,0,0,0,0,0,0,1,],
    [1,1,1,1,1,1,1,1,1,1,],

]

const tamanho = 25

class Jogador{
    constructor({
        posicao,
    }){
        this.posicao = posicao
        this.angulo = 0
        this.raio = 10
        this.velocidade = 0
        this.velocidadeAngular=0
        this.fov = 80 * Math.PI / 180
        this.keys = {
            w: 0,
            s: 0,
            a: 0,
            d: 0,
        }
    }

    draw(){
        ctx.beginPath()
        ctx.fillStyle = 'green'
        ctx.arc(this.posicao.x, this.posicao.y, this.raio, 0, Math.PI * 2)
        ctx.save()
        ctx.translate(this.posicao.x, this.posicao.y)
        ctx.rotate(this.angulo)
        ctx.rect(0, 0 - 1, 30, 2)
        ctx.restore()
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.draw()
        //if(!seColidiuComParede(this.posicao.x + this.velocidade* Math.cos(this.angulo), this.posicao.y + this.velocidade* Math.sin(this.angulo))){
            this.posicao.x += this.velocidade* Math.cos(this.angulo)
            this.posicao.y += this.velocidade* Math.sin(this.angulo)
            
        //}
        this.angulo += this.velocidadeAngular
        this.velocidade = 2*(this.keys.w + this.keys.s)
        this.velocidadeAngular = 0.05*(this.keys.a + this.keys.d)
    }
}

class Raio{
    constructor({
        coordenadas,
        angulo
    }){
        this.coordenadas = coordenadas
        this.angulo = angulo
    }

    raiosVerticais(angulo){
        let inicioX = jogador.posicao.x
        let inicioY = jogador.posicao.y
    
        let fimX = inicioX
        let fimY = inicioY
    
        if( Math.cos(angulo) > 0 ){
            fimX = Math.floor(jogador.posicao.x / tamanho) * tamanho + tamanho
            fimY = inicioY + (fimX-inicioX) * Math.tan(angulo)
            while (fimX < mapa_tamanho* tamanho && fimX >= 0 && fimY < mapa_tamanho* tamanho && fimY >= 0 && mapa[Math.floor(fimY/tamanho)][Math.floor(fimX/tamanho)] ==0 ){
                fimX += tamanho
                fimY += tamanho * Math.tan(angulo)
            
            }
            
        }
        
        if(Math.cos(angulo) < 0){
            fimX = Math.floor(jogador.posicao.x / tamanho) * tamanho
            fimY = inicioY + (fimX-inicioX) * Math.tan(angulo)
            while (fimX < mapa_tamanho* tamanho && fimX >= tamanho && fimY < mapa_tamanho* tamanho && fimY >= 0 && mapa[Math.floor(fimY/tamanho)][Math.floor(fimX/tamanho) -1 ] ==0 ){
                fimX -= tamanho
                fimY -= tamanho * Math.tan(angulo)
            
            } 
        }
        
        // console.log("x:" + Math.floor(fimX/tamanho)) 
        // console.log("y:" + Math.floor(fimY/tamanho))
        
        return [fimX, fimY]
    }
    
    raiosHorizontais(angulo){
        let inicioX = jogador.posicao.x
        let inicioY = jogador.posicao.y
    
        let fimX = inicioX
        let fimY = inicioY
    
        if( Math.sin(angulo) > 0 ){
            fimY = Math.floor(jogador.posicao.y / tamanho) * tamanho + tamanho
            fimX = inicioX + (fimY-inicioY) / (Math.tan(angulo) + 0.0001)
            while (fimX < mapa_tamanho* tamanho && fimX >= 0 && fimY < mapa_tamanho* tamanho && fimY >= 0 && mapa[Math.floor(fimY/tamanho)][Math.floor(fimX/tamanho)] ==0 ){
                fimY += tamanho
                fimX += tamanho  / (Math.tan(angulo) + 0.0001)
            
            }
            
        }
        
        if(Math.sin(angulo) < 0){
            fimY = Math.floor(jogador.posicao.y / tamanho) * tamanho
            fimX = inicioX + (fimY-inicioY)  / (Math.tan(angulo) + 0.0001)
            while (fimX < mapa_tamanho* tamanho && fimX >= 0 && fimY < mapa_tamanho* tamanho && fimY >= tamanho && mapa[Math.floor(fimY/tamanho) - 1][Math.floor(fimX/tamanho)] ==0 ){
                fimY -= tamanho
                fimX -= tamanho  / (Math.tan(angulo) + 0.0001)
            
            } 
        }
        
        // console.log("x:" + Math.floor(fimX/tamanho)) 
        // console.log("y:" + Math.floor(fimY/tamanho))
       
        return [fimX, fimY]
    }
    
    desenharRaio(angulo){
    
        let inicioX = jogador.posicao.x
        let inicioY = jogador.posicao.y
    
        let vertical = this.raiosVerticais(angulo)
        let horizontal = this.raiosHorizontais(angulo)
    
        let modulo_vertical = Math.hypot(vertical[0] - inicioX, vertical[1] - inicioY)
        let modulo_horizontal = Math.hypot(horizontal[0] - inicioX, horizontal[1] - inicioY)
    
        let cor, fimX, fimY
    
        if(modulo_horizontal < modulo_vertical){
            cor = 'green'
            fimX = horizontal[0]
            fimY = horizontal[1]
            this.modulo = modulo_horizontal
            this.raio_usado = 'horizontal'
        }else{
            cor = 'blue'
            fimX = vertical[0]
            fimY = vertical[1]
            this.modulo = modulo_vertical
            this.raio_usado = 'vertical'

        }
    
        ctx.beginPath()
        ctx.strokeStyle = cor
        ctx.moveTo(inicioX, inicioY)
        ctx.lineTo(fimX, fimY)
        ctx.stroke()
        ctx.closePath()
    
    }

    update(){
        this.desenharRaio(jogador.angulo + this.angulo)
    }

}

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

function seColidiuComParede(x, y){
    //console.log(mapa[Math.floor(x/tamanho)][Math.floor(y/tamanho)])
    console.log(Math.floor(x/tamanho))
    //console.log(Math.floor(y/tamanho))

    if(mapa[Math.floor(x/tamanho)][Math.floor(y/tamanho)] != 0){
        return true
    }
    return false
}