/* ===================================================
   EXECUTA QUANDO O DOM ESTIVER PRONTO
   =================================================== */
document.addEventListener("DOMContentLoaded", function () {
  /* ===================================================
     SELEÇÃO GERAL DE ELEMENTOS (USADOS EM VÁRIAS TAREFAS)
     =================================================== */
  const form = document.getElementById("formCadastro"); // Para Tarefa 2 (Formulário)
  const menuHamburguer = document.querySelector(".menu-hamburguer"); // Para Tarefa 3 (Menu)
  const navPrincipal = document.querySelector("header nav"); // Para Tarefa 3 (Menu)

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
    });
  }

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

    // --- Validação em Tempo Real ---

    if (nomeInput) {
      nomeInput.addEventListener("input", function () {
        nomeInput.value = nomeInput.value.replace(/[0-9]/g, "");
      });
    }

    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value) && emailInput.value !== "") {
          alert("Formato de e-mail inválido!");
          // emailInput.focus(); // Linha corretamente removida/comentada
        }
      });
    }

    if (cpfInput) {
      cpfInput.addEventListener("input", function () {
        let valor = cpfInput.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        cpfInput.value = valor.substring(0, 14);
      });
    }

    if (telefoneInput) {
      telefoneInput.addEventListener("input", function () {
        let valor = telefoneInput.value.replace(/\D/g, "");
        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        telefoneInput.value = valor.substring(0, 15);
      });
    }

    if (cepInput) {
      cepInput.addEventListener("input", function () {
        let valor = cepInput.value.replace(/\D/g, "");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        cepInput.value = valor.substring(0, 9);
      });
    }

    // --- Validação no Envio ---
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Tentativa de envio interceptada!");

      let formularioValido = true;

      // Validar Nome (Exemplo)
      if (!nomeInput || nomeInput.value.trim().split(" ").length < 2) {
        alert("Por favor, insira seu nome completo.");
        if (nomeInput) nomeInput.focus();
        formularioValido = false;
        return;
      }

      // Validar Email (Exemplo)
      const emailRegexSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegexSubmit.test(emailInput.value)) {
        alert("Formato de e-mail inválido!");
        if (emailInput) emailInput.focus();
        formularioValido = false;
        return;
      }

      // Adicionar mais validações aqui...
      // Ex: Validar se CPF tem 14 caracteres, Telefone 15, CEP 9
      if (!cpfInput || cpfInput.value.length !== 14) {
        alert("CPF inválido. Use o formato 000.000.000-00.");
        if (cpfInput) cpfInput.focus();
        formularioValido = false;
        return;
      }
      if (!telefoneInput || telefoneInput.value.length !== 15) {
        alert("Telefone inválido. Use o formato (00) 00000-0000.");
        if (telefoneInput) telefoneInput.focus();
        formularioValido = false;
        return;
      }
      if (!cepInput || cepInput.value.length !== 9) {
        alert("CEP inválido. Use o formato 00000-000.");
        if (cepInput) cepInput.focus();
        formularioValido = false;
        return;
      }

      // Se tudo OK
      if (formularioValido) {
        console.log("Formulário válido! Enviando dados (simulado)...");
        alert("Cadastro enviado com sucesso! (Simulado)");
        form.reset();
      } else {
        console.log("Formulário inválido.");
      }
    });
  } // Fim do if (form)
}); // Fim do 'DOMContentLoaded'
