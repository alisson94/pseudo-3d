addEventListener('keydown', (e) => {

    switch (e.key) {
        case 'w':
            jogador.keys.w =1
            break;
        case 's':
            jogador.keys.s =-1
            break;
        case 'a':
            jogador.keys.a =-1
            break;
        case 'd':
            jogador.keys.d =1
            break;

        case 'q':
            jogador.fov--
            break

        case 'e':
            jogador.fov++
            break
        default:
            break;
    }
})

addEventListener('keyup', (e)=>{
    switch (e.key) {
        case 'w':
            jogador.keys.w =0
            break;
        case 's':
            jogador.keys.s =0
            break;
        case 'a':
            jogador.keys.a =0
            break;
        case 'd':
            jogador.keys.d =0
            break;
        default:
            break;
    }
})
