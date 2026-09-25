# Minoda Contabilidade

Site institucional estático, pronto para publicação na Vercel ou em uma hospedagem que sirva arquivos HTML.

## Executar localmente

Com Node.js instalado, execute `node serve.mjs` e abra http://127.0.0.1:8011. Não é necessário instalar dependências nem executar uma compilação.

## Publicar

Na Vercel, importe esta pasta com o framework **Other** e diretório de saída **public**. O arquivo `vercel.json` já contém essa configuração. Pela CLI, execute `vercel --prod`.

Para outra hospedagem, envie o conteúdo de `public` para a raiz pública. Os caminhos dos arquivos começam na raiz do domínio.

## Organização

- `public/index.html`: página pré-renderizada e metadados.
- `public/js/page.js`: conteúdo e componentes da página, formatados para leitura.
- `public/js/tax-comparison.js`: sequência Antes → Análise → Depois, com GSAP e ScrollTrigger.
- `public/js/brand-video.js`: reprodução do vídeo e encerramento do preloader.
- `public/js/app.js`: runtime React e roteamento pré-compilados do projeto recebido.
- `public/js/gsap.js`, `scroll-trigger.js`, `lenis.js` e `motion.js`: bibliotecas utilizadas pelo site.
- `public/css/base.css`: estilos estruturais.
- `public/css/site.css`: carrossel e comparativo tributário.
- `public/css/brand.css`: identidade visual, vídeo e refinamentos responsivos.
- `public/css/fonts.css` e `public/assets/fonts`: fontes locais.
- `public/assets/brand`: logos oficiais, favicon e capa do vídeo.
- `public/assets/clients`: capturas reais dos nove clientes, otimizadas em WebP.
- `public/assets/services`: imagens dos serviços, otimizadas em WebP.

O HTML inicial e os componentes de `page.js` representam o mesmo conteúdo. Alterações de textos ou estrutura devem ser feitas nos dois para preservar a hidratação do React. Os módulos adicionais de animação e os estilos podem ser editados diretamente.

## Mídia e movimento

O vídeo institucional é carregado ao entrar na tela, sem som, com controle de pausa. Sai da reprodução quando deixa a área visível ou a aba fica oculta. A preferência por movimento reduzido e a economia de dados desativam a reprodução automática.

O gráfico é ilustrativo: não apresenta números nem resultados de clientes. O carrossel dispõe de pausa manual e também pausa durante foco ou passagem do ponteiro.

## Domínio

Configure o domínio em **Vercel → Settings → Domains**. Depois de conectar o domínio definitivo, atualize os URLs canônicos, Open Graph e dados estruturados em `public/index.html` e `public/js/app.js`.

## Bibliotecas e referências

Mantidos os avisos de licença dos arquivos distribuídos. A animação tributária foi implementada para este projeto, com referências visuais de [React Bits Scroll Reveal](https://reactbits.dev/text-animations/scroll-reveal) e [Container Scroll Animation](https://21st.dev/@manuarora700/components/container-scroll-animation).

As imagens de marca vieram do pacote oficial fornecido. As prévias dos clientes correspondem às páginas públicas indicadas no briefing.

## Publicação atual

https://minoda-contabilidade.vercel.app
