/* ===================================================
   EXECUTA QUANDO O DOM ESTIVER PRONTO
   =================================================== */
document.addEventListener("DOMContentLoaded", function () {
  /* ===================================================
     SELEÇÃO GERAL DE ELEMENTOS (USADOS EM VÁRIAS TAREFAS)
     =================================================== */
  const form = document.getElementById("formCadastro"); // Para Tarefa 2 (Formulário)
  const menuHamburguer = document.querySelector(".menu-hamburguer"); // Para Tarefa 3 (Menu)
  // Seleciona a NAV pelo ID que adicionamos para acessibilidade
  const navPrincipal = document.getElementById("navegacaoPrincipal"); // Para Tarefa 3 (Menu)

  /* ===================================================
     TAREFA 3: FUNCIONALIDADE DO MENU HAMBÚRGUER
     =================================================== */

  // Verifica se o botão hambúrguer e a navegação existem
  if (menuHamburguer && navPrincipal) {
    menuHamburguer.addEventListener("click", function () {
      // Alterna a classe na NAV para mostrar/esconder
      navPrincipal.classList.toggle("menu-aberto");
      // (REFINAMENTO 3) Alterna a classe no BOTÃO para animar o ícone
      menuHamburguer.classList.toggle("menu-aberto");

      // Atualiza o aria-expanded no botão para acessibilidade
      const menuEstaAberto = navPrincipal.classList.contains("menu-aberto");
      menuHamburguer.setAttribute("aria-expanded", menuEstaAberto);

      // (Refinamento Acessibilidade) Foca no primeiro link quando o menu abre
      if (menuEstaAberto) {
        const primeiroLink = navPrincipal.querySelector("a");
        if (primeiroLink) {
          primeiroLink.focus();
        }
      }
    });

    // (Refinamento Acessibilidade) Fecha o menu se clicar fora dele
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

    // (Refinamento Acessibilidade) Fecha o menu se apertar a tecla ESC
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        navPrincipal.classList.contains("menu-aberto")
      ) {
        navPrincipal.classList.remove("menu-aberto");
        menuHamburguer.classList.remove("menu-aberto");
        menuHamburguer.setAttribute("aria-expanded", "false");
        menuHamburguer.focus(); // Devolve o foco ao botão
      }
    });
  } // Fim do if (menuHamburguer && navPrincipal)

  /* ===================================================
     TAREFA 2: VALIDAÇÃO JAVASCRIPT DO FORMULÁRIO
     (Só executa se estivermos na página de cadastro)
     =================================================== */

  // Verifica se o formulário existe na página atual
  if (form) {
    // Seleciona os campos DENTRO do IF
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");
    // Adicionar outros inputs se precisar validar
    const dataNascimentoInput = document.getElementById("nascimento");
    const enderecoInput = document.getElementById("endereco");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");

    // --- Funções Auxiliares de Validação e Feedback ---
    function mostrarErro(inputElement, mensagem) {
      // Encontra (ou cria) o span de erro associado
      let errorSpan = inputElement.nextElementSibling;
      if (!errorSpan || !errorSpan.classList.contains("mensagem-erro")) {
        errorSpan = document.createElement("span");
        errorSpan.classList.add("mensagem-erro");
        errorSpan.setAttribute("aria-live", "polite"); // Informa leitores de tela sobre a mudança
        inputElement.parentNode.insertBefore(
          errorSpan,
          inputElement.nextSibling
        );
      }
      errorSpan.textContent = mensagem;
      inputElement.setAttribute("aria-invalid", "true"); // Marca como inválido para acessibilidade
      inputElement.classList.add("invalido"); // Adiciona classe para estilização CSS (opcional)
      inputElement.classList.remove("valido");
    }

    function limparErro(inputElement) {
      let errorSpan = inputElement.nextElementSibling;
      if (errorSpan && errorSpan.classList.contains("mensagem-erro")) {
        errorSpan.textContent = "";
      }
      inputElement.setAttribute("aria-invalid", "false");
      inputElement.classList.remove("invalido");
      inputElement.classList.add("valido"); // Adiciona classe para estilização CSS (opcional)
    }

    // --- Validação em Tempo Real ---

    if (nomeInput) {
      nomeInput.addEventListener("input", function () {
        nomeInput.value = nomeInput.value.replace(/[0-9]/g, "");
        // Validação simples de nome completo no input (opcional)
        if (
          nomeInput.value.trim().split(" ").length < 2 &&
          nomeInput.value.trim() !== ""
        ) {
          mostrarErro(nomeInput, "Digite nome e sobrenome.");
        } else {
          limparErro(nomeInput);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        // Valida ao sair
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          emailInput.value.trim() !== "" &&
          !emailRegex.test(emailInput.value)
        ) {
          mostrarErro(emailInput, "Formato de e-mail inválido.");
        } else {
          limparErro(emailInput);
        }
      });
      emailInput.addEventListener("input", function () {
        // Limpa erro ao digitar
        limparErro(emailInput);
      });
    }

    // Funções de máscara
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

    // Aplica máscaras usando input event
    if (cpfInput) {
      cpfInput.addEventListener("input", (e) => {
        e.target.value = mascaraCpf(e.target.value);
        limparErro(e.target);
      });
    }
    if (telefoneInput) {
      telefoneInput.addEventListener("input", (e) => {
        e.target.value = mascaraTelefone(e.target.value);
        limparErro(e.target);
      });
    }
    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        e.target.value = mascaraCep(e.target.value);
        limparErro(e.target);
      });
    }
    // Adiciona limpeza de erro simples para outros campos required
    [dataNascimentoInput, enderecoInput, cidadeInput, estadoInput].forEach(
      (input) => {
        if (input) {
          input.addEventListener("input", () => limparErro(input));
        }
      }
    );

    // --- Validação no Envio ---
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Sempre previne o envio padrão
      console.log("Tentativa de envio interceptada!");

      let formularioValido = true;

      // Limpa erros antigos antes de revalidar
      form.querySelectorAll(".campo-entrada").forEach(limparErro);

      // --- Validações Obrigatórias ---
      // Nome
      if (!nomeInput || nomeInput.value.trim().split(" ").length < 2) {
        mostrarErro(nomeInput, "Por favor, insira seu nome completo.");
        if (formularioValido) nomeInput.focus(); // Foca no primeiro erro
        formularioValido = false;
      }

      // Email
      const emailRegexSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegexSubmit.test(emailInput.value)) {
        mostrarErro(emailInput, "Formato de e-mail inválido.");
        if (formularioValido) emailInput.focus();
        formularioValido = false;
      }

      // CPF (Validação de formato/tamanho)
      if (!cpfInput || cpfInput.value.length !== 14) {
        mostrarErro(cpfInput, "CPF inválido. Use o formato 000.000.000-00.");
        if (formularioValido) cpfInput.focus();
        formularioValido = false;
      }
      // TODO: Adicionar validação REAL de CPF (algoritmo) seria ideal

      // Telefone (Validação de formato/tamanho)
      if (!telefoneInput || telefoneInput.value.length !== 15) {
        mostrarErro(
          telefoneInput,
          "Telefone inválido. Use o formato (00) 00000-0000."
        );
        if (formularioValido) telefoneInput.focus();
        formularioValido = false;
      }

      // Data de Nascimento (Verifica se não está vazio)
      if (!dataNascimentoInput || dataNascimentoInput.value === "") {
        mostrarErro(dataNascimentoInput, "Data de nascimento é obrigatória.");
        if (formularioValido) dataNascimentoInput.focus();
        formularioValido = false;
      }

      // CEP (Validação de formato/tamanho)
      if (!cepInput || cepInput.value.length !== 9) {
        mostrarErro(cepInput, "CEP inválido. Use o formato 00000-000.");
        if (formularioValido) cepInput.focus();
        formularioValido = false;
      }

      // Endereço (Verifica se não está vazio)
      if (!enderecoInput || enderecoInput.value.trim() === "") {
        mostrarErro(enderecoInput, "Endereço é obrigatório.");
        if (formularioValido) enderecoInput.focus();
        formularioValido = false;
      }
      // Cidade (Verifica se não está vazio)
      if (!cidadeInput || cidadeInput.value.trim() === "") {
        mostrarErro(cidadeInput, "Cidade é obrigatória.");
        if (formularioValido) cidadeInput.focus();
        formularioValido = false;
      }
      // Estado (Verifica se não está vazio)
      if (!estadoInput || estadoInput.value.trim() === "") {
        mostrarErro(estadoInput, "Estado é obrigatório.");
        if (formularioValido) estadoInput.focus();
        formularioValido = false;
      }

      // --- Se tudo OK ---
      if (formularioValido) {
        console.log("Formulário válido! Enviando dados (simulado)...");
        // Substituir alert por um feedback mais elegante (ex: mensagem na página)
        alert("Cadastro enviado com sucesso! (Simulado)");
        form.reset();
        // Limpa classes de validação após reset
        form.querySelectorAll(".campo-entrada").forEach((input) => {
          input.classList.remove("valido", "invalido");
        });
      } else {
        console.log("Formulário inválido.");
        // O foco já foi definido no primeiro campo com erro
      }
    }); // Fim do listener 'submit'
  } // Fim do if (form)
}); // Fim do 'DOMContentLoaded'
