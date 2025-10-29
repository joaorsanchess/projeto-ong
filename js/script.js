/* ===================================================
   NOSSA FONTE DE DADOS (DATABASE FAKE)
   =================================================== */
const dadosDosProjetos = [
  {
    id: "projeto-educacao",
    titulo: "Projeto Educação para o Futuro",
    imagem: {
      src: "../imagens/salafuturo.webp",
      alt: "Alunos em uma sala de informática com uma instrutora.",
      width: 600,
      height: 400
    },
    figcaption: "Alunos participando do projeto Educação para o Futuro.",
    descricao: "Oferecemos reforço escolar, oficinas de leitura e cursos de informática para crianças e adolescentes, preparando-os para um futuro brilhante.",
    badge: {
      texto: "Educação",
      classe: "badge-educacao"
    }
  },
  {
    id: "projeto-comunidade",
    titulo: "Ação Comunitária: Prato Cheio",
    imagem: {
      src: "../imagens/organizandodoacoes.webp",
      alt: "Voluntários organizando caixas de doações de roupas e alimentos.",
      width: 600,
      height: 400
    },
    figcaption: "Voluntários organizando doações para a comunidade.",
    descricao: "Distribuímos cestas básicas, roupas e itens de higiene para famílias em situação de vulnerabilidade, garantindo segurança alimentar e dignidade.",
    badge: {
      texto: "Comunidade",
      classe: "badge-comunidade"
    }
  }
];

/* ===================================================
   DEFINIÇÕES GLOBAIS DE FUNÇÕES
   (Movidas para fora do DOMContentLoaded para o Roteador SPA)
   =================================================== */

/**
 * Configura os event listeners para o menu hambúrguer.
 */
function inicializarMenuHamburguer() {
  const menuHamburguer = document.querySelector(".menu-hamburguer");
  const navPrincipal = document.getElementById("navegacaoPrincipal");

  if (menuHamburguer && navPrincipal) {
    // Nota: Os listeners do menu são adicionados uma vez e
    // permanecem válidos, pois o <header> não é recarregado.
    
    // Previne múltiplos listeners se a função for chamada acidentalmente de novo
    if (menuHamburguer.dataset.listenerAdicionado === "true") {
      return;
    }
    menuHamburguer.dataset.listenerAdicionado = "true";

    menuHamburguer.addEventListener("click", function () {
      navPrincipal.classList.toggle("menu-aberto");
      menuHamburguer.classList.toggle("menu-aberto");
      const menuEstaAberto = navPrincipal.classList.contains("menu-aberto");
      menuHamburguer.setAttribute("aria-expanded", menuEstaAberto);

      if (menuEstaAberto) {
        const primeiroLink = navPrincipal.querySelector("a");
        if (primeiroLink) {
          primeiroLink.focus();
        }
      }
    });
    document.addEventListener("click", function (event) {
      const menuEstaAberto = navPrincipal.classList.contains("menu-aberto");
      const clicouDentroDoMenu = navPrincipal.contains(event.target);
      const clicouNoBotao = menuHamburguer.contains(event.target);
      if (menuEstaAberto && !clicouDentroDoMenu && !clicouNoBotao) {
        navPrincipal.classList.remove("menu-aberto");
        menuHamburguer.classList.remove("menu-aberto");
        menuHamburguer.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        navPrincipal.classList.contains("menu-aberto")
      ) {
        navPrincipal.classList.remove("menu-aberto");
        menuHamburguer.classList.remove("menu-aberto");
        menuHamburguer.setAttribute("aria-expanded", "false");
        menuHamburguer.focus();
      }
    });
  }
} // Fim da função inicializarMenuHamburguer

/**
 * Configura a validação do formulário de cadastro.
 */
function inicializarValidacaoFormulario() {
  const form = document.getElementById("formCadastro");
  if (!form) return; // Guarda: Só roda na página de cadastro

  // console.log("Estamos na página de cadastro! Inicializando validação...");

  const inputs = Array.from(form.querySelectorAll(".campo-entrada")); 
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");
  const dataNascimentoInput = document.getElementById("nascimento");
  const enderecoInput = document.getElementById("endereco");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const mensagemSucesso = document.getElementById("form-mensagem-sucesso");
  const STORAGE_KEY = 'dadosFormularioCadastro';

  // --- Funções Auxiliares de Validação e Feedback ---
  function mostrarErro(inputElement, mensagem) {
    let errorSpan = inputElement.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains("mensagem-erro")) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("mensagem-erro");
      errorSpan.setAttribute("aria-live", "polite");
      inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
    }
    errorSpan.textContent = mensagem;
    inputElement.setAttribute("aria-invalid", "true");
    inputElement.classList.add("invalido");
    inputElement.classList.remove("valido");
  }

  function limparErro(inputElement) {
    let errorSpan = inputElement.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("mensagem-erro")) {
      errorSpan.textContent = "";
    }
    inputElement.setAttribute("aria-invalid", "false");
    inputElement.classList.remove("invalido");
    inputElement.classList.add("valido");
  }

  function limparTodosErros(formElement) {
      const errorSpans = formElement.querySelectorAll('.mensagem-erro');
      errorSpans.forEach(span => span.textContent = '');
      const inputs = formElement.querySelectorAll('.campo-entrada');
      inputs.forEach(input => {
          input.setAttribute('aria-invalid', 'false');
          input.classList.remove('invalido', 'valido');
      });
      if(mensagemSucesso) mensagemSucesso.style.display = 'none';
  }

  // --- Funções de máscara ---
  function mascaraCpf(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor.substring(0, 14);
  }
  function mascaraTelefone(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor.substring(0, 15);
  }
  function mascaraCep(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    return valor.substring(0, 9);
  }

  // --- Funções Específicas de Validação ---
  function validaCampoObrigatorio(input) { return input && input.value.trim() !== ''; }
  function validaNomeCompleto(input) { return input && input.value.trim().split(" ").length >= 2; }
  function validaEmailFormato(input) { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return input && emailRegex.test(input.value); }
  function validaTamanhoCampo(input, tamanho) { return input && input.value.length === tamanho; }

  // --- Funções do LocalStorage ---
  function salvarDadosFormulario() {
      const dados = {};
      inputs.forEach(input => {
          if (input.id) {
              dados[input.id] = input.value;
          }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  }

  function carregarDadosFormulario() {
      const dadosSalvos = localStorage.getItem(STORAGE_KEY);
      if (dadosSalvos) {
          console.log("Carregando dados salvos do localStorage...");
          const dados = JSON.parse(dadosSalvos);
          inputs.forEach(input => {
              if (input.id && dados[input.id]) {
                  input.value = dados[input.id];
              }
          });
      }
  }

  // --- Validação em Tempo Real e Listeners ---
  inputs.forEach(input => {
      const evento = (input.tagName.toLowerCase() === 'select') ? 'change' : 'input';
      input.addEventListener(evento, salvarDadosFormulario);
  });
  if (nomeInput) {
    nomeInput.addEventListener("input", function () {
      nomeInput.value = nomeInput.value.replace(/[0-9]/g, "");
      if (!validaNomeCompleto(nomeInput) && nomeInput.value.trim() !== '') {
          mostrarErro(nomeInput, "Digite nome e sobrenome.");
      } else {
          limparErro(nomeInput);
      }
    });
  }
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (emailInput.value.trim() !== '' && !validaEmailFormato(emailInput)) {
        mostrarErro(emailInput, "Formato de e-mail inválido.");
      } else {
        limparErro(emailInput);
      }
    });
    emailInput.addEventListener("input", () => limparErro(emailInput));
  }
  if (cpfInput) cpfInput.addEventListener("input", (e) => { e.target.value = mascaraCpf(e.target.value); limparErro(e.target); });
  if (telefoneInput) telefoneInput.addEventListener("input", (e) => { e.target.value = mascaraTelefone(e.target.value); limparErro(e.target); });
  if (cepInput) cepInput.addEventListener("input", (e) => { e.target.value = mascaraCep(e.target.value); limparErro(e.target); });
  [dataNascimentoInput, enderecoInput, cidadeInput].forEach(
    (input) => { if (input) input.addEventListener("input", () => limparErro(input)); }
  );
  if(estadoInput) estadoInput.addEventListener("change", () => limparErro(estadoInput));

  // --- Validação no Envio (Submit Listener) ---
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Tentativa de envio interceptada!");
    let formularioValido = true;
    limparTodosErros(form); 

    if (!validaNomeCompleto(nomeInput)) { mostrarErro(nomeInput, "Por favor, insira seu nome completo."); if (formularioValido) nomeInput.focus(); formularioValido = false; }
    if (!validaEmailFormato(emailInput)) { mostrarErro(emailInput, "Formato de e-mail inválido."); if (formularioValido) emailInput.focus(); formularioValido = false; }
    if (!validaTamanhoCampo(cpfInput, 14)) { mostrarErro(cpfInput, "CPF inválido. Use o formato 000.000.000-00."); if (formularioValido) cpfInput.focus(); formularioValido = false; }
    if (!validaTamanhoCampo(telefoneInput, 15)) { mostrarErro(telefoneInput, "Telefone inválido. Use o formato (00) 00000-0000."); if (formularioValido) telefoneInput.focus(); formularioValido = false; }
    if (!validaCampoObrigatorio(dataNascimentoInput)) { mostrarErro(dataNascimentoInput, "Data de nascimento é obrigatória."); if (formularioValido) dataNascimentoInput.focus(); formularioValido = false; }
    if (!validaTamanhoCampo(cepInput, 9)) { mostrarErro(cepInput, "CEP inválido. Use o formato 00000-000."); if (formularioValido) cepInput.focus(); formularioValido = false; }
    if (!validaCampoObrigatorio(enderecoInput)) { mostrarErro(enderecoInput, "Endereço é obrigatório."); if (formularioValido) enderecoInput.focus(); formularioValido = false; }
    if (!validaCampoObrigatorio(cidadeInput)) { mostrarErro(cidadeInput, "Cidade é obrigatória."); if (formularioValido) cidadeInput.focus(); formularioValido = false; }
    if (!validaCampoObrigatorio(estadoInput)) { mostrarErro(estadoInput, "Estado é obrigatório."); if (formularioValido) estadoInput.focus(); formularioValido = false; }

    // --- Resultado da Validação ---
    if (formularioValido) {
      console.log("Formulário válido! Enviando dados (simulado)...");
      
      if (mensagemSucesso) {
          mensagemSucesso.style.display = 'block';
          mensagemSucesso.focus();
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
          setTimeout(() => {
              mensagemSucesso.style.display = 'none';
          }, 5000);
      }
      
      form.reset();
      localStorage.removeItem(STORAGE_KEY);
      console.log("Dados do localStorage limpos.");

      form.querySelectorAll(".campo-entrada").forEach((input) => {
        input.classList.remove("valido", "invalido");
        input.setAttribute("aria-invalid", "false");
      });
      form.querySelectorAll(".mensagem-erro").forEach(span => span.textContent = '');
    } else {
      console.log("Formulário inválido.");
    }
  });

  // Carrega dados do localStorage ao iniciar
  carregarDadosFormulario();

} // Fim da função inicializarValidacaoFormulario


/**
 * Renderiza dinamicamente os cards de projeto na página.
 */
function inicializarTemplatingProjetos() {
  const containerProjetos = document.getElementById("grid-dinamica-projetos");
  if (!containerProjetos) return; // Guarda: Só roda na página de projetos

  console.log("Estamos na página de projetos! Renderizando cards...");
  
  // Limpa apenas os 'article' antigos, mantendo h2 e p
  containerProjetos.querySelectorAll('article.projeto-card').forEach(card => card.remove());

  // O Loop de Template (A MÁGICA)
  dadosDosProjetos.forEach(projeto => {
    
    const cardHTML = `
      <article class="projeto-card" id="${projeto.id}">
        <div class="card-badges">
          <span class="badge ${projeto.badge.classe}">${projeto.badge.texto}</span>
        </div>
        <h3>${projeto.titulo}</h3>
        <figure>
          <img
            src="${projeto.imagem.src}"
            alt="${projeto.imagem.alt}"
            loading="lazy"
            width="${projeto.imagem.width}"
            height="${projeto.imagem.height}"
          />
          <figcaption>
            ${projeto.figcaption}
          </figcaption>
        </figure>
        <p>
          ${projeto.descricao}
        </p>
      </article>
    `;
    
    containerProjetos.insertAdjacentHTML('beforeend', cardHTML);
  });

} // Fim da função inicializarTemplatingProjetos


/* ===================================================
   EXECUTA QUANDO O DOM ESTIVER PRONTO
   =================================================== */
document.addEventListener("DOMContentLoaded", function () {
  
  /* --- NOVO (Tarefa 6.4): Funções do Roteador SPA --- */
  
  /**
   * Re-inicializa os scripts que dependem do conteúdo do <main>.
   * Chamado toda vez que o 'carregarPagina' substitui o HTML.
   */
  function reiniciarScriptsDaPagina() {
    console.log("Reinicializando scripts da página (validação e templating)...");
    inicializarValidacaoFormulario();
    inicializarTemplatingProjetos();
  }

  /**
   * Carrega o conteúdo da nova página via fetch e atualiza o DOM.
   * @param {string} url - A URL da página a ser carregada (ex: 'cadastro.html').
   * @param {HTMLElement} mainContainer - O elemento <main> a ser atualizado.
   * @param {boolean} [pushState=true] - Se deve (true) ou não (false)
                                          adicionar ao histórico do navegador.
   */
  async function carregarPagina(url, mainContainer, pushState = true) {
    try {
      // 1. (Feedback visual) Adiciona uma classe de 'loading'
      mainContainer.style.opacity = '0.5';
      mainContainer.style.transition = 'opacity 0.3s ease-out';

      // 2. Faz o 'fetch' (requisição assíncrona) do arquivo HTML
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Não foi possível carregar a página: ${response.statusText}`);
      }
      const text = await response.text(); // Pega o HTML como texto

      // 3. (Mágica) Usa o DOMParser para transformar o texto HTML
      // em um documento HTML que o JS pode "ler"
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(text, 'text/html');

      // 4. Extrai o <main> e o <title> do NOVO documento
      const newMain = newDoc.getElementById('main-content');
      const newTitle = newDoc.querySelector('title').innerText;

      if (newMain) {
        // 5. (A Troca) Substitui o conteúdo do <main> atual
        //    pelo conteúdo do NOVO <main>
        mainContainer.innerHTML = newMain.innerHTML;
        mainContainer.style.opacity = '1'; // Remove a opacidade
        
        // 6. (Bônus UX) Rola a página para o topo
        window.scrollTo(0, 0);

        // 7. (Bônus Profissional) Atualiza o <title> da página
        document.title = newTitle;

        // 8. (Bônus Profissional) Atualiza a URL na barra do navegador
        if (pushState) {
          // 'pushState' adiciona a nova URL ao histórico
          history.pushState({ path: url }, newTitle, url);
        }

        // 9. (CRÍTICO) Reinicia os scripts!!!
        // Nossos scripts (form, templating) morreram quando
        // trocamos o HTML. Precisamos chamá-los de novo.
        reiniciarScriptsDaPagina();
        
      } else {
        throw new Error('Conteúdo principal não encontrado na página carregada.');
      }
    } catch (error) {
      console.error('Erro ao carregar a página:', error);
      mainContainer.style.opacity = '1'; // Reseta a opacidade no erro
      // Se falhar, faz o recarregamento normal (plano B)
      window.location.href = url;
    }
  } // Fim da função carregarPagina


  /**
   * Inicia a lógica de Single Page Application (SPA)
   * Intercepta cliques nos links de navegação principal.
   */
  function inicializarRoteadorSPA() {
    const mainContent = document.getElementById('main-content');
    
    // Seleciona TODOS os links dentro da navegação
    // (Incluindo os links do submenu que acabamos de criar)
    const navLinks = document.querySelectorAll('#navegacaoPrincipal a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Só intercepta links internos (que ficam no nosso site)
      // Ignora: links para # (âncoras), mailto:, tel:
      // Ignora: links que não terminam com .html
      // (Atualizado): Nós VAMOS interceptar o link "projetos.html"
      if (href && href.endsWith('.html')) {
        
        link.addEventListener('click', function(event) {
          // PREVINE o recarregamento padrão da página
          event.preventDefault(); 
          
          // Se for um link de submenu que aponta para uma âncora
          // (ex: projetos.html#projeto-educacao)
          if (href.includes('#')) {
            // Separa a URL da âncora
            const [url, anchorId] = href.split('#');
            
            // Se já estivermos na página de projetos, só rola
            if (window.location.pathname.endsWith(url)) {
              console.log("Já estamos na página, rolando para a âncora:", anchorId);
              document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
              // Se estivermos em outra página (ex: index.html),
              // primeiro carrega a página de projetos
              carregarPagina(url, mainContent).then(() => {
                // E DEPOIS que carregar, rola para a âncora
                console.log("Página carregada, rolando para a âncora:", anchorId);
                document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
              });
            }
          } else {
            // Se for um link simples (index.html, cadastro.html)
            carregarPagina(href, mainContent);
          }

          // (Bônus UX) Fecha o menu hambúrguer (se estiver aberto)
          const menuHamburguer = document.querySelector(".menu-hamburguer");
          const navPrincipal = document.getElementById("navegacaoPrincipal");
          if (navPrincipal.classList.contains("menu-aberto")) {
            navPrincipal.classList.remove("menu-aberto");
            menuHamburguer.classList.remove("menu-aberto");
            menuHamburguer.setAttribute("aria-expanded", "false");
          }
        });
      }
    });

    // (Profissional) Ouvir o botão "Voltar" do navegador
    window.addEventListener('popstate', function(event) {
      if (event.state && event.state.path) {
        console.log("Botão 'Voltar' detectado. Carregando:", event.state.path);
        // 'false' = não adicione ao histórico (pois já estamos navegando pelo histórico)
        carregarPagina(event.state.path, mainContent, false); 
      }
    });
    
    // (Profissional) Salva o estado da página atual ao carregar
    // (Usando a URL base do repositório, se aplicável, ou pathname simples)
    const basePath = window.location.pathname.endsWith('/') ? 
                     window.location.pathname.slice(0, -1) : 
                     window.location.pathname;
                     
    history.replaceState({ path: basePath || 'index.html' }, '', window.location.href);

  } // Fim da função inicializarRoteadorSPA
  
  
  /* --- CHAMADAS DE INICIALIZAÇÃO --- */
  
  // 1. Funções que só precisam rodar UMA VEZ
  inicializarMenuHamburguer();
  
  // 2. Funções que precisam rodar na CARGA INICIAL da página
  inicializarValidacaoFormulario();
  inicializarTemplatingProjetos();
  
  // 3. Inicia o Roteador SPA (a última coisa a fazer)
  inicializarRoteadorSPA();

}); // Fim do 'DOMContentLoaded'