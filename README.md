# Space Worm - Jogo de Asteroides

Um jogo clássico de asteroides recriado em HTML5 com JavaScript puro, usando as imagens fornecidas.

## 🎮 Como Jogar

### Controles
- **WASD** ou **Setas**: Mover a nave
- **Espaço**: Atirar

### Objetivo
Destrua todos os meteoros para avançar para a próxima fase. Cada meteoro tem 3 vidas e se divide em pedaços menores quando atingido.

### Mecânicas do Jogo

#### Sistema de Vidas
- Cada meteoro tem 3 vidas
- Quando atingido, perde 1 vida e se divide em 2 pedaços menores
- Os pedaços menores mantêm o número de vidas restantes
- Quando um meteoro é completamente destruído, você ganha pontos

#### Sistema de Fases
- Cada fase aumenta a dificuldade
- Mais meteoros aparecem a cada fase
- Diferentes variações de cor dos meteoros
- Velocidade dos meteoros aumenta gradualmente

#### Sistema de Partículas
- Efeitos visuais quando atira
- Explosões coloridas quando meteoros são destruídos
- Efeito especial na transição entre fases
- Fundo estrelado animado

#### Movimento Infinito
- A nave e os meteoros passam de um lado da tela para o outro
- Movimento suave e contínuo
- Física realista com inércia e atrito

## 🎨 Características Visuais

- Interface moderna com gradientes
- Efeitos de partículas coloridas
- Sistema de explosões realista
- Fundo espacial animado
- UI informativa com pontuação, vidas e fase atual

## 🚀 Como Executar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. O jogo carregará automaticamente
3. Use os controles para jogar
4. Tente alcançar a maior pontuação possível!

## 📁 Estrutura dos Arquivos

```
space worm/
├── index.html          # Arquivo principal do jogo
├── game.js            # Lógica do jogo em JavaScript
├── README.md          # Este arquivo
├── imagens/
│   ├── player.png     # Imagem da nave
│   └── meteoro.png    # Imagem dos meteoros
└── arquivos/
    ├── player.ase     # Arquivo original da nave
    └── meteoro.ase    # Arquivo original do meteoro
```

## 🎯 Dicas para Jogar

1. **Mantenha distância**: Evite ficar muito perto dos meteoros
2. **Use o movimento infinito**: Aproveite que pode sair de um lado e aparecer do outro
3. **Atire estrategicamente**: Tente acertar meteoros que estão se movendo em direções opostas
4. **Observe os padrões**: Cada fase tem um padrão diferente de meteoros
5. **Mantenha a calma**: O jogo fica mais difícil a cada fase, mas é possível!

## 🔧 Tecnologias Utilizadas

- HTML5 Canvas
- JavaScript ES6+
- CSS3 para estilização
- Sistema de partículas customizado
- Física de jogo realista

Divirta-se jogando! 🚀✨ 