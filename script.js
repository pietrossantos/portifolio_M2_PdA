// Classe Empresa
class Empresa {
  constructor(nome, email, area, membros, descricao) {
    this.nome = nome;
    this.email = email;
    this.area = area;
    this.membros = membros;
    this.descricao = descricao;
  }
}

class EmpresaController {
  constructor() {
    this.empresas = [];
    this.empresaListElement = document.getElementById("empresa-list");
    this.empresaForm = document.getElementById("empresa-form");

    this.empresaForm.addEventListener("submit", (event) =>
      this.adicionarEmpresa(event)
    );

    this.inicializarAutocomplete();
  }

  adicionarEmpresa(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const area = document.getElementById("area").value;
    const membros = document.getElementById("membros").value;
    const descricao = document.getElementById("descricao").value;

    const novaEmpresa = new Empresa(nome, email, area, membros, descricao);
    this.empresas.push(novaEmpresa);

    this.atualizarLista();
    this.empresaForm.reset();
  }

  atualizarLista() {
    this.empresaListElement.innerHTML = "";

    this.empresas.forEach((empresa, index) => {
      const li = document.createElement("li");
      li.classList.add("empresa-item");

      li.innerHTML = `
                <div class="empresa-details">
                    <strong>${empresa.nome}</strong>
                    <p>Email: ${empresa.email}</p>
                    <p>Área: ${empresa.area}</p>
                    <p>Membros: ${empresa.membros}</p>
                    <p>${empresa.descricao}</p>
                </div>
                <div class="empresa-actions">
                    <button class="edit" onclick="empresaController.editarEmpresa(${index})">Editar</button>
                    <button class="delete" onclick="empresaController.deletarEmpresa(${index})">Excluir</button>
                </div>
            `;

      this.empresaListElement.appendChild(li);
    });
  }

  editarEmpresa(index) {
    const empresa = this.empresas[index];
    document.getElementById("nome").value = empresa.nome;
    document.getElementById("email").value = empresa.email;
    document.getElementById("area").value = empresa.area;
    document.getElementById("membros").value = empresa.membros;
    document.getElementById("descricao").value = empresa.descricao;

    this.empresas.splice(index, 1);
    this.atualizarLista();
  }

  deletarEmpresa(index) {
    this.empresas.splice(index, 1);
    this.atualizarLista();
  }

  async inicializarAutocomplete() {
    const fetchAreasDeTrabalho = async (query) => {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v2/cnae/classes`
        );

        if (!response.ok) {
          console.error(
            "Erro ao buscar dados da API do IBGE:",
            response.statusText
          );
          return [];
        }

        const data = await response.json();
        return data
          .map((item) => item.descricao) // Captura a descrição da classe CNAE
          .filter((area) => area.toLowerCase().includes(query.toLowerCase())); // Filtra as áreas
      } catch (error) {
        console.error("Erro na requisição da API:", error);
        return [];
      }
    };

    $("#area").on("input", async function () {
      const query = $(this).val();
      if (query.length > 1) {
        const areas = await fetchAreasDeTrabalho(query);
        $("#area").autocomplete({
          source: areas,
        });
      }
    });
  }
}

const inputMembros = document.getElementById("membros");

inputMembros.addEventListener("input", function () {
  let valor = inputMembros.value;

  let numero = valor.replace(/\D/g, "");

  let pontoIndex = valor.indexOf(".");
  if (pontoIndex !== -1) {
    let parteInteira = numero.slice(0, pontoIndex);
    let parteDecimal = numero.slice(pontoIndex);

    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    valor = parteInteira + parteDecimal;
  } else {
    valor = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  inputMembros.value = valor;
});

const empresaController = new EmpresaController();
empresaController.inicializarAutocomplete();
