# 🎹 Piano Virtual

Bem-vindo ao **Piano Virtual**! Um simulador de piano interativo e elegante que permite tocar música diretamente no seu navegador. Toque usando o teclado do computador ou clicando nas teclas com o mouse.

<p align="center">
  <img src="./images/piano.png" alt="Simulador de Piano Virtual">
</p>

## ✨ Características

### Recursos Básicos

- 🎵 **25 teclas** simulando um piano real com 2 oitavas completas (teclas brancas e pretas)
- ⌨️ **Controle por teclado** - Toque usando as teclas do seu computador
- 🖱️ **Controle por mouse** - Clique nas teclas para tocar
- 🔊 **Controle de volume** - Ajuste o volume do áudio em tempo real
- 👁️ **Mostrar/Ocultar teclas** - Alterne a visibilidade das letras nas teclas
- 🎨 **Design moderno** - Interface elegante e responsiva
- ⚡ **Feedback visual** - Animação ao pressionar as teclas

### Recursos Avançados

- 🎙️ **Sistema de gravação** - Grave suas composições e reproduza depois
- 🎺 **Seleção de instrumentos** - Escolha entre Piano, Órgão e Sintetizador
- 📊 **Visualizador de áudio** - Veja as ondas sonoras em tempo real
- ⏱️ **Metrônomo integrado** - Configure o BPM de 40 a 240 para praticar
- ♿ **Totalmente acessível** - Compatível com leitores de tela (WCAG)

## 🚀 Tecnologias

- **HTML5** - Estrutura semântica da aplicação
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript ES6+** - Arquitetura modular com classes
- **Web Audio API** - Reprodução de sons e efeitos de áudio
- **Canvas API** - Visualização de ondas sonoras em tempo real
- **Google Fonts (Poppins)** - Tipografia moderna

## 🎮 Como Usar

### Online

🎁 [Clique aqui para tocar agora](https://billcarioca.github.io/simulador-de-piano/)

### Localmente

1. Clone este repositório:

```bash
git clone https://github.com/billcarioca/simulador-de-piano.git
```

2. Navegue até o diretório:

```bash
cd simulador-de-piano
```

3. Abra o arquivo `index.html` no seu navegador

## ⌨️ Mapeamento de Teclas

### Oitava Grave (C3-G3)

| Tecla | Nota | Tipo |
|-------|------|------|
| Z | Dó (C3) | Branca |
| X | Dó# (C#3) | Preta |
| C | Ré (D3) | Branca |
| V | Ré# (D#3) | Preta |
| B | Mi (E3) | Branca |
| N | Fá (F3) | Branca |
| M | Fá# (F#3) | Preta |
| , | Sol (G3) | Branca |

### Oitava Média (C4-E5) - Original

| Tecla | Nota | Tipo |
|-------|------|------|
| A | Dó (C4) | Branca |
| W | Dó# (C#4) | Preta |
| S | Ré (D4) | Branca |
| E | Ré# (D#4) | Preta |
| D | Mi (E4) | Branca |
| F | Fá (F4) | Branca |
| T | Fá# (F#4) | Preta |
| G | Sol (G4) | Branca |
| Y | Sol# (G#4) | Preta |
| H | Lá (A4) | Branca |
| U | Lá# (A#4) | Preta |
| J | Si (B4) | Branca |
| K | Dó (C5) | Branca |
| O | Dó# (C#5) | Preta |
| L | Ré (D5) | Branca |
| P | Ré# (D#5) | Preta |
| ; | Mi (E5) | Branca |

## 📁 Estrutura do Projeto

```
simulador-de-piano/
├── index.html              # Página principal
├── src/
│   ├── scripts/
│   │   ├── engine.js       # Orquestrador principal
│   │   └── modules/        # Módulos da aplicação
│   │       ├── Piano.js    # Lógica do piano e áudio
│   │       ├── Recorder.js # Sistema de gravação
│   │       ├── Metronome.js# Metrônomo
│   │       └── Visualizer.js # Visualizador de áudio
│   ├── styles/
│   │   ├── main.css        # Estilos principais
│   │   └── reset.css       # Reset CSS
│   ├── tunes/              # Arquivos de áudio (.wav)
│   └── images/             # Imagens e ícones
└── README.md               # Documentação
```

## 🎯 Funcionalidades Implementadas

- [x] Gravação e reprodução de músicas
- [x] Múltiplas oitavas (2 oitavas completas)
- [x] Diferentes instrumentos (Piano, Órgão, Sintetizador)
- [x] Visualizador de ondas sonoras em tempo real
- [x] Metrônomo integrado (40-240 BPM)

## 💡 Próximas Melhorias

- [ ] Modo de aprendizado com partituras
- [ ] Exportação de gravações em formato MIDI
- [ ] Mais instrumentos e efeitos de áudio
- [ ] Suporte a pedal sustain
- [ ] Temas personalizáveis

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Bill Carioca](https://www.linkedin.com/in/billcarioca/)

Projeto educacional criado como parte do curso da **Digital Innovation One**.

---

⭐ Se você gostou deste projeto, deixe uma estrela no repositório!
