/**
 * ============================================================
 * PROJETO: POKÉDEX JS
 * Conceitos: Fetch API, Async/Await, Try/Catch, DOM Manipulation
 * ============================================================
 */

// Função principal disparada pelo formulário HTML
// O 'async' avisa que teremos operações demoradas (internet) aqui dentro.
async function buscarPokemon(event) {
    
    // 1. PREVENÇÃO DE COMPORTAMENTO PADRÃO
    // Impede que o botão 'submit' recarregue a página, o que apagaria tudo.
    event.preventDefault();

    // 2. CAPTURA E TRATAMENTO DE DADOS
    const pPokemon = document.getElementById("input-busca").value;
    // A API só aceita nomes minúsculos (ex: 'Pikachu' dá erro, 'pikachu' funciona).
    const prcPokemon = pPokemon.toLowerCase();

    try {
        // --- BLOCO DE TENTATIVA (CAMINHO FELIZ) ---
        
        // Limpeza preventiva: Garante que mensagens de erro antigas sumam 
        // assim que tentamos uma nova busca.
        document.getElementById("msg-erro").style.display = "none";

        // 3. REQUISIÇÃO (FETCH)
        // O 'await' pausa a execução até o servidor responder.
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${prcPokemon}`);
        
        // 4. VERIFICAÇÃO DE STATUS (O Guardião)
        // O fetch não falha sozinho com erro 404. Precisamos checar manualmente.
        if (!resposta.ok) {
            // Se a resposta não for OK, lançamos um erro manual para pular pro 'catch'.
            throw new Error('Nao encontrado');
        }

        // 5. CONVERSÃO DE DADOS
        // Transforma o "pacote bruto" da internet em um Objeto JavaScript útil.
        const dados = await resposta.json();
        console.log(dados); // Debug para ver o que chegou

        // 6. MANIPULAÇÃO DO DOM (Pintando a tela)
        
        // Imagem:
        const imgPokemon = document.getElementById("img-pokemon");
        imgPokemon.src = dados.sprites.front_default;
        imgPokemon.style.display = 'block'; // Mostra a imagem (que começa oculta)

        // Textos:
        const nomePokemon = document.getElementById("nome-pokemon");
        nomePokemon.innerText = `${dados.name}`;

        const numeroPokemon = document.getElementById("numero-pokemon");
        numeroPokemon.innerText = `#${dados.id}`; // Adicionamos um '#' para estilo

        // 7. MANIPULAÇÃO DE LISTAS (Tipos)
        const divTipos = document.getElementById("tipos-pokemon");
        divTipos.innerHTML = ""; // Limpa tipos do pokemon anterior

        // Percorre o array de tipos e cria uma etiqueta <span> para cada um
        dados.types.forEach(item => {
            // item.type.name contém o texto (ex: "fire")
            divTipos.innerHTML += `<span class="tipo">${item.type.name}</span>`;
        });

    } catch (erro) {
        // --- BLOCO DE ERRO (CAMINHO TRISTE) ---
        // Só cai aqui se a internet cair OU se o Pokémon não existir.

        // Mostra a mensagem de erro vermelha
        document.getElementById("msg-erro").style.display = "block";
        
        // Limpa a tela para não mostrar dados misturados (ex: nome antigo com erro novo)
        document.getElementById("img-pokemon").style.display = "none";
        document.getElementById("nome-pokemon").innerText = "";
        document.getElementById("numero-pokemon").innerText = "";
    }
}